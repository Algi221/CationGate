import { Hono, Context } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { confirmPaymentSchema } from '../validations/payment';
import { rateLimiter } from '../middleware/rate-limiter';
import { resolveSchoolUUID } from '../db/resolve-school';
import { fontInMemSchools } from './saas';

const paymentRouter = new Hono();

// PUBLIC: POST Confirm Payment Option (Transfer Manual or Bayar Tunai)
paymentRouter.post('/confirm-payment-option', rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }), async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = confirmPaymentSchema.safeParse(body);
    if (!result.success) {
      return c.json({
        success: false,
        message: result.error.issues[0].message,
        errors: result.error.issues.map((err) => err.message)
      }, 400);
    }
    const { nisn, bukti_bayar, metode_pembayaran } = result.data;
    const schoolSlug = String(body.school_slug || '');

    // Tenant scope: resolve school from slug; reject if missing (prevents cross-tenant NISN guessing)
    if (!schoolSlug) {
      return c.json({ success: false, message: 'school_slug wajib diisi.' }, 400);
    }
    const resolvedId = await resolveSchoolUUID(schoolSlug, fontInMemSchools);
    if (!resolvedId) {
      return c.json({ success: false, message: 'Sekolah tidak ditemukan.' }, 404);
    }

    const supabase = getSupabaseClient(c.req.header('Authorization'));

    const updateData: any = {
      bukti_bayar: bukti_bayar || null,
      metode_pembayaran: metode_pembayaran
    };
    
    const { data: updatedRecord, error } = await supabase
      .from('student_applicants')
      .update(updateData)
      .eq('nisn', nisn)
      .eq('school_id', resolvedId)
      .select()
      .single();

    if (error || !updatedRecord) {
      console.error('Supabase update error:', error);
      return c.json({ success: false, message: 'Candidate not found' }, 404);
    }

    return c.json({ success: true, message: 'Payment option confirmed successfully', data: updatedRecord });
  } catch (err: any) {
    console.error('Failed to confirm payment option:', err.message);
    return c.json({ success: false, message: 'Failed to confirm payment option' }, 500);
  }
});

export default paymentRouter;
