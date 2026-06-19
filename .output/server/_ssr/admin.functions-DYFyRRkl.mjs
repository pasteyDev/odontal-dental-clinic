import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { a as object, i as number, n as boolean, o as string, t as _enum } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-B4Q_sUCl.mjs";
import { n as supabaseAdmin, t as createServerRpc } from "./client.server-Bx_f4GC0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-DYFyRRkl.js
async function loadRoles(userId) {
	const { data, error } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
	if (error) throw new Error(error.message);
	return (data ?? []).map((r) => r.role);
}
var getMyRoles_createServerFn_handler = createServerRpc({
	id: "bc043367e3258bc0750efadc2962d5983ded7a90f892e25e8da034f07aee469d",
	name: "getMyRoles",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getMyRoles.__executeServer(opts));
var getMyRoles = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyRoles_createServerFn_handler, async ({ context }) => loadRoles(context.userId));
var getDashboard_createServerFn_handler = createServerRpc({
	id: "11e6a2fd1fff029943bfdcd8ae9d8192cd136468d209063ff1004e8c8e147db6",
	name: "getDashboard",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const roles = await loadRoles(context.userId);
	if (roles.length === 0) throw new Error("Forbidden: not staff");
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const weekAgo = new Date(today);
	weekAgo.setDate(weekAgo.getDate() - 7);
	const monthAgo = new Date(today);
	monthAgo.setDate(monthAgo.getDate() - 30);
	const [{ data: all }, { count: subs }, { data: recent }] = await Promise.all([
		supabaseAdmin.from("bookings").select("id,status,created_at,price_ngn,service_id,services(name)").gte("created_at", monthAgo.toISOString()).order("created_at", { ascending: false }),
		supabaseAdmin.from("newsletter_subscribers").select("*", {
			count: "exact",
			head: true
		}),
		supabaseAdmin.from("bookings").select("id,patient_name,phone,status,preferred_date,preferred_time,created_at,services(name)").order("created_at", { ascending: false }).limit(8)
	]);
	const list = all ?? [];
	const todayCount = list.filter((b) => new Date(b.created_at) >= today).length;
	const weekCount = list.filter((b) => new Date(b.created_at) >= weekAgo).length;
	const pendingCount = list.filter((b) => b.status === "pending").length;
	const completedCount = list.filter((b) => b.status === "completed").length;
	const revenue = list.filter((b) => b.status === "completed").reduce((s, b) => s + (b.price_ngn ?? 0), 0);
	const days = [];
	for (let i = 29; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(d.getDate() - i);
		const key = d.toISOString().slice(0, 10);
		days.push({
			date: key.slice(5),
			count: list.filter((b) => b.created_at.slice(0, 10) === key).length
		});
	}
	const byService = /* @__PURE__ */ new Map();
	for (const b of list) {
		const name = b.services?.name ?? "Unknown";
		byService.set(name, (byService.get(name) ?? 0) + 1);
	}
	const serviceData = Array.from(byService.entries()).map(([name, value]) => ({
		name,
		value
	}));
	const statusMap = /* @__PURE__ */ new Map();
	for (const b of list) statusMap.set(b.status, (statusMap.get(b.status) ?? 0) + 1);
	const statusData = Array.from(statusMap.entries()).map(([name, value]) => ({
		name,
		value
	}));
	return {
		kpis: {
			todayCount,
			weekCount,
			pendingCount,
			completedCount,
			subscribers: subs ?? 0,
			revenue,
			total: list.length
		},
		perDay: days,
		byService: serviceData,
		byStatus: statusData,
		recent: recent ?? [],
		roles
	};
});
var listBookings_createServerFn_handler = createServerRpc({
	id: "f9d8f3bc588e141e294dd1cef93b62e33d9076d5f68d5076d755714bfb12ae33",
	name: "listBookings",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listBookings.__executeServer(opts));
var listBookings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listBookings_createServerFn_handler, async ({ context }) => {
	if ((await loadRoles(context.userId)).length === 0) throw new Error("Forbidden");
	const { data, error } = await supabaseAdmin.from("bookings").select("*,services(name,price_ngn)").order("created_at", { ascending: false }).limit(500);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var updateBookingStatus_createServerFn_handler = createServerRpc({
	id: "8bb6fc0a07bd5ded83f0f5c34ac77101e31e16438ffe62bc9269f309e95bc551",
	name: "updateBookingStatus",
	filename: "src/lib/admin.functions.ts"
}, (opts) => updateBookingStatus.__executeServer(opts));
var updateBookingStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	id: string().uuid(),
	status: _enum([
		"pending",
		"confirmed",
		"completed",
		"cancelled",
		"no_show"
	])
}).parse(d)).handler(updateBookingStatus_createServerFn_handler, async ({ context, data }) => {
	if ((await loadRoles(context.userId)).length === 0) throw new Error("Forbidden");
	const { error } = await supabaseAdmin.from("bookings").update({
		status: data.status,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listPatients_createServerFn_handler = createServerRpc({
	id: "cf5808853bf710cc1243e8373ac31a158360c7717ed9c1862210b0631856d2bb",
	name: "listPatients",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listPatients.__executeServer(opts));
var listPatients = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listPatients_createServerFn_handler, async ({ context }) => {
	if ((await loadRoles(context.userId)).length === 0) throw new Error("Forbidden");
	const { data, error } = await supabaseAdmin.from("patients").select("*").order("created_at", { ascending: false }).limit(500);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var listSubscribers_createServerFn_handler = createServerRpc({
	id: "6789a9046a66cf3e34f2e6531ea869c9b8b5444a6a05b21b43114b66ebcf64b7",
	name: "listSubscribers",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listSubscribers.__executeServer(opts));
var listSubscribers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listSubscribers_createServerFn_handler, async ({ context }) => {
	if ((await loadRoles(context.userId)).length === 0) throw new Error("Forbidden");
	const { data, error } = await supabaseAdmin.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var listMessages_createServerFn_handler = createServerRpc({
	id: "d97bb8085428cc60672eb897bf3206a34756f930de0fe5d314da4f1d62d94f8a",
	name: "listMessages",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listMessages.__executeServer(opts));
var listMessages = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMessages_createServerFn_handler, async ({ context }) => {
	if ((await loadRoles(context.userId)).length === 0) throw new Error("Forbidden");
	const { data, error } = await supabaseAdmin.from("contact_messages").select("*").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var listReviewsAdmin_createServerFn_handler = createServerRpc({
	id: "610bdca215e160e40999e25ed69f80d52cadf95838df9eca2616fca58b5bfd8b",
	name: "listReviewsAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listReviewsAdmin.__executeServer(opts));
var listReviewsAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listReviewsAdmin_createServerFn_handler, async ({ context }) => {
	if ((await loadRoles(context.userId)).length === 0) throw new Error("Forbidden");
	const { data, error } = await supabaseAdmin.from("reviews").select("*").order("created_at", { ascending: false }).limit(1e3);
	if (error) throw new Error(error.message);
	return data ?? [];
});
var approveReview_createServerFn_handler = createServerRpc({
	id: "914a12d22e376b19f5a70a4896287ae6066c33523acad7525d50b35db51af52d",
	name: "approveReview",
	filename: "src/lib/admin.functions.ts"
}, (opts) => approveReview.__executeServer(opts));
var approveReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ id: string().uuid() }).parse(d)).handler(approveReview_createServerFn_handler, async ({ context, data }) => {
	if (!(await loadRoles(context.userId)).includes("admin")) throw new Error("Admin only");
	const { error } = await supabaseAdmin.from("reviews").update({
		approved: true,
		approved_by: context.userId,
		approved_at: (/* @__PURE__ */ new Date()).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var rejectReview_createServerFn_handler = createServerRpc({
	id: "698b00fdcae350d65d27ffb3983f4445d7959db0753fde076960f3ac85b939ac",
	name: "rejectReview",
	filename: "src/lib/admin.functions.ts"
}, (opts) => rejectReview.__executeServer(opts));
var rejectReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ id: string().uuid() }).parse(d)).handler(rejectReview_createServerFn_handler, async ({ context, data }) => {
	if (!(await loadRoles(context.userId)).includes("admin")) throw new Error("Admin only");
	const { error } = await supabaseAdmin.from("reviews").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var toggleMessageHandled_createServerFn_handler = createServerRpc({
	id: "ec0d1d11e52712f955b7ea6ba9acb633f29212f5a05ee5d7a8b58e38525eaeeb",
	name: "toggleMessageHandled",
	filename: "src/lib/admin.functions.ts"
}, (opts) => toggleMessageHandled.__executeServer(opts));
var toggleMessageHandled = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	id: string().uuid(),
	handled: boolean()
}).parse(d)).handler(toggleMessageHandled_createServerFn_handler, async ({ context, data }) => {
	if ((await loadRoles(context.userId)).length === 0) throw new Error("Forbidden");
	const { error } = await supabaseAdmin.from("contact_messages").update({ handled: data.handled }).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listAllServices_createServerFn_handler = createServerRpc({
	id: "a9bc5c97053b91be8656ba85a81ec4932daf52256db76e0676fae0fe9119fc60",
	name: "listAllServices",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listAllServices.__executeServer(opts));
var listAllServices = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listAllServices_createServerFn_handler, async ({ context }) => {
	if ((await loadRoles(context.userId)).length === 0) throw new Error("Forbidden");
	const { data, error } = await supabaseAdmin.from("services").select("*").order("sort_order");
	if (error) throw new Error(error.message);
	return data ?? [];
});
var upsertService_createServerFn_handler = createServerRpc({
	id: "b5ae928f77a69ca3f1d237ecedae86e19eab9bb4b824e34c148b381099fa9d68",
	name: "upsertService",
	filename: "src/lib/admin.functions.ts"
}, (opts) => upsertService.__executeServer(opts));
var upsertService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	id: string().uuid().optional(),
	name: string().min(2).max(120),
	slug: string().min(2).max(60).regex(/^[a-z0-9-]+$/),
	description: string().max(800),
	price_ngn: number().int().min(0).max(1e7),
	duration_min: number().int().min(5).max(480),
	icon: string().max(40),
	active: boolean(),
	sort_order: number().int().min(0).max(999)
}).parse(d)).handler(upsertService_createServerFn_handler, async ({ context, data }) => {
	if (!(await loadRoles(context.userId)).includes("admin")) throw new Error("Admin only");
	const payload = {
		...data,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (data.id) {
		const { error } = await supabaseAdmin.from("services").update(payload).eq("id", data.id);
		if (error) throw new Error(error.message);
	} else {
		const { error } = await supabaseAdmin.from("services").insert(payload);
		if (error) throw new Error(error.message);
	}
	return { ok: true };
});
var deleteService_createServerFn_handler = createServerRpc({
	id: "146b519ad693c72e06b09453d0c13b4b4bbd4f3430079c6fd6cbd31bd297d201",
	name: "deleteService",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteService.__executeServer(opts));
var deleteService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ id: string().uuid() }).parse(d)).handler(deleteService_createServerFn_handler, async ({ context, data }) => {
	if (!(await loadRoles(context.userId)).includes("admin")) throw new Error("Admin only");
	const { error } = await supabaseAdmin.from("services").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listStaff_createServerFn_handler = createServerRpc({
	id: "c1af7edbca370233d33088c9dbe9780c1b054f6de6009e094ff0cf89de204739",
	name: "listStaff",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listStaff.__executeServer(opts));
var listStaff = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listStaff_createServerFn_handler, async ({ context }) => {
	if (!(await loadRoles(context.userId)).includes("admin")) throw new Error("Admin only");
	const { data: ur, error } = await supabaseAdmin.from("user_roles").select("user_id,role,created_at");
	if (error) throw new Error(error.message);
	const ids = Array.from(new Set((ur ?? []).map((r) => r.user_id)));
	const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
	const byId = new Map(users.users.map((u) => [u.id, u.email]));
	const grouped = /* @__PURE__ */ new Map();
	for (const id of ids) grouped.set(id, {
		email: byId.get(id) ?? void 0,
		roles: []
	});
	for (const r of ur ?? []) grouped.get(r.user_id)?.roles.push(r.role);
	return Array.from(grouped.entries()).map(([user_id, v]) => ({
		user_id,
		...v
	}));
});
var inviteStaff_createServerFn_handler = createServerRpc({
	id: "0894a3d188ee5f9cda50c35b69ed402f99ff7c1b4ad27a9c0e0479aa331ac129",
	name: "inviteStaff",
	filename: "src/lib/admin.functions.ts"
}, (opts) => inviteStaff.__executeServer(opts));
var inviteStaff = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	email: string().email(),
	password: string().min(8).max(72),
	role: _enum([
		"admin",
		"staff",
		"receptionist"
	])
}).parse(d)).handler(inviteStaff_createServerFn_handler, async ({ context, data }) => {
	if (!(await loadRoles(context.userId)).includes("admin")) throw new Error("Admin only");
	const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
		email: data.email,
		password: data.password,
		email_confirm: true
	});
	if (error) throw new Error(error.message);
	const userId = created.user?.id;
	if (!userId) throw new Error("Failed to create user");
	const { error: rErr } = await supabaseAdmin.from("user_roles").insert({
		user_id: userId,
		role: data.role
	});
	if (rErr) throw new Error(rErr.message);
	return { ok: true };
});
var updateStaffRole_createServerFn_handler = createServerRpc({
	id: "686ee886a20c4fb1a82f3b02c97f8be9a7059b125934a5cfa82c8517e12f1a3a",
	name: "updateStaffRole",
	filename: "src/lib/admin.functions.ts"
}, (opts) => updateStaffRole.__executeServer(opts));
var updateStaffRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	user_id: string().uuid(),
	role: _enum([
		"admin",
		"staff",
		"receptionist"
	]),
	add: boolean()
}).parse(d)).handler(updateStaffRole_createServerFn_handler, async ({ context, data }) => {
	if (!(await loadRoles(context.userId)).includes("admin")) throw new Error("Admin only");
	if (data.add) {
		const { error } = await supabaseAdmin.from("user_roles").insert({
			user_id: data.user_id,
			role: data.role
		});
		if (error && !error.message.includes("duplicate")) throw new Error(error.message);
	} else {
		const { error } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
		if (error) throw new Error(error.message);
	}
	return { ok: true };
});
var removeStaff_createServerFn_handler = createServerRpc({
	id: "c3bba449dfbbe84aa2f7bd56404e21ab6229a53b0b936f71da632828db21411d",
	name: "removeStaff",
	filename: "src/lib/admin.functions.ts"
}, (opts) => removeStaff.__executeServer(opts));
var removeStaff = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ user_id: string().uuid() }).parse(d)).handler(removeStaff_createServerFn_handler, async ({ context, data }) => {
	if (!(await loadRoles(context.userId)).includes("admin")) throw new Error("Admin only");
	if (data.user_id === context.userId) throw new Error("You cannot remove yourself");
	await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
	await supabaseAdmin.auth.admin.deleteUser(data.user_id);
	return { ok: true };
});
//#endregion
export { approveReview_createServerFn_handler, deleteService_createServerFn_handler, getDashboard_createServerFn_handler, getMyRoles_createServerFn_handler, inviteStaff_createServerFn_handler, listAllServices_createServerFn_handler, listBookings_createServerFn_handler, listMessages_createServerFn_handler, listPatients_createServerFn_handler, listReviewsAdmin_createServerFn_handler, listStaff_createServerFn_handler, listSubscribers_createServerFn_handler, rejectReview_createServerFn_handler, removeStaff_createServerFn_handler, toggleMessageHandled_createServerFn_handler, updateBookingStatus_createServerFn_handler, updateStaffRole_createServerFn_handler, upsertService_createServerFn_handler };
