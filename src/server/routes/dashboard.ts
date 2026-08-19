import { Hono, Context } from 'hono';
import { adminAuth } from '../middleware/auth';
import { getSupabaseClient } from '../db/supabase';
import { resolveSchoolUUID } from '../db/resolve-school';
import { fontInMemSchools } from './saas';

const appRouter = new Hono();

appRouter.get('/stats', adminAuth, async (c: Context) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id');

    if (!schoolId) {
      return c.json({ success: false, message: 'Parameter school_id wajib disertakan.' }, 400);
    }

    // Resolve to actual UUID from Supabase
    const resolvedId = await resolveSchoolUUID(String(schoolId), fontInMemSchools);

    // If we can't resolve the UUID, return zeroed stats (new school not yet in DB)
    if (!resolvedId) {
      return c.json({
        success: true,
        data: {
          total_pendaftar: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          berkas_fisik_verified: 0,
          siswa_aktif: 0
        }
      });
    }

    // Try RPC first, fall back to direct count queries
    const { data, error } = await supabase.rpc('get_dashboard_stats', {
      p_school_id: resolvedId
    });

    if (error) {
      console.warn('Dashboard stats RPC warning, trying direct count:', (error as any).message);
      
      // Fallback: direct count queries instead of broken RPC
      const { count: totalCount } = await supabase.from('student_applicants').select('*', { count: 'exact', head: true }).eq('school_id', resolvedId);
      const { count: pendingCount } = await supabase.from('student_applicants').select('*', { count: 'exact', head: true }).eq('school_id', resolvedId).eq('status', 'Pending');
      const { count: approvedCount } = await supabase.from('student_applicants').select('*', { count: 'exact', head: true }).eq('school_id', resolvedId).eq('status', 'Approved');
      const { count: rejectedCount } = await supabase.from('student_applicants').select('*', { count: 'exact', head: true }).eq('school_id', resolvedId).eq('status', 'Rejected');
      const { count: siswaAktifCount } = await supabase.from('active_students').select('*', { count: 'exact', head: true }).eq('school_id', resolvedId);

      return c.json({
        success: true,
        data: {
          total_pendaftar: totalCount || 0,
          pending: pendingCount || 0,
          approved: approvedCount || 0,
          rejected: rejectedCount || 0,
          berkas_fisik_verified: 0,
          siswa_aktif: siswaAktifCount || 0
        }
      });
    }

    return c.json({
      success: true,
      data: data
    });
  } catch (err: unknown) {
    console.warn('Fetch dashboard stats exception, returning fallback zeroes:', (err as any)?.message);
    return c.json({
      success: true,
      data: {
        total_pendaftar: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        berkas_fisik_verified: 0,
        siswa_aktif: 0
      }
    });
  }
});

export default appRouter;
