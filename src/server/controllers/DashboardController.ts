import { Context } from 'hono';

export class DashboardController {
  static async index(c: Context) {
    return c.json({ message: 'DashboardController' });
  }
}
