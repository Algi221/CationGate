import { Hono, Context } from 'hono';
import { adminAuth } from '../middleware/auth';
import { getSupabaseClient } from '../db/supabase';

const appRouter = new Hono();

appRouter.get('/stats', adminAuth, async (c: Context) => {
  try {
    const supabase = getSupabaseClient(c.req.header('Authorization'));
    const schoolId = c.req.query('school_id');

    if (!schoolId) {
      return c.json({ success: false, message: 'Parameter school_id wajib disertakan.' }, 400);
    }

    // Panggil RPC get_dashboard_stats yang sudah di-register di PostgreSQL
    const { data, error } = await supabase.rpc('get_dashboard_stats', {
      p_school_id: parseInt(schoolId)
    });

    if (error) throw error;

    return c.json({
      success: true,
      data: data
    });
  } catch (err: any) {
    console.error('Fetch dashboard stats RPC error:', err);
    return c.json({ success: false, message: 'Gagal mengambil statistik dashboard: ' + err.message }, 500);
  }
});

export default appRouter;
