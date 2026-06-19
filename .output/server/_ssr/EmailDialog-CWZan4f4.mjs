import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { c as Send, h as Mail } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, o as DialogTitle, r as DialogContent, t as Dialog } from "./dialog-DXonTloK.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { s as sendIndividualEmail } from "./email.functions-CSKMlvIH.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmailDialog-CWZan4f4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function applyReplacements(value, replacements) {
	let next = value;
	for (const [key, replacement] of Object.entries(replacements ?? {})) next = next.replaceAll(`{${key}}`, replacement ?? "");
	return next;
}
function EmailDialog({ toEmail, toName, initialSubject, initialBody, replacements, triggerLabel = "Email", size = "sm", variant = "outline", onSent }) {
	const sendEmail = useServerFn(sendIndividualEmail);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [subject, setSubject] = (0, import_react.useState)(initialSubject);
	const [body, setBody] = (0, import_react.useState)(initialBody);
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function submit(e) {
		e.preventDefault();
		if (!toEmail) {
			toast.error("This record has no email address.");
			return;
		}
		setLoading(true);
		try {
			await sendEmail({ data: {
				toEmail,
				toName: toName ?? "",
				subject: applyReplacements(subject, replacements),
				body: applyReplacements(body, replacements)
			} });
			toast.success("Email sent");
			setOpen(false);
			onSent?.();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not send email");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant,
		size,
		className: "rounded-full",
		onClick: () => {
			if (!toEmail) {
				toast.error("This record has no email address.");
				return;
			}
			setSubject(initialSubject);
			setBody(initialBody);
			setOpen(true);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }),
			" ",
			triggerLabel
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Send email" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "To" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1.5",
						value: toEmail ?? "",
						readOnly: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-1.5",
						required: true,
						value: subject,
						onChange: (e) => setSubject(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Body" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-1.5 min-h-48",
						required: true,
						value: body,
						onChange: (e) => setBody(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: loading,
						className: "rounded-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }),
							" ",
							loading ? "Sending..." : "Send email"
						]
					}) })
				]
			})]
		})
	})] });
}
//#endregion
export { EmailDialog as t };
