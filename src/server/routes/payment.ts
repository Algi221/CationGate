import { Hono, Context } from 'hono';
import { getSupabaseClient } from '../db/supabase';
import { confirmPaymentSchema } from '../validations/payment';

const paymentRouter = new Hono();

// PUBLIC: POST Confirm Payment Option (Transfer Manual or Bayar Tunai)
paymentRouter.post('/confirm-payment-option', async (c: Context) => {
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

    const supabase = getSupabaseClient(c.req.header('Authorization'));

    const updateData: any = {
      bukti_bayar: bukti_bayar || null,
      metode_pembayaran: metode_pembayaran
    };
    
    const { data: updatedRecord, error } = await supabase
      .from('student_applicants')
      .update(updateData)
      .eq('nisn', nisn)
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
