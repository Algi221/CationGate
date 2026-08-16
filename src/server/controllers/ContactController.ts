import { Context } from "hono";
import { EmailService } from "../services/EmailService";

export const handleContactForm = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, message } = body;

    if (!name || !email) {
      return c.json({ error: "Nama dan Email wajib diisi" }, 400);
    }

    await EmailService.sendContactEmail({
      name,
      email,
      phone,
      message,
    });

    return c.json({ message: "Pesan berhasil dikirim" }, 200);

  } catch (error) {
    console.error("Gagal mengirim email contact:", error);
    
    return c.json({ error: "Terjadi kesalahan internal pada server" }, 500);
  }
};