import _https from 'https';

let cachedChatId: string | null = process.env.TELEGRAM_CHAT_ID || null;

async function discoverChatId(token: string): Promise<string | null> {
  try {
    const url = `https://api.telegram.org/bot${token}/getUpdates`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[Telegram Bot] Failed to fetch updates: ${response.statusText}`);
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await response.json();
    if (data.ok && data.result && data.result.length > 0) {
      // Search for the last valid chat interaction
      for (let i = data.result.length - 1; i >= 0; i--) {
        const update = data.result[i];
        const chat = update.message?.chat || 
                     update.channel_post?.chat || 
                     update.edited_message?.chat || 
                     update.callback_query?.message?.chat;
        if (chat && chat.id) {
          const discoveredId = String(chat.id);
          console.log(`[Telegram Bot] Auto-discovered Chat ID: ${discoveredId} (${chat.title || chat.username || chat.first_name || 'unknown'})`);
          return discoveredId;
        }
      }
    }
    console.warn('[Telegram Bot] Auto-discovery: No message history found. Please send a message (e.g. "/start") to the bot first.');
    return null;
  } catch (error: unknown) {
    console.error(`[Telegram Bot] Error during auto-discovery: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

export async function sendTelegramNotification(message: string): Promise<{ success: boolean; message: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('[Telegram Bot] TELEGRAM_BOT_TOKEN is not configured in .env.');
    return { success: false, message: 'TELEGRAM_BOT_TOKEN belum dikonfigurasi di file .env' };
  }

  let chatId = cachedChatId || process.env.TELEGRAM_CHAT_ID;
  if (!chatId) {
    console.log('[Telegram Bot] TELEGRAM_CHAT_ID is empty. Attempting auto-discovery...');
    const discovered = await discoverChatId(token);
    if (discovered) {
      chatId = discovered;
      cachedChatId = discovered;
    } else {
      console.warn('[Telegram Bot] Notification skipped because no Chat ID could be found.');
      return { success: false, message: 'Chat ID tidak ditemukan. Kirim pesan ke bot terlebih dahulu.' };
    }
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (response.ok) {
      console.log(`[Telegram Bot] Notification sent successfully to Chat ID ${chatId}`);
      return { success: true, message: `Pesan berhasil dikirim ke Chat ID: ${chatId}` };
    } else {
      const errorText = await response.text();
      // Auto-heal if Chat ID is invalid ("chat not found")
      if (errorText.includes("chat not found")) {
        console.warn(`[Telegram Bot] Chat ID "${chatId}" not found. Attempting to rediscover via /getUpdates...`);
        cachedChatId = null;
        const discovered = await discoverChatId(token);
        if (discovered && discovered !== chatId) {
          cachedChatId = discovered;
          const retryRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: discovered, text: message, parse_mode: 'HTML' })
          });
          if (retryRes.ok) {
            console.log(`[Telegram Bot] Notification sent successfully to rediscovered Chat ID ${discovered}`);
            return { success: true, message: `Pesan berhasil dikirim ke Chat ID baru: ${discovered}` };
          }
        }
      }
      console.warn(`[Telegram Bot] Failed to send message: ${response.status} - ${errorText}`);
      return { success: false, message: `Gagal mengirim: ${response.status} - ${errorText}` };
    }
  } catch (error: unknown) {
    console.warn(`[Telegram Bot] Network error sending notification: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, message: `Network error: ${error instanceof Error ? error.message : String(error)}` };
  }
}

export async function notifyGatekeeperLogin(params: {
  username: string;
  nama: string;
  ip?: string;
  userAgent?: string;
}): Promise<{ success: boolean; message: string }> {
  const now = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const text = `<b>[GATEKEEPER LOGIN]</b>\n` +
    `Nama: ${params.nama}\n` +
    `Username: <code>${params.username}</code>\n` +
    `Waktu: ${now} WIB\n` +
    `IP Address: <code>${params.ip || '-'}</code>\n` +
    `Perangkat: <code>${params.userAgent || '-'}</code>\n` +
    `Status: Autentikasi Berhasil`;

  return sendTelegramNotification(text);
}
