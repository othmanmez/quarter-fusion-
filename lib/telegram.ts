type TelegramSendMessagePayload = {
  chat_id: string;
  text: string;
  disable_web_page_preview?: boolean;
};

function getTelegramTargetsFromEnv(): { token: string; chatIds: string[] } | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIdsRaw = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatIdsRaw) return null;

  const chatIds = chatIdsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (chatIds.length === 0) return null;

  return { token, chatIds };
}

export type TelegramOrderItem = {
  title: string;
  quantity: number;
  price: number;
  customizations?: Array<{ name: string; selectedOptions?: string[]; priceExtra?: number }>;
};

export type TelegramOrderNotification = {
  orderNumber: string;
  isDelivery: boolean;
  total: number;
  paymentMethod: string;
  customerName: string;
  customerPhone?: string;
  deliveryAddress?: string | null;
  city?: string | null;
  notes?: string | null;
  items: TelegramOrderItem[];
  createdAt?: Date | string;
};

function formatOrderForTelegram(order: TelegramOrderNotification): string {
  const lines: string[] = [];

  lines.push('🍔 Quarter Fusion');
  lines.push('🔔 NOUVELLE COMMANDE À PRÉPARER');
  lines.push('────────────────────────');
  lines.push(`📌 Numéro : ${order.orderNumber}`);
  lines.push(`🛒 Type : ${order.isDelivery ? 'Livraison' : 'Click & Collect'}`);
  lines.push(`💳 Paiement : ${order.paymentMethod}`);
  lines.push(`💰 Total : ${order.total.toFixed(2)}€`);
  lines.push('');
  lines.push('👤 CLIENT');
  lines.push(`- Nom : ${order.customerName}`);
  if (order.customerPhone) lines.push(`- Tél : ${order.customerPhone}`);
  if (order.isDelivery) {
    const addr = (order.deliveryAddress ?? '').trim();
    const city = (order.city ?? '').trim();
    if (addr || city) {
      lines.push('- Adresse :');
      if (addr) lines.push(`  ${addr}`);
      if (city) lines.push(`  ${city}`);
    }
  }
  lines.push('');
  lines.push('🧾 COMMANDE');
  for (const item of order.items) {
    const extraTotal = (item.customizations || []).reduce((sum, c) => sum + (typeof c.priceExtra === 'number' ? c.priceExtra : 0), 0);
    const unit = (item.price + extraTotal).toFixed(2);
    lines.push(`• x${item.quantity} ${item.title}`);
    lines.push(`  Prix unité : ${unit}€`);

    const customs = (item.customizations || []).filter((c) => c && typeof c === 'object');
    if (customs.length) {
      lines.push('  Personnalisations :');
      for (const c of customs) {
        const name = String(c.name ?? '').trim();
        if (!name) continue;
        const opts = Array.isArray(c.selectedOptions) ? c.selectedOptions.filter(Boolean) : [];
        if (opts.length) {
          lines.push(`  - ${name} : ${opts.join(', ')}`);
        } else {
          lines.push(`  - ${name}`);
        }
      }
    }

    lines.push('');
  }

  if (order.notes && order.notes.trim()) {
    lines.push('📝 NOTES');
    lines.push(order.notes.trim());
    lines.push('');
  }

  // Eviter l'espace final inutile
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}

async function sendTelegramMessage(token: string, payload: TelegramSendMessagePayload): Promise<void> {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? (AbortSignal as any).timeout(6500) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Telegram sendMessage failed (${res.status}) ${text}`.trim());
  }
}

/**
 * Envoi non bloquant: si non configuré ou erreur Telegram, on log et on continue.
 */
export async function notifyTelegramNewOrder(order: TelegramOrderNotification): Promise<void> {
  const targets = getTelegramTargetsFromEnv();
  if (!targets) return;

  const text = formatOrderForTelegram(order);

  await Promise.all(
    targets.chatIds.map(async (chat_id) => {
      await sendTelegramMessage(targets.token, {
        chat_id,
        text,
        disable_web_page_preview: true,
      });
    })
  );
}

