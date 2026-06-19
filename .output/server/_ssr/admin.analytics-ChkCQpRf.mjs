import { n as formatNGN } from "./clinic-Ck8VySWy.mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { r as getDashboard } from "./admin.functions-CLsFu9GK.mjs";
import { t as LazyRecharts } from "./LazyRecharts-Dsp7NnJg.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.analytics-ChkCQpRf.js
var import_jsx_runtime = require_jsx_runtime();
function Analytics() {
	const fn = useServerFn(getDashboard);
	const { data } = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => fn()
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl font-semibold",
			children: "Analytics"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: ["Last 30 days · Revenue ", formatNGN(data.kpis.revenue)]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-6 rounded-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-lg font-semibold",
					children: "Booking trend"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyRecharts, { children: (R) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(R.AreaChart, {
							data: data.perDay,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "g",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "oklch(0.65 0.16 10)",
										stopOpacity: .4
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "oklch(0.65 0.16 10)",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.XAxis, {
									dataKey: "date",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.YAxis, {
									allowDecimals: false,
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.Tooltip, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.Area, {
									type: "monotone",
									dataKey: "count",
									stroke: "oklch(0.65 0.16 10)",
									fill: "url(#g)",
									strokeWidth: 2
								})
							]
						})
					}) })
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-5 rounded-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-lg font-semibold",
					children: "Demand by service"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: data.byService,
							layout: "vertical",
							margin: { left: 80 },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									allowDecimals: false,
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									type: "category",
									dataKey: "name",
									tick: { fontSize: 11 },
									width: 140
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "value",
									fill: "oklch(0.7 0.13 230)",
									radius: [
										0,
										6,
										6,
										0
									]
								})
							]
						})
					})
				})]
			})
		})
	] });
}
//#endregion
export { Analytics as component };
