import { getSupabaseClient } from './supabase';

/**
 * UUID v4 format regex check.
 * Supabase uses UUID for the `schools.id` column.
 * Any non-UUID value (integer, slug, etc.) must be resolved to the actual UUID.
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Resolves a school_id to the actual UUID stored in Supabase.
 * Handles these cases:
 * - Already a valid UUID → returns as-is
 * - A numeric string (integer fallback ID) → looks up by slug from in-memory map, then by DB
 * - A slug string → looks up by slug in DB
 * Returns the UUID string if found, or null if the school doesn't exist.
 */
export async function resolveSchoolUUID(
  schoolIdOrSlug: string,
  inMemSchools?: Map<string, any>
): Promise<string | null> {
  if (!schoolIdOrSlug) return null;

  const strVal = String(schoolIdOrSlug).trim();

  // Case 1: Already a valid UUID
  if (isValidUUID(strVal)) {
    return strVal;
  }

  // Case 2: Check in-memory map for a matching ID that has a UUID
  if (inMemSchools) {
    for (const [, school] of inMemSchools) {
      if (String(school.id) === strVal && isValidUUID(String(school.id))) {
        return String(school.id);
      }
    }
    // Check if it's a slug in memory
    const memSchool = inMemSchools.get(strVal);
    if (memSchool && isValidUUID(String(memSchool.id))) {
      return String(memSchool.id);
    }
  }

  // Case 3: Look up by slug in Supabase
  const supabase = getSupabaseClient();
  
  // If it looks numeric, we can't query by id (it's UUID in DB). 
  // Try to find a school whose slug matches any in-memory entry with this numeric id.
  if (inMemSchools) {
    for (const [slug, school] of inMemSchools) {
      if (String(school.id) === strVal) {
        // Found matching in-memory school by numeric ID - look up its UUID by slug
        const { data } = await supabase.from('schools').select('id').eq('slug', slug).maybeSingle();
        if (data?.id) {
          // Update in-memory with real UUID
          school.id = data.id;
          return String(data.id);
        }
      }
    }
  }

  // Case 4: Maybe the value IS a slug directly
  const { data: slugLookup } = await supabase.from('schools').select('id').eq('slug', strVal).maybeSingle();
  if (slugLookup?.id) {
    return String(slugLookup.id);
  }

  // Case 5: Fallback for in-memory schools or special slugs (e.g., 'demo', 'smktarunabhakti', or newly registered numeric IDs)
  if (inMemSchools) {
    if (inMemSchools.has(strVal)) {
      return String(inMemSchools.get(strVal).id || strVal);
    }
    for (const [slug, school] of inMemSchools) {
      if (String(school.id) === strVal) {
        return String(school.id);
      }
    }
  }

  // Return strVal if not empty so caller can query or fallback
  return strVal || null;
}
