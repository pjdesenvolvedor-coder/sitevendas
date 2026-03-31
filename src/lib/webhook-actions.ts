'use server';

/**
 * @fileOverview Ação de servidor para envio de webhooks, contornando CORS.
 */

export async function sendWebhookAction(url: string, payload: any) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PJ-Contas-Webhook-Agent/1.0',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Webhook failed with status ${response.status}: ${text}`);
      return { success: false, status: response.status };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return { success: false, error: error.message };
  }
}
