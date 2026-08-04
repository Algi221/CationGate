import { Context } from 'hono';

export class AuthController {
  static async index(c: Context) {
    return c.json({ message: 'AuthController' });
  }
}
