import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { t as SiteLayout } from "./SiteLayout-M2ayQlT7.mjs";
import { c as unsubscribeByToken } from "./email.functions-CSKMlvIH.mjs";
import { t as Route } from "./unsubscribe-Lvhz3viG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unsubscribe-DxD3j_b_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Unsubscribe() {
	const search = Route.useSearch();
	const unsubscribe = useServerFn(unsubscribeByToken);
	const [status, setStatus] = (0, import_react.useState)("loading");
	const [message, setMessage] = (0, import_react.useState)("Updating your email preferences...");
	(0, import_react.useEffect)(() => {
		if (!search.token) {
			setStatus("error");
			setMessage("This unsubscribe link is missing a token.");
			return;
		}
		unsubscribe({ data: { token: search.token } }).then((result) => {
			setStatus(result.ok ? "success" : "error");
			setMessage(result.ok ? "You have been unsubscribed." : result.message);
		}).catch((error) => {
			setStatus("error");
			setMessage(error instanceof Error ? error.message : "Could not update your preferences.");
		});
	}, [search.token, unsubscribe]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-semibold",
				children: status === "success" ? "Email preferences updated" : "Unsubscribe"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted-foreground",
				children: message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-8 rounded-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Back to home"
				})
			})
		]
	}) });
}
//#endregion
export { Unsubscribe as component };
