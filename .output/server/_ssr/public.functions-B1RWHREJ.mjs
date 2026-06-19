import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { a as object, i as number, o as string, r as literal } from "../_libs/zod.mjs";
import { n as supabaseAdmin, t as createServerRpc } from "./client.server-Bx_f4GC0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public.functions-B1RWHREJ.js
var bookingSchema = object({
	service_id: string().uuid(),
	patient_name: string().trim().min(2).max(120),
	phone: string().trim().min(7).max(30),
	email: string().trim().email().max(255).optional().or(literal("")),
	preferred_date: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	preferred_time: string().min(3).max(20),
	notes: string().max(1e3).optional().or(literal(""))
});
var listServicesPublic_createServerFn_handler = createServerRpc({
	id: "4d17c1720c67bcd892b5942ccc90b70c5d17e5d21ede21ddbc694e33d6906e5a",
	name: "listServicesPublic",
	filename: "src/lib/public.functions.ts"
}, (opts) => listServicesPublic.__executeServer(opts));
var listServicesPublic = createServerFn({ method: "GET" }).handler(listServicesPublic_createServerFn_handler, async () => {
	const { data, error } = await supabaseAdmin.from("services").select("id,name,slug,description,price_ngn,duration_min,icon,sort_order").eq("active", true).order("sort_order", { ascending: true });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var submitBooking_createServerFn_handler = createServerRpc({
	id: "db854b033a399ef12d9926c61bdb550e6370d1e9f01066c9fba53387e8924730",
	name: "submitBooking",
	filename: "src/lib/public.functions.ts"
}, (opts) => submitBooking.__executeServer(opts));
var submitBooking = createServerFn({ method: "POST" }).validator((d) => bookingSchema.parse(d)).handler(submitBooking_createServerFn_handler, async ({ data }) => {
	const { data: svc, error: sErr } = await supabaseAdmin.from("services").select("id,name,price_ngn").eq("id", data.service_id).eq("active", true).maybeSingle();
	if (sErr) throw new Error(sErr.message);
	if (!svc) throw new Error("Selected service is not available.");
	const { data: existing } = await supabaseAdmin.from("patients").select("id,visit_count").eq("phone", data.phone).maybeSingle();
	let patientId;
	if (existing) {
		patientId = existing.id;
		await supabaseAdmin.from("patients").update({
			name: data.patient_name,
			email: data.email || null,
			visit_count: (existing.visit_count ?? 0) + 1
		}).eq("id", patientId);
	} else {
		const { data: ins, error: pErr } = await supabaseAdmin.from("patients").insert({
			name: data.patient_name,
			phone: data.phone,
			email: data.email || null,
			visit_count: 1
		}).select("id").single();
		if (pErr) throw new Error(pErr.message);
		patientId = ins.id;
	}
	const { error: bErr } = await supabaseAdmin.from("bookings").insert({
		service_id: svc.id,
		patient_id: patientId,
		patient_name: data.patient_name,
		phone: data.phone,
		email: data.email || null,
		preferred_date: data.preferred_date,
		preferred_time: data.preferred_time,
		notes: data.notes || "",
		price_ngn: svc.price_ngn,
		status: "pending"
	});
	if (bErr) throw new Error(bErr.message);
	return {
		ok: true,
		service: svc.name
	};
});
var subscribeNewsletter_createServerFn_handler = createServerRpc({
	id: "84c4645925774e4b47fa180579d404d020c39b76e91da29e3a84b844e713139e",
	name: "subscribeNewsletter",
	filename: "src/lib/public.functions.ts"
}, (opts) => subscribeNewsletter.__executeServer(opts));
var subscribeNewsletter = createServerFn({ method: "POST" }).validator((d) => object({ email: string().trim().email().max(255) }).parse(d)).handler(subscribeNewsletter_createServerFn_handler, async ({ data }) => {
	const { error } = await supabaseAdmin.from("newsletter_subscribers").upsert({
		email: data.email.toLowerCase(),
		active: true
	}, { onConflict: "email" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var submitContact_createServerFn_handler = createServerRpc({
	id: "d2a3242dac0b4819599025fd15e521ae243a87744d3530bd49d727e608dd1af2",
	name: "submitContact",
	filename: "src/lib/public.functions.ts"
}, (opts) => submitContact.__executeServer(opts));
var submitContact = createServerFn({ method: "POST" }).validator((d) => object({
	name: string().trim().min(2).max(120),
	email: string().trim().email().max(255),
	phone: string().trim().max(30).optional().or(literal("")),
	message: string().trim().min(5).max(2e3)
}).parse(d)).handler(submitContact_createServerFn_handler, async ({ data }) => {
	const { error } = await supabaseAdmin.from("contact_messages").insert({
		name: data.name,
		email: data.email,
		phone: data.phone || null,
		message: data.message
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var submitReview_createServerFn_handler = createServerRpc({
	id: "743c1d610528e9139438a7b98708deccfaf64be4938c58d69811b7996d0fe340",
	name: "submitReview",
	filename: "src/lib/public.functions.ts"
}, (opts) => submitReview.__executeServer(opts));
var submitReview = createServerFn({ method: "POST" }).validator((d) => object({
	rating: number().int().min(1).max(5),
	reviewer_name: string().trim().min(1).max(120),
	title: string().trim().min(1).max(200),
	body: string().trim().min(5).max(2e3)
}).parse(d)).handler(submitReview_createServerFn_handler, async ({ data }) => {
	const { error } = await supabaseAdmin.from("reviews").insert({
		rating: data.rating,
		reviewer_name: data.reviewer_name,
		title: data.title,
		body: data.body,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (error) throw new Error(error.message);
	return {
		ok: true,
		message: "Thanks — your review will appear once approved."
	};
});
var listReviewsPublic_createServerFn_handler = createServerRpc({
	id: "816cf79eced3f12fed55ceae8c6bd5ceb681cc735777671260760740f95bbe43",
	name: "listReviewsPublic",
	filename: "src/lib/public.functions.ts"
}, (opts) => listReviewsPublic.__executeServer(opts));
var listReviewsPublic = createServerFn({ method: "POST" }).validator((d) => object({
	page: number().int().min(0).optional().default(0),
	pageSize: number().int().min(1).max(100).optional().default(10)
}).parse(d)).handler(listReviewsPublic_createServerFn_handler, async ({ data }) => {
	const page = data.page ?? 0;
	const pageSize = data.pageSize ?? 10;
	const from = page * pageSize;
	const to = from + pageSize - 1;
	const [{ data: rows, error }, { count, error: cErr }] = await Promise.all([supabaseAdmin.from("reviews").select("id,rating,reviewer_name,title,body,created_at").eq("approved", true).order("created_at", { ascending: false }).range(from, to), supabaseAdmin.from("reviews").select("*", {
		count: "exact",
		head: true
	}).eq("approved", true)]);
	if (error) throw new Error(error.message);
	if (cErr) throw new Error(cErr.message);
	return {
		data: rows ?? [],
		total: count ?? 0,
		page,
		pageSize
	};
});
var getDailyRandomReviews_createServerFn_handler = createServerRpc({
	id: "4953abf11f9ba651bae07532ada0979c095b0f0e19d5a699a596db558dcfd360",
	name: "getDailyRandomReviews",
	filename: "src/lib/public.functions.ts"
}, (opts) => getDailyRandomReviews.__executeServer(opts));
var getDailyRandomReviews = createServerFn({ method: "GET" }).handler(getDailyRandomReviews_createServerFn_handler, async () => {
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const { data: existing, error: eErr } = await supabaseAdmin.from("daily_review_selection").select("review_ids").eq("day", today).maybeSingle();
	if (eErr) throw new Error(eErr.message);
	let ids = [];
	if (existing?.review_ids && existing.review_ids.length > 0) ids = existing.review_ids;
	else {
		const { data: idsData, error: rErr } = await supabaseAdmin.rpc("get_random_review_ids", { _limit: 6 });
		if (rErr) throw new Error(rErr.message);
		ids = (idsData ?? []).map((r) => r.id);
		if (ids.length > 0) {
			const { error: insErr } = await supabaseAdmin.from("daily_review_selection").insert({
				day: today,
				review_ids: ids
			});
			if (insErr) throw new Error(insErr.message);
		} else return [];
	}
	const { data: reviews, error: revErr } = await supabaseAdmin.from("reviews").select("id,rating,reviewer_name,title,body,created_at").in("id", ids);
	if (revErr) throw new Error(revErr.message);
	const byId = new Map((reviews ?? []).map((r) => [r.id, r]));
	return ids.map((i) => byId.get(i)).filter(Boolean);
});
//#endregion
export { getDailyRandomReviews_createServerFn_handler, listReviewsPublic_createServerFn_handler, listServicesPublic_createServerFn_handler, submitBooking_createServerFn_handler, submitContact_createServerFn_handler, submitReview_createServerFn_handler, subscribeNewsletter_createServerFn_handler };
