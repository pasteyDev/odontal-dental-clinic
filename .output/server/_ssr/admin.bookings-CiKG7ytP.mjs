import { n as formatNGN } from "./clinic-Ck8VySWy.mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { h as updateBookingStatus, o as listBookings } from "./admin.functions-CLsFu9GK.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as EmailDialog } from "./EmailDialog-CWZan4f4.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.bookings-CiKG7ytP.js
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"pending",
	"confirmed",
	"completed",
	"cancelled",
	"no_show"
];
function Bookings() {
	const fn = useServerFn(listBookings);
	const upd = useServerFn(updateBookingStatus);
	const qc = useQueryClient();
	const { data = [], isLoading } = useQuery({
		queryKey: ["bookings"],
		queryFn: () => fn()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-serif text-3xl font-semibold",
		children: "Bookings"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "mt-6 rounded-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Patient"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Phone" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Service" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date/Time" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Price" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Created" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
						isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 8,
							className: "p-6 text-center text-muted-foreground",
							children: "Loading..."
						}) }),
						data.map((b) => {
							const svc = b.services;
							const serviceName = svc?.name ?? "your dental service";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 font-medium",
										children: [b.patient_name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: b.email ?? ""
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										className: "hover:underline",
										href: `tel:${b.phone}`,
										children: b.phone
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: svc?.name ?? "-" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [b.preferred_date, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: b.preferred_time
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatNGN(b.price_ngn ?? 0) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: b.status,
										onValueChange: async (v) => {
											try {
												await upd({ data: {
													id: b.id,
													status: v
												} });
												toast.success("Updated");
												qc.invalidateQueries({ queryKey: ["bookings"] });
												qc.invalidateQueries({ queryKey: ["dashboard"] });
											} catch (e) {
												toast.error(e instanceof Error ? e.message : "Failed");
											}
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-8 w-32",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: s,
											children: s
										}, s)) })]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-xs text-muted-foreground",
										children: new Date(b.created_at).toLocaleString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailDialog, {
											toEmail: b.email,
											toName: b.patient_name,
											triggerLabel: "Confirm",
											initialSubject: "Appointment confirmation for {preferredDate}",
											initialBody: `Hello {patientName},

Your {serviceName} appointment at Odontal Dental Clinic is confirmed for {preferredDate} at {preferredTime}.

Please call us if you need to reschedule.

Thank you,
Odontal Dental Clinic`,
											replacements: {
												patientName: b.patient_name,
												serviceName,
												preferredDate: b.preferred_date,
												preferredTime: b.preferred_time
											}
										})
									})
								]
							}, b.id);
						}),
						!isLoading && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 8,
							className: "p-6 text-center text-muted-foreground",
							children: "No bookings yet."
						}) })
					] })]
				})
			})
		})
	})] });
}
//#endregion
export { Bookings as component };
