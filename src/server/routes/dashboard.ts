import { Hono, Context } from 'hono';
import { adminAuth, requireTenantId, TenantError } from '../middleware/auth';
import { getSupabaseClient } from '../db/supabase';

const appRouter = new Hono();

appRouter.get('/stats', adminAuth, async (c: Context) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const resolvedId = await requireTenantId(c);

    const { data, error } = await supabase.rpc('get_dashboard_stats', {
      p_school_id: resolvedId
    });

    if (error) {
      console.warn('Dashboard stats RPC warning, trying direct count:', error.message);

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
    if (err instanceof TenantError) {
      return c.json({ success: false, message: 'Akses ditolak: Tenant tidak ditemukan.' }, 404);
    }
    console.warn('Fetch dashboard stats exception, returning fallback zeroes:', err instanceof Error ? err.message : String(err));
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
