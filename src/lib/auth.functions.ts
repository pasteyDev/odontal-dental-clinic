import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { ensureBootstrapAdminRole, loadUserRoles } from "@/lib/admin-auth";

async function sendOtpEmail(to: string, code: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is not set in environment variables.");

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "Odontal Dental Clinic", email: "quadriissa942@gmail.com" },
      to: [{ email: to }],
      subject: "Your sign-in code",
      htmlContent: `
        <p style="font-family:sans-serif;">Your Odontal Dental Clinic admin sign-in code is:</p>
        <h2 style="font-family:monospace;letter-spacing:0.3em;font-size:2rem;">${code}</h2>
        <p style="font-family:sans-serif;color:#666;">
          This code expires in 10 minutes. Do not share it with anyone.
          If you did not request this, please ignore this email.
        </p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[Brevo error]", body);
    throw new Error("Failed to send OTP email.");
  }
}

// ── Step 1: validate password, generate & email OTP ──────────────────────────
export const requestOtp = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ email: z.string().email(), password: z.string().min(1) }).parse(d)
  )
  .handler(async ({ data }) => {
    // 1. Verify credentials — do NOT keep the session
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (authError || !authData.user) {
      throw new Error("Invalid email or password.");
    }

    const userId = authData.user.id;
    const roles = await ensureBootstrapAdminRole(userId);
    if (roles.length === 0) {
      throw new Error("This account is not authorized for admin access.");
    }

    // 2. Invalidate any previous unused codes for this user
    await (supabaseAdmin as any)
      .from("admin_otps")
      .update({ used: true })
      .eq("user_id", userId)
      .eq("used", false);

    // 3. Generate a secure 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 4. Store the OTP — also store the email so we can re-auth after OTP
    //    We never store the plaintext password; instead we'll ask the client
    //    to re-submit it after OTP verification (it's already in memory on the client)
    const { error: insertError } = await (supabaseAdmin as any)
      .from("admin_otps")
      .insert({
        user_id: userId,
        code,
        expires_at: expiresAt,
        email: data.email, // stored so verifyOtp can re-auth without the client resending it
      });

    if (insertError) {
      console.error("[OTP insert error]", insertError);
      throw new Error(`Failed to generate OTP: ${insertError.message}`);
    }

    // 5. Send the code
    await sendOtpEmail(data.email, code);

    // Return userId only — never the code
    return { userId };
  });

// ── Step 2: verify OTP, issue real session via signInWithPassword ─────────────
export const verifyOtp = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      userId: z.string().uuid(),
      code: z.string().length(6),
      password: z.string().min(1), // client re-sends the password it already has in memory
    }).parse(d)
  )
  .handler(async ({ data }) => {
    const now = new Date().toISOString();

    // 1. Find a valid, unused, non-expired code
    const { data: row, error } = await (supabaseAdmin as any)
      .from("admin_otps")
      .select("id, code, expires_at, email")
      .eq("user_id", data.userId)
      .eq("used", false)
      .gt("expires_at", now)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[OTP lookup error]", error);
      throw new Error("Failed to look up code.");
    }
    if (!row) throw new Error("Code not found or expired.");
    if (row.code !== data.code) throw new Error("Incorrect code.");

    const roles = await loadUserRoles(data.userId);
    if (roles.length === 0) {
      throw new Error("This account is not authorized for admin access.");
    }

    // 2. Mark used immediately — prevents replay attacks
    await (supabaseAdmin as any)
      .from("admin_otps")
      .update({ used: true })
      .eq("id", row.id);

    // 3. NOW authenticate for real using the original credentials
    //    This is the only point where a real session is created
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email: row.email,
        password: data.password,
      });

    if (authError || !authData.session) {
      console.error("[final signIn error]", authError);
      throw new Error("Failed to create session.");
    }

    // 4. Return the real tokens to the client
    return {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
    };
  });
