import { Context } from 'hono';

export class InformasiController {
  static async index(c: Context) {
    return c.json({ message: 'InformasiController' });
  }
}
