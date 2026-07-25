import dotenv from 'dotenv';

dotenv.config();

let cachedChatId: string | null = process.env.TELEGRAM_CHAT_ID || null;


async function discoverChatId(token: string): Promise<string | null> {
  try {
    const url = `https://api.telegram.org/bot${token}/getUpdates`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[Telegram Bot] Failed to fetch updates: ${response.statusText}`);
      return null;
    }
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
  } catch (error: any) {
    console.error(`[Telegram Bot] Error during auto-discovery: ${error.message}`);
    return null;
  }
}


export async function sendTelegramNotification(message: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('[Telegram Bot] TELEGRAM_BOT_TOKEN is not configured in .env. Skipping notification.');
    return false;
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
      return false;
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
      return true;
    } else {
      const errorText = await response.text();
      console.error(`[Telegram Bot] Failed to send message: ${response.status} ${response.statusText} - ${errorText}`);
      return false;
    }
  } catch (error: any) {
    console.error(`[Telegram Bot] Network error sending notification: ${error.message}`);
    return false;
  }
}
