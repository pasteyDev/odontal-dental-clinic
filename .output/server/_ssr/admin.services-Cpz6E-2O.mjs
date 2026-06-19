import { i as __toESM } from "../_runtime.mjs";
import { n as formatNGN } from "./clinic-Ck8VySWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as DialogHeader, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Dialog } from "./dialog-DXonTloK.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { _ as upsertService, a as listAllServices, n as deleteService } from "./admin.functions-CLsFu9GK.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.services-Cpz6E-2O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	name: "",
	slug: "",
	description: "",
	price_ngn: 0,
	duration_min: 30,
	icon: "Sparkles",
	active: true,
	sort_order: 0
};
function ServicesAdmin() {
	const fn = useServerFn(listAllServices);
	const save = useServerFn(upsertService);
	const del = useServerFn(deleteService);
	const qc = useQueryClient();
	const { data = [] } = useQuery({
		queryKey: ["all-services"],
		queryFn: () => fn()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(empty);
	function edit(s) {
		setForm({ ...s });
		setOpen(true);
	}
	function create() {
		setForm({
			...empty,
			sort_order: data.length + 1
		});
		setOpen(true);
	}
	async function submit(e) {
		e.preventDefault();
		try {
			await save({ data: form });
			toast.success("Saved");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["all-services"] });
			qc.invalidateQueries({ queryKey: ["services"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl font-semibold",
			children: "Services"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "rounded-full",
					onClick: create,
					children: "New service"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: form.id ? "Edit service" : "New service" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: form.name,
						onChange: (e) => setForm({
							...form,
							name: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: form.slug,
						onChange: (e) => setForm({
							...form,
							slug: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 3,
						value: form.description,
						onChange: (e) => setForm({
							...form,
							description: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price (NGN)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								value: form.price_ngn,
								onChange: (e) => setForm({
									...form,
									price_ngn: Number(e.target.value)
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duration (min)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 5,
								value: form.duration_min,
								onChange: (e) => setForm({
									...form,
									duration_min: Number(e.target.value)
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sort" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								value: form.sort_order,
								onChange: (e) => setForm({
									...form,
									sort_order: Number(e.target.value)
								})
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: form.active,
							onCheckedChange: (v) => setForm({
								...form,
								active: v
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "rounded-full",
						children: "Save"
					})
				]
			})] })]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "mt-4 rounded-2xl",
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
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Price" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Duration" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Active" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 font-medium",
								children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: s.slug
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatNGN(s.price_ngn) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [s.duration_min, " min"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.active ? "Yes" : "No" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "text-right pr-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => edit(s),
									children: "Edit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "text-destructive",
									onClick: async () => {
										if (!confirm("Delete this service?")) return;
										try {
											await del({ data: { id: s.id } });
											qc.invalidateQueries({ queryKey: ["all-services"] });
											toast.success("Deleted");
										} catch (e) {
											toast.error(e instanceof Error ? e.message : "Failed");
										}
									},
									children: "Delete"
								})]
							})
						]
					}, s.id)) })]
				})
			})
		})
	})] });
}
//#endregion
export { ServicesAdmin as component };
