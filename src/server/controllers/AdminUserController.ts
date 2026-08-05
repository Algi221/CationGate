import { Context } from 'hono';

export class AdminUserController {
  static async index(c: Context) {
    return c.json({ message: 'AdminUserController' });
  }
}
