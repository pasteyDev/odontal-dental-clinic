
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) throw new Error("BREVO_API_KEY is not set.")

  const recipients = Array.isArray(to)
    ? to.map((email) => ({ email }))
    : [{ email: to }]

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "Odontal Dental Clinic", email: "quadriissa942@gmail.com" },
      to: recipients,
      subject,
      htmlContent: html,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error("[Brevo sendEmail error]", body)
    throw new Error("Failed to send email.")
  }
}