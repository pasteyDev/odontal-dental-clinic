import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { c as listPatients } from "./admin.functions-CLsFu9GK.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as EmailDialog } from "./EmailDialog-CWZan4f4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.patients-B-WDGupk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Patients() {
	const fn = useServerFn(listPatients);
	const { data = [] } = useQuery({
		queryKey: ["patients"],
		queryFn: () => fn()
	});
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = data.filter((p) => `${p.name} ${p.phone} ${p.email ?? ""}`.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl font-semibold",
			children: "Patients"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mt-4 max-w-sm",
			placeholder: "Search by name, phone or email",
			value: q,
			onChange: (e) => setQ(e.target.value)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Phone" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Email" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Visits" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "First seen" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "hover:underline",
									href: `tel:${p.phone}`,
									children: p.phone
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: p.email ?? "-" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: p.visit_count }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-xs text-muted-foreground",
									children: new Date(p.first_seen).toLocaleDateString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailDialog, {
										toEmail: p.email,
										toName: p.name,
										initialSubject: "A note from Odontal Dental Clinic",
										initialBody: `Hello ${p.name},

Thank you for choosing Odontal Dental Clinic.

Odontal Dental Clinic`
									})
								})
							]
						}, p.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "p-6 text-center text-muted-foreground",
							children: "No patients."
						}) })] })]
					})
				})
			})
		})
	] });
}
//#endregion
export { Patients as component };
