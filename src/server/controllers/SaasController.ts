import { Context } from 'hono';

export class SaasController {
  static async index(c: Context) {
    return c.json({ message: 'SaasController' });
  }
}
