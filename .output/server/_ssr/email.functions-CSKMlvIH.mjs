import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { t as createSsrRpc } from "./createSsrRpc-2E9kuQ_G.mjs";
import { a as object, i as number, o as string, r as literal, t as _enum } from "../_libs/zod.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-B4Q_sUCl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/email.functions-CSKMlvIH.js
var campaignKindSchema = _enum([
	"newsletter",
	"review_request",
	"custom"
]);
var listEmailCampaigns = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("1c8bc16b13f6e358d0207d134aff3159ec40e3d04193785f0a49bf4cdd37a023"));
var createEmailCampaign = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	kind: campaignKindSchema,
	name: string().trim().min(2).max(140),
	subject: string().trim().min(2).max(180),
	body: string().trim().min(10).max(8e3)
}).parse(d)).handler(createSsrRpc("e50ae42bae946f648dbb0221f2329dc1aae870cadfb07e5c8eff1712971d281e"));
var enqueueCampaignRecipients = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ campaignId: string().uuid() }).parse(d)).handler(createSsrRpc("ffa86ee76e2cba47da9033edbcdfc01de155d67deabdfab898051c8e51bb5024"));
var processEmailQueueBatch = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	campaignId: string().uuid(),
	batchSize: number().int().min(1).max(50).default(25)
}).parse(d)).handler(createSsrRpc("b61122c88853eb6c94c256ed20b0d157d3cf405b958a8c59476b946679e33c65"));
var retryFailedEmails = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ campaignId: string().uuid() }).parse(d)).handler(createSsrRpc("ce7281a19cf2e8f57b91837618e791f0714c62ade133e5137135dfa7fcca7800"));
var cancelEmailCampaign = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({ campaignId: string().uuid() }).parse(d)).handler(createSsrRpc("22c3dac93bd56b76af70edfa4e298ff9b67e5b8acc2e14a256ed10ec24b47bc7"));
var sendIndividualEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => object({
	toEmail: string().trim().email().max(255),
	toName: string().trim().max(120).optional().or(literal("")),
	subject: string().trim().min(2).max(180),
	body: string().trim().min(10).max(8e3)
}).parse(d)).handler(createSsrRpc("9ac2ae6582e841431166eae87848e4092b1f2558f451d2cac50cf7ddd7612935"));
var unsubscribeByToken = createServerFn({ method: "POST" }).validator((d) => object({ token: string().trim().min(16).max(128) }).parse(d)).handler(createSsrRpc("68b0ec6bec487a3876d3fcf272b31b096c02731fbe73f4fb259e658aeeca9548"));
//#endregion
export { processEmailQueueBatch as a, unsubscribeByToken as c, listEmailCampaigns as i, createEmailCampaign as n, retryFailedEmails as o, enqueueCampaignRecipients as r, sendIndividualEmail as s, cancelEmailCampaign as t };
