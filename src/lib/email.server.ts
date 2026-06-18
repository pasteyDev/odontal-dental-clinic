import process from "node:process";

const BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

type SendEmailInput = {
  toEmail: string;
  toName?: string | null;
  subject: string;
  body: string;
  unsubscribeUrl?: string | null;
};

type BrevoResponse = {
  messageId?: string;
  code?: string;
  message?: string;
};

export function getEmailConfig() {
  const dailyLimit = Number.parseInt(process.env.EMAIL_DAILY_SEND_LIMIT ?? "250", 10);
  return {
    apiKey: process.env.BREVO_API_KEY,
    senderEmail: process.env.BREVO_SENDER_EMAIL,
    senderName: process.env.BREVO_SENDER_NAME || "Odontal Dental Clinic",
    dailyLimit: Number.isFinite(dailyLimit) && dailyLimit > 0 ? dailyLimit : 250,
  };
}

function assertEmailConfig() {
  const config = getEmailConfig();
  const missing = [
    ...(!config.apiKey ? ["BREVO_API_KEY"] : []),
    ...(!config.senderEmail ? ["BREVO_SENDER_EMAIL"] : []),
  ];
  if (missing.length > 0) {
    throw new Error(`Missing email environment variable(s): ${missing.join(", ")}`);
  }
  return config as ReturnType<typeof getEmailConfig> & { apiKey: string; senderEmail: string };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function bodyToHtml(body: string) {
  return body
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export function renderEmailHtml(input: SendEmailInput) {
  const unsubscribe = input.unsubscribeUrl
    ? `<p style="margin-top:28px;font-size:12px;color:#6b7280">You are receiving this because you subscribed to Odontal Dental Clinic updates. <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#0f766e">Unsubscribe</a>.</p>`
    : "";

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(input.subject)}</title>
  </head>
  <body style="margin:0;background:#f8f5f1;color:#1f2933;font-family:Arial,sans-serif">
    <div style="max-width:640px;margin:0 auto;padding:32px 18px">
      <div style="background:#ffffff;border:1px solid #eadfd8;border-radius:14px;padding:28px">
        <div style="font-size:18px;font-weight:700;color:#0f766e">Odontal Dental Clinic</div>
        <div style="margin-top:20px;font-size:15px;line-height:1.65;color:#263238">
          ${bodyToHtml(input.body)}
        </div>
        ${unsubscribe}
      </div>
      <p style="margin:16px 4px 0;font-size:12px;line-height:1.5;color:#6b7280">
        Odontal Dental Clinic, Aguda, Surulere, Lagos.
      </p>
    </div>
  </body>
</html>`;
}

export function renderEmailText(input: SendEmailInput) {
  const footer = input.unsubscribeUrl
    ? `\n\nUnsubscribe: ${input.unsubscribeUrl}`
    : "";
  return `${input.body.trim()}\n\nOdontal Dental Clinic, Aguda, Surulere, Lagos.${footer}`;
}

export async function sendBrevoEmail(input: SendEmailInput) {
  const config = assertEmailConfig();
  const response = await fetch(BREVO_SEND_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": config.apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: config.senderName, email: config.senderEmail },
      to: [{ email: input.toEmail, name: input.toName || undefined }],
      subject: input.subject,
      htmlContent: renderEmailHtml(input),
      textContent: renderEmailText(input),
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as BrevoResponse;
  if (!response.ok) {
    throw new Error(payload.message || `Brevo rejected the email (${response.status})`);
  }
  if (!payload.messageId) {
    throw new Error("Brevo accepted the request but did not return a message id.");
  }
  return { messageId: payload.messageId };
}
