import { n as formatNGN } from "./clinic-Ck8VySWy.mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { r as getDashboard } from "./admin.functions-CLsFu9GK.mjs";
import { t as LazyRecharts } from "./LazyRecharts-Dsp7NnJg.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-DYUYV-YV.js
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"oklch(0.65 0.16 10)",
	"oklch(0.7 0.13 230)",
	"oklch(0.75 0.12 60)",
	"oklch(0.6 0.14 180)",
	"oklch(0.55 0.17 320)"
];
function Dashboard() {
	const fn = useServerFn(getDashboard);
	const { data, isLoading, error } = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => fn()
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-destructive",
		children: error.message
	});
	if (!data) return null;
	const kpis = [
		{
			label: "New today",
			value: data.kpis.todayCount
		},
		{
			label: "This week",
			value: data.kpis.weekCount
		},
		{
			label: "Pending",
			value: data.kpis.pendingCount
		},
		{
			label: "Completed (30d)",
			value: data.kpis.completedCount
		},
		{
			label: "Newsletter subs",
			value: data.kpis.subscribers
		},
		{
			label: "Revenue (30d)",
			value: formatNGN(data.kpis.revenue)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl font-semibold",
			children: "Dashboard"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Overview of the last 30 days."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6",
			children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wider text-muted-foreground",
						children: k.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 font-serif text-2xl font-semibold",
						children: k.value
					})]
				})
			}, k.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-5 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "rounded-2xl lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-lg font-semibold",
						children: "Bookings per day"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyRecharts, { children: (R) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(R.LineChart, {
								data: data.perDay,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.XAxis, {
										dataKey: "date",
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.YAxis, {
										allowDecimals: false,
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.Line, {
										type: "monotone",
										dataKey: "count",
										stroke: COLORS[0],
										strokeWidth: 2,
										dot: false
									})
								]
							})
						}) })
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-lg font-semibold",
						children: "By status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyRecharts, { children: (R) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(R.PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.Pie, {
								data: data.byStatus,
								dataKey: "value",
								nameKey: "name",
								outerRadius: 80,
								children: data.byStatus.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.Cell, { fill: COLORS[i % COLORS.length] }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.Legend, {})] })
						}) })
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-5 rounded-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-lg font-semibold",
					children: "By service"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyRecharts, { children: (R) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(R.BarChart, {
							data: data.byService,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.XAxis, {
									dataKey: "name",
									tick: { fontSize: 11 },
									interval: 0,
									angle: -15,
									textAnchor: "end",
									height: 60
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.YAxis, {
									allowDecimals: false,
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.Tooltip, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(R.Bar, {
									dataKey: "value",
									fill: COLORS[1],
									radius: [
										6,
										6,
										0,
										0
									]
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
					children: "Recent bookings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2",
									children: "Patient"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Phone" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Service" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "When" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [data.recent.map((b) => {
							const svc = b.services?.name ?? "—";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2",
										children: b.patient_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: b.phone }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: svc }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [
										b.preferred_date,
										" ",
										b.preferred_time
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: b.status
									}) })
								]
							}, b.id);
						}), data.recent.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "py-6 text-center text-muted-foreground",
							children: "No bookings yet."
						}) })] })]
					})
				})]
			})
		})
	] });
}
//#endregion
export { Dashboard as component };
