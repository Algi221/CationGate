import { Hono, Context } from 'hono';
import prisma from '../db/prisma';
import { broadcast } from '../ws/handler';
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

    const updateData: any = {
      bukti_bayar: bukti_bayar || null,
      metode_pembayaran: metode_pembayaran
    };
    
    const updatedRecord = await prisma.calonSiswa.update({
      where: { nisn },
      data: updateData
    });

    if (!updatedRecord) {
      return c.json({ success: false, message: 'Candidate not found' }, 404);
    }

    broadcast({
      event: 'APPLICANT_UPDATED',
      data: updatedRecord
    }, true);

    return c.json({ success: true, message: 'Payment option confirmed successfully', data: updatedRecord });
  } catch (err: any) {
    console.error('Failed to confirm payment option:', err.message);
    return c.json({ success: false, message: 'Failed to confirm payment option' }, 500);
  }
});

export default paymentRouter;
