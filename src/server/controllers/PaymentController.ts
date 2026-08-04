import { Context } from 'hono';

export class PaymentController {
  static async index(c: Context) {
    return c.json({ message: 'PaymentController' });
  }
}
