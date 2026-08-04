import { Context } from 'hono';

export class ConfigController {
  static async index(c: Context) {
    return c.json({ message: 'ConfigController' });
  }
}
