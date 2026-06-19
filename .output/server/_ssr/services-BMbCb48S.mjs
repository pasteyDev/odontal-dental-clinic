import { n as formatNGN } from "./clinic-Ck8VySWy.mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { a as Sparkles } from "../_libs/lucide-react.mjs";
import { i as listServicesPublic, t as SiteLayout } from "./SiteLayout-M2ayQlT7.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-BMbCb48S.js
var import_jsx_runtime = require_jsx_runtime();
function Services() {
	const fetchServices = useServerFn(listServicesPublic);
	const { data: services = [] } = useQuery({
		queryKey: ["services"],
		queryFn: () => fetchServices()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-4xl font-semibold md:text-5xl",
				children: "Services & pricing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-muted-foreground",
				children: "Clear, fair pricing for every treatment. Final costs are confirmed after consultation."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "rounded-2xl border-border/70 transition-shadow hover:shadow-[var(--shadow-soft)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--blush)] text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-serif text-xl font-semibold",
								children: s.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: s.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex items-end justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-semibold text-primary",
									children: formatNGN(s.price_ngn)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [s.duration_min, " min appointment"]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "sm",
									className: "rounded-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/book",
										search: { service: s.id },
										children: "Book"
									})
								})]
							})
						]
					})
				}, s.id))
			})
		]
	}) });
}
//#endregion
export { Services as component };
