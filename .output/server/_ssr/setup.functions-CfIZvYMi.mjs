import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { a as object, o as string } from "../_libs/zod.mjs";
import { n as supabaseAdmin, t as createServerRpc } from "./client.server-Bx_f4GC0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/setup.functions-CfIZvYMi.js
/**
* Bootstrap endpoint: creates the FIRST admin user when no user_roles exist yet.
* After the first admin is created, this becomes a no-op.
*/
var setupFirstAdmin_createServerFn_handler = createServerRpc({
	id: "493f7c3e74d8aa5313a46b0e30bb689f288762ef87827d163557b9cbdc25945a",
	name: "setupFirstAdmin",
	filename: "src/lib/setup.functions.ts"
}, (opts) => setupFirstAdmin.__executeServer(opts));
var setupFirstAdmin = createServerFn({ method: "POST" }).validator((d) => object({
	email: string().email(),
	password: string().min(8).max(72)
}).parse(d)).handler(setupFirstAdmin_createServerFn_handler, async ({ data }) => {
	const { count, error: cErr } = await supabaseAdmin.from("user_roles").select("*", {
		count: "exact",
		head: true
	});
	if (cErr) throw new Error(cErr.message);
	if ((count ?? 0) > 0) throw new Error("Setup already complete. Use the login page.");
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
		role: "admin"
	});
	if (rErr) throw new Error(rErr.message);
	return { ok: true };
});
var setupStatus_createServerFn_handler = createServerRpc({
	id: "2e333b2658d74a31a442e1d65c1cfef13c3768779fede533d246d20401d83c2c",
	name: "setupStatus",
	filename: "src/lib/setup.functions.ts"
}, (opts) => setupStatus.__executeServer(opts));
var setupStatus = createServerFn({ method: "GET" }).handler(setupStatus_createServerFn_handler, async () => {
	const { count } = await supabaseAdmin.from("user_roles").select("*", {
		count: "exact",
		head: true
	});
	return { needsSetup: (count ?? 0) === 0 };
});
//#endregion
export { setupFirstAdmin_createServerFn_handler, setupStatus_createServerFn_handler };
