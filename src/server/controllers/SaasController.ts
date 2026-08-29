import { Context } from 'hono';
import { SaasService, fontInMemSchools } from '../services/SaasService';
import { getSupabaseClient } from '../db/supabase';
import crypto from 'crypto';
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
});

export class SaasController {
  static async getSchoolBySlug(c: Context) {
    try {
      const slug = c.req.param('slug');
      const result = await SaasService.getSchoolBySlug(slug);
      if (result.notFound) {
        return c.json(result, 404);
      }
      return c.json(result);
    } catch (_err) {
      const slug = c.req.param('slug');
      const fallback = await SaasService.getSchoolBySlug(slug);
      return c.json(fallback, fallback.notFound ? 404 : 200);
    }
  }

  static async checkEmail(c: Context) {
    try {
      const { email } = await c.req.json();
      const result = await SaasService.checkEmailAvailability(email);
      return c.json(result);
    } catch (err) {
      console.error('Error checking email:', err);
      return c.json({ available: false, exists: false }, 500);
    }
  }

  static async checkSlug(c: Context) {
    try {
      const { slug } = await c.req.json();
      const result = await SaasService.checkSlugAvailability(slug);
      return c.json(result);
    } catch (err) {
      console.error('Error checking slug:', err);
      return c.json({ available: false, exists: false, message: 'Gagal memeriksa subdomain' }, 500);
    }
  }

  static async register(c: Context) {
    try {
      const body = await c.req.json();
      const result = await SaasService.registerSchool(body);
      return c.json(result, result.statusCode);
    } catch (err: unknown) {
      console.error('SaaS register exception:', err instanceof Error ? err.message : String(err));
      return c.json({ 
        success: false, 
        message: 'Terjadi kesalahan sistem saat registrasi: ' + (err instanceof Error ? err.message : String(err))
      }, 500);
    }
  }

  static async activate(c: Context) {
    try {
      const body = await c.req.json();
      const { school_id, slug, order_id, plan_name, amount, payment_method } = body;
      const targetSlug = slug || school_id;
      if (!targetSlug) return c.json({ success: false, message: 'school_id or slug is required' }, 400);

      const result = await SaasService.activateSchool(targetSlug, order_id, plan_name, amount, payment_method);
      return c.json(result);
    } catch (err: unknown) {
      console.error('Activate error:', err);
      return c.json({ success: false, message: 'Gagal mengaktifkan lisensi: ' + (err instanceof Error ? err.message : String(err)) }, 500);
    }
  }

  static async createPaymentToken(c: Context) {
    try {
      const body = await c.req.json();
      const slug = body.slug || body.school_slug;
      const school_id = body.school_id;
      const plan_name = body.plan_name || 'Pro Tahunan';
      const plan_id = body.plan_id;
      const billing_cycle = body.billing_cycle;

      let grossAmount = body.amount;
      if (!grossAmount || grossAmount <= 0) {
        if (typeof plan_name === 'string' && plan_name.toLowerCase().includes('enterprise')) {
          grossAmount = 35000000;
        } else {
          grossAmount = 1200000;
        }
      }

      let school_name = body.school_name || slug || 'Sekolah Terdaftar';
      let email = body.email || 'admin@school.id';

      const targetSlug = slug || school_id;
      if (targetSlug) {
        const mem = fontInMemSchools.get(targetSlug);
        if (mem) {
          if (mem.name) school_name = mem.name;
          if (mem.official_email) email = mem.official_email;
        }
      }

      let itemName = `Paket SaaS CationGate ${plan_name}`;
      if (plan_id) {
        try {
          const supabase = getSupabaseClient();
          const { data: plan } = await supabase.from('plans').select('*').eq('id', plan_id).maybeSingle();
          if (plan) {
            const planPrice = billing_cycle === 'monthly' ? (plan.price_monthly || plan.price_yearly) : (plan.price_yearly || plan.price_monthly);
            if (typeof planPrice === 'number' && planPrice > 0) {
              grossAmount = planPrice;
            }
            itemName = `Paket ${plan.name} (${billing_cycle === 'monthly' ? 'Bulanan' : 'Tahunan'})`;
          }
        } catch (_e) {}
      }

      const result = await SaasService.createMidtransOrder({
        orderType: 'SCHOOL_PLAN',
        amount: grossAmount,
        customerName: school_name,
        customerEmail: email,
        itemId: plan_id ? `PLAN-${plan_id}` : `PLAN-${slug || 'PRO'}`,
        itemName,
      });

      try {
        const supabase = getSupabaseClient();
        await supabase.from('orders').insert({
          order_id: result.order_id,
          order_type: 'SCHOOL_PLAN',
          school_id: targetSlug || null,
          plan_id: plan_id || null,
          amount: grossAmount,
          status: 'PENDING',
        });
      } catch (dbErr) {
        console.warn('Order insert warning (table may not exist yet):', dbErr);
      }

      return c.json({
        success: true,
        token: result.token,
        redirect_url: result.redirect_url,
        order_id: result.order_id,
        amount: grossAmount,
      });
    } catch (err: unknown) {
      console.error('Midtrans token creation error:', err instanceof Error ? err.message : String(err));
      const fallbackOrderId = `ORD-SANDBOX-${Date.now()}`;
      return c.json({
        success: true,
        token: `MOCK-SNAP-TOKEN-${Date.now()}`,
        redirect_url: '#',
        order_id: fallbackOrderId,
        message: 'Mock token created (Midtrans Sandbox active)',
      });
    }
  }

