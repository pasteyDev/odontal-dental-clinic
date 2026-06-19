import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { a as object, i as number, o as string, r as literal, t as _enum } from "../_libs/zod.mjs";
import { t as getRequest } from "./request-response-BEPp1C2k.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-B4Q_sUCl.mjs";
import { n as supabaseAdmin, t as createServerRpc } from "./client.server-Bx_f4GC0.mjs";
import process from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/email.functions-D5CpVOkZ.js
var BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";
function getEmailConfig() {
	const dailyLimit = Number.parseInt(process.env.EMAIL_DAILY_SEND_LIMIT ?? "250", 10);
	return {
		apiKey: process.env.BREVO_API_KEY,
		senderEmail: process.env.BREVO_SENDER_EMAIL,
		senderName: process.env.BREVO_SENDER_NAME || "Odontal Dental Clinic",
		dailyLimit: Number.isFinite(dailyLimit) && dailyLimit > 0 ? dailyLimit : 250
	};
}
function assertEmailConfig() {
	const config = getEmailConfig();
	const missing = [...!config.apiKey ? ["BREVO_API_KEY"] : [], ...!config.senderEmail ? ["BREVO_SENDER_EMAIL"] : []];
	if (missing.length > 0) throw new Error(`Missing email environment variable(s): ${missing.join(", ")}`);
	return config;
}
function escapeHtml(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function bodyToHtml(body) {
	return body.trim().split(/\n{2,}/).map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`).join("");
}
function renderEmailHtml(input) {
	const unsubscribe = input.unsubscribeUrl ? `<p style="margin-top:28px;font-size:12px;color:#6b7280">You are receiving this because you subscribed to Odontal Dental Clinic updates. <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#0f766e">Unsubscribe</a>.</p>` : "";
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
function renderEmailText(input) {
	const footer = input.unsubscribeUrl ? `\n\nUnsubscribe: ${input.unsubscribeUrl}` : "";
	return `${input.body.trim()}\n\nOdontal Dental Clinic, Aguda, Surulere, Lagos.${footer}`;
}
async function sendBrevoEmail(input) {
	const config = assertEmailConfig();
	const response = await fetch(BREVO_SEND_URL, {
		method: "POST",
		headers: {
			accept: "application/json",
			"api-key": config.apiKey,
			"content-type": "application/json"
		},
		body: JSON.stringify({
			sender: {
				name: config.senderName,
				email: config.senderEmail
			},
			to: [{
				email: input.toEmail,
				name: input.toName || void 0
			}],
			subject: input.subject,
			htmlContent: renderEmailHtml(input),
			textContent: renderEmailText(input)
		})
	});
	const payload = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(payload.message || `Brevo rejected the email (${response.status})`);
	if (!payload.messageId) throw new Error("Brevo accepted the request but did not return a message id.");
	return { messageId: payload.messageId };
}
var campaignKindSchema = _enum([
	"newsletter",
	"review_request",
	"custom"
]);
var GROUP_EMAIL_ROLES = ["admin", "receptionist"];
async function loadRoles(userId) {
	const { data, error } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
	if (error) throw new Error(error.message);
	return (data ?? []).map((r) => r.role);
}
function requireAnyRole(roles, allowed) {
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
	const today = /* @__PURE__ */ new Date();
	today.setUTCHours(0, 0, 0, 0);
	return today.toISOString();
}
async function getRemainingDailySends() {
	const { dailyLimit } = getEmailConfig();
	const { count, error } = await supabaseAdmin.from("email_queue").select("id", {
		count: "exact",
		head: true
	}).eq("status", "sent").gte("sent_at", getTodayStartIso());
	if (error) throw new Error(error.message);
	return Math.max(0, dailyLimit - (count ?? 0));
}
async function refreshCampaignStats(campaignId) {
	const [{ count: total, error: totalError }, { count: sent, error: sentError }, { count: failed, error: failedError }, { count: pending, error: pendingError }] = await Promise.all([
		supabaseAdmin.from("email_queue").select("id", {
			count: "exact",
			head: true
		}).eq("campaign_id", campaignId),
		supabaseAdmin.from("email_queue").select("id", {
			count: "exact",
			head: true
		}).eq("campaign_id", campaignId).eq("status", "sent"),
		supabaseAdmin.from("email_queue").select("id", {
			count: "exact",
			head: true
		}).eq("campaign_id", campaignId).eq("status", "failed"),
		supabaseAdmin.from("email_queue").select("id", {
			count: "exact",
			head: true
		}).eq("campaign_id", campaignId).eq("status", "pending")
	]);
	const firstError = totalError ?? sentError ?? failedError ?? pendingError;
	if (firstError) throw new Error(firstError.message);
	const { data: campaign, error: campaignError } = await supabaseAdmin.from("email_campaigns").select("status").eq("id", campaignId).single();
	if (campaignError) throw new Error(campaignError.message);
	if (campaign.status === "cancelled") return;
	const { data: lastFailed } = await supabaseAdmin.from("email_queue").select("last_error").eq("campaign_id", campaignId).eq("status", "failed").order("updated_at", { ascending: false }).limit(1).maybeSingle();
	const nextStatus = (total ?? 0) > 0 && (pending ?? 0) === 0 && (failed ?? 0) === 0 ? "sent" : "queued";
	const { error } = await supabaseAdmin.from("email_campaigns").update({
		recipient_count: total ?? 0,
		sent_count: sent ?? 0,
		failed_count: failed ?? 0,
		status: nextStatus,
		last_error: lastFailed?.last_error ?? null,
		sent_at: nextStatus === "sent" ? (/* @__PURE__ */ new Date()).toISOString() : null,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", campaignId);
	if (error) throw new Error(error.message);
}
var listEmailCampaigns_createServerFn_handler = createServerRpc({
	id: "1c8bc16b13f6e358d0207d134aff3159ec40e3d04193785f0a49bf4cdd37a023",
	name: "listEmailCampaigns",
	filename: "src/lib/email.functions.ts"
}, (opts) => listEmailCampaigns.__executeServer(opts));
var listEmailCampaigns = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listEmailCampaigns_createServerFn_handler, async ({ context }) => {
	if ((await loadRoles(context.userId)).length === 0) throw new Error("Forbidden");
	const { data, error } = await supabaseAdmin.from("email_campaigns").select("*").order("created_at", { ascending: false }).limit(50);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var createEmailCampaign_createServerFn_handler = createServerRpc({
	id: "e50ae42bae946f648dbb0221f2329dc1aae870cadfb07e5c8eff1712971d281e",
	name: "createEmailCampaign",
	filename: "src/lib/email.functions.ts"
}, (opts) => createEmailCampaign.__executeServer(opts));
var createEmailCampaign = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	kind: campaignKindSchema,
	name: string().trim().min(2).max(140),
	subject: string().trim().min(2).max(180),
	body: string().trim().min(10).max(8e3)
}).parse(d)).handler(createEmailCampaign_createServerFn_handler, async ({ context, data }) => {
	requireAnyRole(await loadRoles(context.userId), GROUP_EMAIL_ROLES);
	const { data: created, error } = await supabaseAdmin.from("email_campaigns").insert({
		kind: data.kind,
		name: data.name,
		subject: data.subject,
		body: data.body,
		created_by: context.userId
	}).select("*").single();
	if (error) throw new Error(error.message);
	return created;
});
var enqueueCampaignRecipients_createServerFn_handler = createServerRpc({
	id: "ffa86ee76e2cba47da9033edbcdfc01de155d67deabdfab898051c8e51bb5024",
	name: "enqueueCampaignRecipients",
	filename: "src/lib/email.functions.ts"
}, (opts) => enqueueCampaignRecipients.__executeServer(opts));
var enqueueCampaignRecipients = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ campaignId: string().uuid() }).parse(d)).handler(enqueueCampaignRecipients_createServerFn_handler, async ({ context, data }) => {
	requireAnyRole(await loadRoles(context.userId), GROUP_EMAIL_ROLES);
	const { data: campaign, error: campaignError } = await supabaseAdmin.from("email_campaigns").select("*").eq("id", data.campaignId).single();
	if (campaignError) throw new Error(campaignError.message);
	if (campaign.status === "cancelled") throw new Error("This campaign is cancelled.");
	const { data: subscribers, error: subError } = await supabaseAdmin.from("newsletter_subscribers").select("email,unsubscribe_token").eq("active", true).is("unsubscribed_at", null).order("subscribed_at", { ascending: true });
	if (subError) throw new Error(subError.message);
	const rows = (subscribers ?? []).map((subscriber) => ({
		campaign_id: campaign.id,
		recipient_email: subscriber.email.toLowerCase(),
		subject: campaign.subject,
		body: campaign.body,
		unsubscribe_token: subscriber.unsubscribe_token,
		status: "pending",
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}));
	for (let i = 0; i < rows.length; i += 500) {
		const { error } = await supabaseAdmin.from("email_queue").upsert(rows.slice(i, i + 500), {
			onConflict: "campaign_id,recipient_email",
			ignoreDuplicates: true
		});
		if (error) throw new Error(error.message);
	}
	const { error } = await supabaseAdmin.from("email_campaigns").update({
		status: "queued",
		queued_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", campaign.id);
	if (error) throw new Error(error.message);
	await refreshCampaignStats(campaign.id);
	return { queued: rows.length };
});
var processEmailQueueBatch_createServerFn_handler = createServerRpc({
	id: "b61122c88853eb6c94c256ed20b0d157d3cf405b958a8c59476b946679e33c65",
	name: "processEmailQueueBatch",
	filename: "src/lib/email.functions.ts"
}, (opts) => processEmailQueueBatch.__executeServer(opts));
var processEmailQueueBatch = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	campaignId: string().uuid(),
	batchSize: number().int().min(1).max(50).default(25)
}).parse(d)).handler(processEmailQueueBatch_createServerFn_handler, async ({ context, data }) => {
	requireAnyRole(await loadRoles(context.userId), GROUP_EMAIL_ROLES);
	const { data: campaign, error: campaignError } = await supabaseAdmin.from("email_campaigns").select("id,status").eq("id", data.campaignId).single();
	if (campaignError) throw new Error(campaignError.message);
	if (campaign.status === "cancelled") throw new Error("This campaign is cancelled.");
	if (campaign.status === "sent") return {
		sent: 0,
		failed: 0,
		remainingDailySends: await getRemainingDailySends()
	};
	const remainingDailySends = await getRemainingDailySends();
	const limit = Math.min(data.batchSize, remainingDailySends);
	if (limit <= 0) return {
		sent: 0,
		failed: 0,
		remainingDailySends: 0
	};
	await supabaseAdmin.from("email_campaigns").update({
		status: "sending",
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", campaign.id);
	const { data: rows, error: rowsError } = await supabaseAdmin.from("email_queue").select("*").eq("campaign_id", campaign.id).eq("status", "pending").order("created_at", { ascending: true }).limit(limit);
	if (rowsError) throw new Error(rowsError.message);
	const siteOrigin = getSiteOrigin();
	let sent = 0;
	let failed = 0;
	for (const row of rows ?? []) {
		const attempts = row.attempts + 1;
		await supabaseAdmin.from("email_queue").update({
			status: "sending",
			attempts,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", row.id);
		try {
			const unsubscribeUrl = siteOrigin && row.unsubscribe_token ? `${siteOrigin}/unsubscribe?token=${encodeURIComponent(row.unsubscribe_token)}` : null;
			const result = await sendBrevoEmail({
				toEmail: row.recipient_email,
				toName: row.recipient_name,
				subject: row.subject,
				body: row.body,
				unsubscribeUrl
			});
			await supabaseAdmin.from("email_queue").update({
				status: "sent",
				brevo_message_id: result.messageId,
				last_error: null,
				sent_at: (/* @__PURE__ */ new Date()).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", row.id);
			sent += 1;
		} catch (error) {
			await supabaseAdmin.from("email_queue").update({
				status: "failed",
				last_error: error instanceof Error ? error.message : "Failed to send email",
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", row.id);
			failed += 1;
		}
	}
	await refreshCampaignStats(campaign.id);
	return {
		sent,
		failed,
		remainingDailySends: Math.max(0, remainingDailySends - sent)
	};
});
var retryFailedEmails_createServerFn_handler = createServerRpc({
	id: "ce7281a19cf2e8f57b91837618e791f0714c62ade133e5137135dfa7fcca7800",
	name: "retryFailedEmails",
	filename: "src/lib/email.functions.ts"
}, (opts) => retryFailedEmails.__executeServer(opts));
var retryFailedEmails = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ campaignId: string().uuid() }).parse(d)).handler(retryFailedEmails_createServerFn_handler, async ({ context, data }) => {
	requireAnyRole(await loadRoles(context.userId), GROUP_EMAIL_ROLES);
	const { data: failedRows, error: readError } = await supabaseAdmin.from("email_queue").select("id").eq("campaign_id", data.campaignId).eq("status", "failed");
	if (readError) throw new Error(readError.message);
	const { error } = await supabaseAdmin.from("email_queue").update({
		status: "pending",
		last_error: null,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("campaign_id", data.campaignId).eq("status", "failed");
	if (error) throw new Error(error.message);
	await refreshCampaignStats(data.campaignId);
	return { retried: failedRows?.length ?? 0 };
});
var cancelEmailCampaign_createServerFn_handler = createServerRpc({
	id: "22c3dac93bd56b76af70edfa4e298ff9b67e5b8acc2e14a256ed10ec24b47bc7",
	name: "cancelEmailCampaign",
	filename: "src/lib/email.functions.ts"
}, (opts) => cancelEmailCampaign.__executeServer(opts));
var cancelEmailCampaign = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ campaignId: string().uuid() }).parse(d)).handler(cancelEmailCampaign_createServerFn_handler, async ({ context, data }) => {
	requireAnyRole(await loadRoles(context.userId), GROUP_EMAIL_ROLES);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const { error: queueError } = await supabaseAdmin.from("email_queue").update({
		status: "cancelled",
		updated_at: now
	}).eq("campaign_id", data.campaignId).in("status", [
		"pending",
		"sending",
		"failed"
	]);
	if (queueError) throw new Error(queueError.message);
	const { error } = await supabaseAdmin.from("email_campaigns").update({
		status: "cancelled",
		cancelled_at: now,
		updated_at: now
	}).eq("id", data.campaignId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var sendIndividualEmail_createServerFn_handler = createServerRpc({
	id: "9ac2ae6582e841431166eae87848e4092b1f2558f451d2cac50cf7ddd7612935",
	name: "sendIndividualEmail",
	filename: "src/lib/email.functions.ts"
}, (opts) => sendIndividualEmail.__executeServer(opts));
var sendIndividualEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	toEmail: string().trim().email().max(255),
	toName: string().trim().max(120).optional().or(literal("")),
	subject: string().trim().min(2).max(180),
	body: string().trim().min(10).max(8e3)
}).parse(d)).handler(sendIndividualEmail_createServerFn_handler, async ({ context, data }) => {
	if ((await loadRoles(context.userId)).length === 0) throw new Error("Forbidden");
	if (await getRemainingDailySends() <= 0) throw new Error("Daily email limit reached. Try again tomorrow.");
	const { data: queued, error: insertError } = await supabaseAdmin.from("email_queue").insert({
		recipient_email: data.toEmail.toLowerCase(),
		recipient_name: data.toName || null,
		subject: data.subject,
		body: data.body,
		status: "sending",
		attempts: 1
	}).select("*").single();
	if (insertError) throw new Error(insertError.message);
	try {
		const result = await sendBrevoEmail({
			toEmail: queued.recipient_email,
			toName: queued.recipient_name,
			subject: queued.subject,
			body: queued.body
		});
		const { error } = await supabaseAdmin.from("email_queue").update({
			status: "sent",
			brevo_message_id: result.messageId,
			sent_at: (/* @__PURE__ */ new Date()).toISOString(),
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", queued.id);
		if (error) throw new Error(error.message);
		return {
			ok: true,
			messageId: result.messageId
		};
	} catch (error) {
		await supabaseAdmin.from("email_queue").update({
			status: "failed",
			last_error: error instanceof Error ? error.message : "Failed to send email",
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", queued.id);
		throw error;
	}
});
var unsubscribeByToken_createServerFn_handler = createServerRpc({
	id: "68b0ec6bec487a3876d3fcf272b31b096c02731fbe73f4fb259e658aeeca9548",
	name: "unsubscribeByToken",
	filename: "src/lib/email.functions.ts"
}, (opts) => unsubscribeByToken.__executeServer(opts));
var unsubscribeByToken = createServerFn({ method: "POST" }).validator((d) => object({ token: string().trim().min(16).max(128) }).parse(d)).handler(unsubscribeByToken_createServerFn_handler, async ({ data }) => {
	const { data: subscriber, error: readError } = await supabaseAdmin.from("newsletter_subscribers").select("id,email,active").eq("unsubscribe_token", data.token).maybeSingle();
	if (readError) throw new Error(readError.message);
	if (!subscriber) return {
		ok: false,
		message: "This unsubscribe link is not valid."
	};
	const { error } = await supabaseAdmin.from("newsletter_subscribers").update({
		active: false,
		unsubscribed_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", subscriber.id);
	if (error) throw new Error(error.message);
	return {
		ok: true,
		email: subscriber.email
	};
});
//#endregion
export { cancelEmailCampaign_createServerFn_handler, createEmailCampaign_createServerFn_handler, enqueueCampaignRecipients_createServerFn_handler, listEmailCampaigns_createServerFn_handler, processEmailQueueBatch_createServerFn_handler, retryFailedEmails_createServerFn_handler, sendIndividualEmail_createServerFn_handler, unsubscribeByToken_createServerFn_handler };
