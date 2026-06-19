import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-2E9kuQ_G.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as object, o as string } from "../_libs/zod.mjs";
import { r as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as supabase } from "./client-BXuQfohU.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-BDqTGzk9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Bootstrap endpoint: creates the FIRST admin user when no user_roles exist yet.
* After the first admin is created, this becomes a no-op.
*/
var setupFirstAdmin = createServerFn({ method: "POST" }).validator((d) => object({
	email: string().email(),
	password: string().min(8).max(72)
}).parse(d)).handler(createSsrRpc("493f7c3e74d8aa5313a46b0e30bb689f288762ef87827d163557b9cbdc25945a"));
var setupStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("2e333b2658d74a31a442e1d65c1cfef13c3768779fede533d246d20401d83c2c"));
function Login() {
	const navigate = useNavigate();
	const status = useServerFn(setupStatus);
	const bootstrap = useServerFn(setupFirstAdmin);
	const { data: setup } = useQuery({
		queryKey: ["setup-status"],
		queryFn: () => status()
	});
	const needsSetup = setup?.needsSetup ?? false;
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
			if (session) navigate({ to: "/admin" });
		});
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: "/admin" });
		});
		return () => sub.subscription.unsubscribe();
	}, [navigate]);
	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		try {
			if (needsSetup) {
				await bootstrap({ data: {
					email,
					password
				} });
				toast.success("Admin account created — signing in…");
			}
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (error) throw error;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen items-center justify-center bg-[color:var(--cream)] px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "top-center",
			richColors: true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "w-full max-w-md rounded-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-serif text-2xl font-semibold text-primary",
						children: "Odontal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-serif text-2xl font-semibold",
						children: needsSetup ? "Create admin account" : "Staff sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: needsSetup ? "No admin exists yet. Set up the first admin account." : "Sign in to manage bookings, patients and analytics."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-6 grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								required: true,
								minLength: 8,
								value: password,
								onChange: (e) => setPassword(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: loading,
								className: "rounded-full",
								children: loading ? "…" : needsSetup ? "Create admin & sign in" : "Sign in"
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { Login as component };
