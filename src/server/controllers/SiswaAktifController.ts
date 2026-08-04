import { Context } from 'hono';

export class SiswaAktifController {
  static async index(c: Context) {
    return c.json({ message: 'SiswaAktifController' });
  }
}
