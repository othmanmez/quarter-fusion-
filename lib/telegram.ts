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
  lines.push('');
  lines.push(`📌 Numéro: ${order.orderNumber}`);
  lines.push(`🛒 Type: ${order.isDelivery ? 'Livraison' : 'Click & Collect'}`);
  lines.push(`💳 Paiement: ${order.paymentMethod}`);
  lines.push(`💰 Total: ${order.total.toFixed(2)}€`);
  lines.push('');
  lines.push(`👤 Client: ${order.customerName}`);
  if (order.customerPhone) lines.push(`📞 Tél: ${order.customerPhone}`);
  if (order.isDelivery) {
    const addrParts = [order.deliveryAddress, order.city].map((p) => (p ?? '').trim()).filter(Boolean);
    if (addrParts.length) lines.push(`📍 Adresse: ${addrParts.join(', ')}`);
  }
  lines.push('');
  lines.push('🧾 Détails:');
  for (const item of order.items) {
    const base = `- x${item.quantity} ${item.title}`;
    const extraTotal = (item.customizations || []).reduce((sum, c) => sum + (typeof c.priceExtra === 'number' ? c.priceExtra : 0), 0);
    const unit = (item.price + extraTotal).toFixed(2);
    lines.push(`${base} (${unit}€ / unité)`);

    const customs = (item.customizations || [])
      .map((c) => {
        const opts = (c.selectedOptions || []).filter(Boolean);
        if (opts.length) return `${c.name}: ${opts.join(', ')}`;
        return c.name;
      })
      .filter(Boolean);
    if (customs.length) lines.push(`  • ${customs.join(' | ')}`);
  }

  if (order.notes && order.notes.trim()) {
    lines.push('');
    lines.push(`📝 Notes: ${order.notes.trim()}`);
  }

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