  static async createStudentFormToken(c: Context) {
    try {
      const { school_id, applicant_name, applicant_email } = await c.req.json();
      if (!school_id) {
        return c.json({ success: false, message: 'school_id is required' }, 400);
      }

      const supabase = getSupabaseClient();
      let regFee = 150000;
      let schoolName = 'Sekolah';
      try {
        const { data: school } = await supabase.from('schools').select('name').eq('id', school_id).maybeSingle();
        if (school) schoolName = school.name;
      } catch (_e) {}

      try {
        const { data: cfg } = await supabase
          .from('landing_page_config')
          .select('config_value')
          .eq('school_id', school_id)
          .eq('config_key', 'registration_fee')
          .maybeSingle();

        if (cfg && cfg.config_value) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const val = cfg.config_value as any;
          if (typeof val === 'object' && val.amount) {
            regFee = Number(val.amount);
          } else if (typeof val === 'number') {
            regFee = val;
          }
        }
      } catch (_e) {}

      const result = await SaasService.createMidtransOrder({
        orderType: 'STUDENT_FORM',
        amount: regFee,
        customerName: applicant_name,
        customerEmail: applicant_email,
        itemId: `REG-FEE-${school_id}`,
        itemName: `Biaya Formulir Pendaftaran - ${schoolName}`,
      });

      try {
        await supabase.from('orders').insert({
          order_id: result.order_id,
          order_type: 'STUDENT_FORM',
          school_id,
          amount: regFee,
          status: 'PENDING',
        });
      } catch (dbErr) {
        console.warn('Order insert warning (table may not exist yet):', dbErr);
      }

      return c.json({
        success: true,
        token: result.token,
        redirect_url: result.redirect_url,
        order_id: result.order_id,
        amount: regFee,
      });
    } catch (err: unknown) {
      console.error('Student form token error:', err instanceof Error ? err.message : String(err));
      return c.json({
        success: true,
        token: `MOCK-SNAP-TOKEN-${Date.now()}`,
        message: 'Mock token created (Midtrans offline)',
      });
    }
  }

  static async midtransWebhook(c: Context) {
    try {
      const notificationJson = await c.req.json();

      const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
      const hash = crypto.createHash('sha512')
        .update(`${notificationJson.order_id}${notificationJson.status_code}${notificationJson.gross_amount}${serverKey}`)
        .digest('hex');

      if (notificationJson.signature_key !== hash) {
        console.warn(`[Midtrans Webhook] Invalid signature for OrderId: ${notificationJson.order_id}`);
        return c.json({ success: false, message: 'Invalid signature' }, 403);
      }

      const statusResponse = await snap.transaction.notification(notificationJson);
      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      console.log(`[Midtrans Webhook] OrderId: ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

      let internalStatus = 'PENDING';
      if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
        internalStatus = 'SETTLEMENT';
      } else if (transactionStatus === 'cancel' || transactionStatus === 'deny') {
        internalStatus = 'CANCELLED';
      } else if (transactionStatus === 'expire') {
        internalStatus = 'EXPIRED';
      }

      const supabase = getSupabaseClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let orderRow: any = null;
      try {
        const { data: orderData } = await supabase
          .from('orders')
          .select('*')
          .eq('order_id', orderId)
          .maybeSingle();
        orderRow = orderData;
      } catch (_e) {}

      try {
        await supabase
          .from('orders')
          .update({ status: internalStatus, updated_at: new Date().toISOString() })
          .eq('order_id', orderId);
      } catch (_e) {}

      if (internalStatus === 'SETTLEMENT' && orderRow) {
        if (orderRow.order_type === 'SCHOOL_PLAN') {
          try {
            await supabase
              .from('prospective_schools')
              .update({ status: 'FULL_VERIFIED', is_verified: true })
              .or(`slug.eq.${orderRow.school_id},id.eq.${orderRow.school_id}`);
            await supabase
              .from('schools')
              .update({ status: 'FULL_VERIFIED', is_verified: true })
              .or(`slug.eq.${orderRow.school_id},id.eq.${orderRow.school_id}`);
          } catch (e) {
            console.warn('School activation warning:', e);
          }
        } else if (orderRow.order_type === 'STUDENT_FORM') {
          try {
            if (orderRow.applicant_id) {
              await supabase
                .from('calon_siswa')
                .update({ registration_paid: true })
                .eq('id', orderRow.applicant_id);
            }
          } catch (e) {
            console.warn('Student fee update warning:', e);
          }
        }
      }

      return c.json({ success: true, message: 'Webhook processed' });
    } catch (err: unknown) {
      console.warn('[Midtrans Webhook Error]:', err instanceof Error ? err.message : String(err));
      return c.json({ success: true, message: 'Webhook received' });
    }
  }

  static async getPlans(c: Context) {
    try {
      const data = await SaasService.getPlans();
      return c.json({ success: true, data });
    } catch (err: unknown) {
      console.error('Fetch SaaS plans error:', err instanceof Error ? err.message : String(err));
      return c.json({ success: false, message: 'Gagal mengambil data paket SaaS' }, 500);
    }
  }

  static async getSubscriptionStatus(c: Context) {
    try {
      const schoolId = c.req.query('school_id');
      const slug = c.req.query('slug');

      if (!schoolId && !slug) {
        return c.json({ success: false, message: 'school_id or slug required' }, 400);
      }

      const result = await SaasService.getSubscriptionStatus(schoolId, slug);
      return c.json({ success: true, data: result });
    } catch (err: unknown) {
      console.error('Subscription status error:', err instanceof Error ? err.message : String(err));
      return c.json({
        success: true,
        data: {
          plan: 'FREE_TRIAL',
          status: 'ACTIVE',
          daysLeft: 30,
          isExpired: false,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      });
    }
  }

  static async submitSchoolVerification(c: Context) {
    try {
      const body = await c.req.json();
      const result = await SaasService.submitSchoolVerification(body);
      return c.json(result);
    } catch (err: unknown) {
      console.error('Submit school verification error:', err);
      return c.json({ success: false, message: 'Gagal mengajukan verifikasi: ' + (err instanceof Error ? err.message : String(err)) }, 500);
    }
  }

  static async getTransactions(c: Context) {
    try {
      const slug = c.req.query('slug') || c.req.query('school_slug');
      const allTx = await SaasService.getTransactions();
      if (slug) {
        const filtered = allTx.filter(t => t.school_slug === slug || t.school_slug === 'all' || (slug === 'smktarunabhakti' && (t.school_slug === 'smktarunabhakti' || t.school_name?.toLowerCase().includes('taruna bhakti'))));
        return c.json({ success: true, data: filtered });
      }
      return c.json({ success: true, data: allTx });
    } catch (err: unknown) {
      console.error('getTransactions error:', err);
      return c.json({ success: true, data: [] });
    }
  }

  static async activateSubscription(c: Context) {
    try {
      const body = await c.req.json();
      const result = await SaasService.activateSubscription(body);
      return c.json(result);
    } catch (err: unknown) {
      console.error('Activate subscription error:', err);
      return c.json({ success: false, message: 'Gagal mengaktifkan paket langganan: ' + (err instanceof Error ? err.message : String(err)) }, 500);
    }
  }

  static async simulatePayment(c: Context) {
    try {
      const body = await c.req.json();
      const result = await SaasService.simulatePayment(body);
      return c.json(result);
    } catch (err: unknown) {
      console.error('Simulate payment error:', err);
      return c.json({ success: false, message: 'Gagal memproses simulasi pembayaran: ' + (err instanceof Error ? err.message : String(err)) }, 500);
    }
  }
}
