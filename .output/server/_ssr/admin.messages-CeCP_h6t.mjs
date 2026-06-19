import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { m as toggleMessageHandled, s as listMessages } from "./admin.functions-CLsFu9GK.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as EmailDialog } from "./EmailDialog-CWZan4f4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.messages-CeCP_h6t.js
var import_jsx_runtime = require_jsx_runtime();
function Messages() {
	const fn = useServerFn(listMessages);
	const tog = useServerFn(toggleMessageHandled);
	const qc = useQueryClient();
	const { data = [] } = useQuery({
		queryKey: ["messages"],
		queryFn: () => fn()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-serif text-3xl font-semibold",
		children: "Messages"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 grid gap-3",
		children: [data.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "rounded-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-medium",
							children: [
								m.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: ["- ", m.email]
								})
							]
						}),
						m.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: m.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: new Date(m.created_at).toLocaleString()
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailDialog, {
							toEmail: m.email,
							toName: m.name,
							triggerLabel: "Reply",
							initialSubject: "Re: Your message to Odontal Dental Clinic",
							initialBody: `Hello ${m.name},

Thank you for contacting Odontal Dental Clinic.

Odontal Dental Clinic`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: m.handled ? "outline" : "default",
							size: "sm",
							className: "rounded-full",
							onClick: async () => {
								await tog({ data: {
									id: m.id,
									handled: !m.handled
								} });
								qc.invalidateQueries({ queryKey: ["messages"] });
								toast.success("Updated");
							},
							children: m.handled ? "Reopen" : "Mark handled"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 whitespace-pre-wrap text-sm",
					children: m.message
				})]
			})
		}, m.id)), data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "No messages yet."
		})]
	})] });
}
//#endregion
export { Messages as component };
