import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { g as updateStaffRole, i as inviteStaff, p as removeStaff, u as listStaff } from "./admin.functions-CLsFu9GK.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.staff-D6YNjD4z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	"admin",
	"staff",
	"receptionist"
];
function Staff() {
	const fn = useServerFn(listStaff);
	const inv = useServerFn(inviteStaff);
	const upd = useServerFn(updateStaffRole);
	const rm = useServerFn(removeStaff);
	const qc = useQueryClient();
	const { data = [], error } = useQuery({
		queryKey: ["staff"],
		queryFn: () => fn()
	});
	const [form, setForm] = (0, import_react.useState)({
		email: "",
		password: "",
		role: "staff"
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-destructive",
		children: error.message
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl font-semibold",
			children: "Staff & roles"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-6 rounded-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-lg font-semibold",
					children: "Invite staff"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 grid gap-3 md:grid-cols-4",
					onSubmit: async (e) => {
						e.preventDefault();
						try {
							await inv({ data: form });
							toast.success("Created");
							setForm({
								email: "",
								password: "",
								role: "staff"
							});
							qc.invalidateQueries({ queryKey: ["staff"] });
						} catch (e) {
							toast.error(e instanceof Error ? e.message : "Failed");
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							type: "email",
							value: form.email,
							onChange: (e) => setForm({
								...form,
								email: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Temp password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							minLength: 8,
							type: "text",
							value: form.password,
							onChange: (e) => setForm({
								...form,
								password: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.role,
							onValueChange: (v) => setForm({
								...form,
								role: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: r,
								children: r
							}, r)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full rounded-full",
								children: "Create"
							})
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-5 rounded-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Roles" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Add role" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: u.email ?? u.user_id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: u.roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "mr-1 cursor-pointer",
								onClick: async () => {
									await upd({ data: {
										user_id: u.user_id,
										role: r,
										add: false
									} });
									qc.invalidateQueries({ queryKey: ["staff"] });
								},
								children: [r, " ×"]
							}, r)) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								onValueChange: async (v) => {
									await upd({ data: {
										user_id: u.user_id,
										role: v,
										add: true
									} });
									qc.invalidateQueries({ queryKey: ["staff"] });
									toast.success("Role added");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-8 w-36",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "add role" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.filter((r) => !u.roles.includes(r)).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: r,
									children: r
								}, r)) })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right pr-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "text-destructive",
									onClick: async () => {
										if (!confirm("Remove this staff member entirely?")) return;
										try {
											await rm({ data: { user_id: u.user_id } });
											qc.invalidateQueries({ queryKey: ["staff"] });
											toast.success("Removed");
										} catch (e) {
											toast.error(e instanceof Error ? e.message : "Failed");
										}
									},
									children: "Remove"
								})
							})
						]
					}, u.user_id)) })]
				})
			})
		})
	] });
}
//#endregion
export { Staff as component };
