import { i as __toESM } from "../_runtime.mjs";
import { n as formatNGN } from "./clinic-Ck8VySWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { S as CircleCheck } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { a as submitBooking, i as listServicesPublic, t as SiteLayout } from "./SiteLayout-M2ayQlT7.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as Route } from "./book-B4M7mpo4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-W9YazwA9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TIMES = [
	"8:30 AM",
	"9:30 AM",
	"10:30 AM",
	"11:30 AM",
	"12:30 PM",
	"2:00 PM",
	"3:00 PM",
	"4:00 PM",
	"5:00 PM",
	"6:00 PM",
	"7:00 PM"
];
function Book() {
	const fetchServices = useServerFn(listServicesPublic);
	const submit = useServerFn(submitBooking);
	const { data: services = [] } = useQuery({
		queryKey: ["services"],
		queryFn: () => fetchServices()
	});
	const search = Route.useSearch();
	const navigate = useNavigate();
	const [form, setForm] = (0, import_react.useState)({
		service_id: search.service ?? "",
		patient_name: "",
		phone: "",
		email: "",
		preferred_date: "",
		preferred_time: "",
		notes: ""
	});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const selected = services.find((s) => s.id === form.service_id);
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const update = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		try {
			await submit({ data: form });
			setDone(true);
			toast.success("Appointment request received!");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not submit");
		} finally {
			setLoading(false);
		}
	}
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-xl px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto h-14 w-14 text-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-serif text-3xl font-semibold",
				children: "Request received"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted-foreground",
				children: "Thank you — we've received your booking request and our team will call you shortly to confirm your appointment."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-8 rounded-full",
				onClick: () => navigate({ to: "/" }),
				children: "Back to home"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-4xl font-semibold md:text-5xl",
				children: "Book an appointment"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted-foreground",
				children: "Fill in your details — we'll call you to confirm a time that works."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-8 rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-6 md:p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "grid gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Service" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.service_id,
									onValueChange: (v) => update("service_id", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "mt-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a service" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: s.id,
										children: [
											s.name,
											" · ",
											formatNGN(s.price_ngn)
										]
									}, s.id)) })]
								}),
								selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-xs text-muted-foreground",
									children: selected.description
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Preferred date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									min: today,
									required: true,
									value: form.preferred_date,
									onChange: (e) => update("preferred_date", e.target.value)
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Preferred time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.preferred_time,
									onValueChange: (v) => update("preferred_time", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "mt-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pick a time" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: TIMES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t,
										children: t
									}, t)) })]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								minLength: 2,
								value: form.patient_name,
								onChange: (e) => update("patient_name", e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									type: "tel",
									value: form.phone,
									onChange: (e) => update("phone", e.target.value)
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Email ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "(optional)"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									value: form.email,
									onChange: (e) => update("email", e.target.value)
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Notes ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "(optional)"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: form.notes,
								onChange: (e) => update("notes", e.target.value),
								placeholder: "Tell us anything that helps us prepare for your visit."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: loading || !form.service_id || !form.preferred_date || !form.preferred_time,
								size: "lg",
								className: "rounded-full",
								children: loading ? "Submitting…" : "Request appointment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "By submitting, you agree to be contacted about your appointment. No payment is taken online."
							})
						]
					})
				})
			})
		]
	}) });
}
//#endregion
export { Book as component };
