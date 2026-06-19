import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { t as createSsrRpc } from "./createSsrRpc-2E9kuQ_G.mjs";
import { a as object, i as number, n as boolean, o as string, t as _enum } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-B4Q_sUCl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-CLsFu9GK.js
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("bc043367e3258bc0750efadc2962d5983ded7a90f892e25e8da034f07aee469d"));
var getDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("11e6a2fd1fff029943bfdcd8ae9d8192cd136468d209063ff1004e8c8e147db6"));
var listBookings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("f9d8f3bc588e141e294dd1cef93b62e33d9076d5f68d5076d755714bfb12ae33"));
var updateBookingStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	id: string().uuid(),
	status: _enum([
		"pending",
		"confirmed",
		"completed",
		"cancelled",
		"no_show"
	])
}).parse(d)).handler(createSsrRpc("8bb6fc0a07bd5ded83f0f5c34ac77101e31e16438ffe62bc9269f309e95bc551"));
var listPatients = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("cf5808853bf710cc1243e8373ac31a158360c7717ed9c1862210b0631856d2bb"));
var listSubscribers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("6789a9046a66cf3e34f2e6531ea869c9b8b5444a6a05b21b43114b66ebcf64b7"));
var listMessages = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d97bb8085428cc60672eb897bf3206a34756f930de0fe5d314da4f1d62d94f8a"));
var listReviewsAdmin = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("610bdca215e160e40999e25ed69f80d52cadf95838df9eca2616fca58b5bfd8b"));
var approveReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ id: string().uuid() }).parse(d)).handler(createSsrRpc("914a12d22e376b19f5a70a4896287ae6066c33523acad7525d50b35db51af52d"));
var rejectReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ id: string().uuid() }).parse(d)).handler(createSsrRpc("698b00fdcae350d65d27ffb3983f4445d7959db0753fde076960f3ac85b939ac"));
var toggleMessageHandled = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	id: string().uuid(),
	handled: boolean()
}).parse(d)).handler(createSsrRpc("ec0d1d11e52712f955b7ea6ba9acb633f29212f5a05ee5d7a8b58e38525eaeeb"));
var listAllServices = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a9bc5c97053b91be8656ba85a81ec4932daf52256db76e0676fae0fe9119fc60"));
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
}).parse(d)).handler(createSsrRpc("b5ae928f77a69ca3f1d237ecedae86e19eab9bb4b824e34c148b381099fa9d68"));
var deleteService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ id: string().uuid() }).parse(d)).handler(createSsrRpc("146b519ad693c72e06b09453d0c13b4b4bbd4f3430079c6fd6cbd31bd297d201"));
var listStaff = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c1af7edbca370233d33088c9dbe9780c1b054f6de6009e094ff0cf89de204739"));
var inviteStaff = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	email: string().email(),
	password: string().min(8).max(72),
	role: _enum([
		"admin",
		"staff",
		"receptionist"
	])
}).parse(d)).handler(createSsrRpc("0894a3d188ee5f9cda50c35b69ed402f99ff7c1b4ad27a9c0e0479aa331ac129"));
var updateStaffRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	user_id: string().uuid(),
	role: _enum([
		"admin",
		"staff",
		"receptionist"
	]),
	add: boolean()
}).parse(d)).handler(createSsrRpc("686ee886a20c4fb1a82f3b02c97f8be9a7059b125934a5cfa82c8517e12f1a3a"));
var removeStaff = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ user_id: string().uuid() }).parse(d)).handler(createSsrRpc("c3bba449dfbbe84aa2f7bd56404e21ab6229a53b0b936f71da632828db21411d"));
//#endregion
export { upsertService as _, listAllServices as a, listPatients as c, listSubscribers as d, rejectReview as f, updateStaffRole as g, updateBookingStatus as h, inviteStaff as i, listReviewsAdmin as l, toggleMessageHandled as m, deleteService as n, listBookings as o, removeStaff as p, getDashboard as r, listMessages as s, approveReview as t, listStaff as u };
