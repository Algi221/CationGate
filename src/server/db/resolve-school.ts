import { getSupabaseClient } from './supabase';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

export async function resolveSchoolUUID(
  schoolIdOrSlug: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inMemSchools?: Map<string, any>
): Promise<string | null> {
  if (!schoolIdOrSlug) return null;

  const strVal = String(schoolIdOrSlug).trim();

  if (isValidUUID(strVal)) {
    return strVal;
  }

  if (inMemSchools) {
    for (const [, school] of inMemSchools) {
      if (String(school.id) === strVal && isValidUUID(String(school.id))) {
        return String(school.id);
      }
    }

    const memSchool = inMemSchools.get(strVal);
    if (memSchool && isValidUUID(String(memSchool.id))) {
      return String(memSchool.id);
    }
  }

  const supabase = getSupabaseClient();

  if (inMemSchools) {
    for (const [slug, school] of inMemSchools) {
      if (String(school.id) === strVal) {

        const { data } = await supabase.from('schools').select('id').eq('slug', slug).maybeSingle();
        if (data?.id) {

          school.id = data.id;
          return String(data.id);
        }
      }
    }
  }

  const { data: slugLookup } = await supabase.from('schools').select('id').eq('slug', strVal).maybeSingle();
  if (slugLookup?.id) {
    return String(slugLookup.id);
  }

  if (inMemSchools) {
    if (inMemSchools.has(strVal)) {
      const id = String(inMemSchools.get(strVal).id || strVal);
      if (isValidUUID(id)) return id;
    }
    for (const [_slug, school] of inMemSchools) {
      if (String(school.id) === strVal) {
        const id = String(school.id);
        if (isValidUUID(id)) return id;
      }
    }
  }

  return null;
}
