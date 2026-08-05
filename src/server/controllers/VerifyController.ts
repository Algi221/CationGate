import { Context } from 'hono';

export class VerifyController {
  static async index(c: Context) {
    return c.json({ message: 'VerifyController' });
  }
}
