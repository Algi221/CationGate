import { Context } from 'hono';

export class KuotaController {
  static async index(c: Context) {
    return c.json({ message: 'KuotaController' });
  }
}
