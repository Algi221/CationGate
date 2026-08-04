import { Context } from 'hono';

export class GatekeeperController {
  static async index(c: Context) {
    return c.json({ message: 'GatekeeperController' });
  }
}
