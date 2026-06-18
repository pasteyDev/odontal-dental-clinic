import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import process from "node:process";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getEmailConfig, sendBrevoEmail } from "@/lib/email.server";

const campaignKindSchema = z.enum(["newsletter", "review_request", "custom"]);
const GROUP_EMAIL_ROLES = ["admin", "receptionist"] as const;

async function loadRoles(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.role as "admin" | "staff" | "receptionist");
}

function requireAnyRole(
  roles: Array<"admin" | "staff" | "receptionist">,
  allowed: ReadonlyArray<"admin" | "staff" | "receptionist">,
) {
  if (!roles.some((role) => allowed.includes(role))) throw new Error("Forbidden");
}

function getSiteOrigin() {
  const configured = process.env.VITE_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const request = getRequest();
  const origin = request?.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const host = request?.headers.get("host");
  return host ? `https://${host}` : "";
}

function getTodayStartIso() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
}

async function getRemainingDailySends() {
  const { dailyLimit } = getEmailConfig();
  const { count, error } = await supabaseAdmin
    .from("email_queue")
    .select("id", { count: "exact", head: true })
    .eq("status", "sent")
    .gte("sent_at", getTodayStartIso());
  if (error) throw new Error(error.message);
  return Math.max(0, dailyLimit - (count ?? 0));
}

async function refreshCampaignStats(campaignId: string) {
  const [{ count: total, error: totalError }, { count: sent, error: sentError }, { count: failed, error: failedError }, { count: pending, error: pendingError }] =
    await Promise.all([
      supabaseAdmin
        .from("email_queue")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId),
      supabaseAdmin
        .from("email_queue")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .eq("status", "sent"),
      supabaseAdmin
        .from("email_queue")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .eq("status", "failed"),
      supabaseAdmin
        .from("email_queue")
        .select("id", { count: "exact", head: true })
        .eq("campaign_id", campaignId)
        .eq("status", "pending"),
    ]);

  const firstError = totalError ?? sentError ?? failedError ?? pendingError;
  if (firstError) throw new Error(firstError.message);

  const { data: campaign, error: campaignError } = await supabaseAdmin
    .from("email_campaigns")
    .select("status")
    .eq("id", campaignId)
    .single();
  if (campaignError) throw new Error(campaignError.message);
  if (campaign.status === "cancelled") return;

  const { data: lastFailed } = await supabaseAdmin
    .from("email_queue")
    .select("last_error")
    .eq("campaign_id", campaignId)
    .eq("status", "failed")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextStatus =
    (total ?? 0) > 0 && (pending ?? 0) === 0 && (failed ?? 0) === 0 ? "sent" : "queued";

  const { error } = await supabaseAdmin
    .from("email_campaigns")
    .update({
      recipient_count: total ?? 0,
      sent_count: sent ?? 0,
      failed_count: failed ?? 0,
      status: nextStatus,
      last_error: lastFailed?.last_error ?? null,
      sent_at: nextStatus === "sent" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId);
  if (error) throw new Error(error.message);
}

export const listEmailCampaigns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await loadRoles(context.userId);
    if (roles.length === 0) throw new Error("Forbidden");
    const { data, error } = await supabaseAdmin
      .from("email_campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createEmailCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        kind: campaignKindSchema,
        name: z.string().trim().min(2).max(140),
        subject: z.string().trim().min(2).max(180),
        body: z.string().trim().min(10).max(8000),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    requireAnyRole(roles, GROUP_EMAIL_ROLES);
    const { data: created, error } = await supabaseAdmin
      .from("email_campaigns")
      .insert({
        kind: data.kind,
        name: data.name,
        subject: data.subject,
        body: data.body,
        created_by: context.userId,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return created;
  });

export const enqueueCampaignRecipients = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ campaignId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    requireAnyRole(roles, GROUP_EMAIL_ROLES);

    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from("email_campaigns")
      .select("*")
      .eq("id", data.campaignId)
      .single();
    if (campaignError) throw new Error(campaignError.message);
    if (campaign.status === "cancelled") throw new Error("This campaign is cancelled.");

    const { data: subscribers, error: subError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("email,unsubscribe_token")
      .eq("active", true)
      .is("unsubscribed_at", null)
      .order("subscribed_at", { ascending: true });
    if (subError) throw new Error(subError.message);

    const rows = (subscribers ?? []).map((subscriber) => ({
      campaign_id: campaign.id,
      recipient_email: subscriber.email.toLowerCase(),
      subject: campaign.subject,
      body: campaign.body,
      unsubscribe_token: subscriber.unsubscribe_token,
      status: "pending" as const,
      updated_at: new Date().toISOString(),
    }));

    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await supabaseAdmin
        .from("email_queue")
        .upsert(rows.slice(i, i + 500), {
          onConflict: "campaign_id,recipient_email",
          ignoreDuplicates: true,
        });
      if (error) throw new Error(error.message);
    }

    const { error } = await supabaseAdmin
      .from("email_campaigns")
      .update({
        status: "queued",
        queued_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaign.id);
    if (error) throw new Error(error.message);

    await refreshCampaignStats(campaign.id);
    return { queued: rows.length };
  });

export const processEmailQueueBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        campaignId: z.string().uuid(),
        batchSize: z.number().int().min(1).max(50).default(25),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    requireAnyRole(roles, GROUP_EMAIL_ROLES);

    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from("email_campaigns")
      .select("id,status")
      .eq("id", data.campaignId)
      .single();
    if (campaignError) throw new Error(campaignError.message);
    if (campaign.status === "cancelled") throw new Error("This campaign is cancelled.");
    if (campaign.status === "sent") return { sent: 0, failed: 0, remainingDailySends: await getRemainingDailySends() };

    const remainingDailySends = await getRemainingDailySends();
    const limit = Math.min(data.batchSize, remainingDailySends);
    if (limit <= 0) return { sent: 0, failed: 0, remainingDailySends: 0 };

    await supabaseAdmin
      .from("email_campaigns")
      .update({ status: "sending", updated_at: new Date().toISOString() })
      .eq("id", campaign.id);

    const { data: rows, error: rowsError } = await supabaseAdmin
      .from("email_queue")
      .select("*")
      .eq("campaign_id", campaign.id)
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(limit);
    if (rowsError) throw new Error(rowsError.message);

    const siteOrigin = getSiteOrigin();
    let sent = 0;
    let failed = 0;

    for (const row of rows ?? []) {
      const attempts = row.attempts + 1;
      await supabaseAdmin
        .from("email_queue")
        .update({ status: "sending", attempts, updated_at: new Date().toISOString() })
        .eq("id", row.id);

      try {
        const unsubscribeUrl =
          siteOrigin && row.unsubscribe_token
            ? `${siteOrigin}/unsubscribe?token=${encodeURIComponent(row.unsubscribe_token)}`
            : null;
        const result = await sendBrevoEmail({
          toEmail: row.recipient_email,
          toName: row.recipient_name,
          subject: row.subject,
          body: row.body,
          unsubscribeUrl,
        });
        await supabaseAdmin
          .from("email_queue")
          .update({
            status: "sent",
            brevo_message_id: result.messageId,
            last_error: null,
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);
        sent += 1;
      } catch (error) {
        await supabaseAdmin
          .from("email_queue")
          .update({
            status: "failed",
            last_error: error instanceof Error ? error.message : "Failed to send email",
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);
        failed += 1;
      }
    }

    await refreshCampaignStats(campaign.id);
    return {
      sent,
      failed,
      remainingDailySends: Math.max(0, remainingDailySends - sent),
    };
  });

export const retryFailedEmails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ campaignId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    requireAnyRole(roles, GROUP_EMAIL_ROLES);
    const { data: failedRows, error: readError } = await supabaseAdmin
      .from("email_queue")
      .select("id")
      .eq("campaign_id", data.campaignId)
      .eq("status", "failed");
    if (readError) throw new Error(readError.message);

    const { error } = await supabaseAdmin
      .from("email_queue")
      .update({ status: "pending", last_error: null, updated_at: new Date().toISOString() })
      .eq("campaign_id", data.campaignId)
      .eq("status", "failed");
    if (error) throw new Error(error.message);

    await refreshCampaignStats(data.campaignId);
    return { retried: failedRows?.length ?? 0 };
  });

export const cancelEmailCampaign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ campaignId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    requireAnyRole(roles, GROUP_EMAIL_ROLES);
    const now = new Date().toISOString();
    const { error: queueError } = await supabaseAdmin
      .from("email_queue")
      .update({ status: "cancelled", updated_at: now })
      .eq("campaign_id", data.campaignId)
      .in("status", ["pending", "sending", "failed"]);
    if (queueError) throw new Error(queueError.message);
    const { error } = await supabaseAdmin
      .from("email_campaigns")
      .update({ status: "cancelled", cancelled_at: now, updated_at: now })
      .eq("id", data.campaignId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sendIndividualEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        toEmail: z.string().trim().email().max(255),
        toName: z.string().trim().max(120).optional().or(z.literal("")),
        subject: z.string().trim().min(2).max(180),
        body: z.string().trim().min(10).max(8000),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    if (roles.length === 0) throw new Error("Forbidden");
    const remainingDailySends = await getRemainingDailySends();
    if (remainingDailySends <= 0) throw new Error("Daily email limit reached. Try again tomorrow.");

    const { data: queued, error: insertError } = await supabaseAdmin
      .from("email_queue")
      .insert({
        recipient_email: data.toEmail.toLowerCase(),
        recipient_name: data.toName || null,
        subject: data.subject,
        body: data.body,
        status: "sending",
        attempts: 1,
      })
      .select("*")
      .single();
    if (insertError) throw new Error(insertError.message);

    try {
      const result = await sendBrevoEmail({
        toEmail: queued.recipient_email,
        toName: queued.recipient_name,
        subject: queued.subject,
        body: queued.body,
      });
      const { error } = await supabaseAdmin
        .from("email_queue")
        .update({
          status: "sent",
          brevo_message_id: result.messageId,
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", queued.id);
      if (error) throw new Error(error.message);
      return { ok: true, messageId: result.messageId };
    } catch (error) {
      await supabaseAdmin
        .from("email_queue")
        .update({
          status: "failed",
          last_error: error instanceof Error ? error.message : "Failed to send email",
          updated_at: new Date().toISOString(),
        })
        .eq("id", queued.id);
      throw error;
    }
  });

export const unsubscribeByToken = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ token: z.string().trim().min(16).max(128) }).parse(d))
  .handler(async ({ data }) => {
    const { data: subscriber, error: readError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id,email,active")
      .eq("unsubscribe_token", data.token)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!subscriber) return { ok: false, message: "This unsubscribe link is not valid." };

    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .update({ active: false, unsubscribed_at: new Date().toISOString() })
      .eq("id", subscriber.id);
    if (error) throw new Error(error.message);
    return { ok: true, email: subscriber.email };
  });
