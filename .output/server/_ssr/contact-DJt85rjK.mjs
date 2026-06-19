import { i as __toESM } from "../_runtime.mjs";
import { t as CLINIC } from "./clinic-Ck8VySWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { h as Mail, m as MapPin, u as Phone } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { o as submitContact, t as SiteLayout } from "./SiteLayout-M2ayQlT7.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-DJt85rjK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	const send = useServerFn(submitContact);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		message: ""
	});
	const [loading, setLoading] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-4xl font-semibold md:text-5xl",
				children: "Get in touch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-muted-foreground",
				children: "Questions about treatment, pricing or directions? We're happy to help."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-8 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "rounded-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: "Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground",
										children: CLINIC.address
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mt-0.5 h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `tel:${CLINIC.phoneIntl}`,
										className: "text-muted-foreground hover:underline",
										children: CLINIC.phone
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mt-0.5 h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `mailto:${CLINIC.email}`,
										className: "text-muted-foreground hover:underline",
										children: CLINIC.email
									})] })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 overflow-hidden rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
								title: "Map",
								src: CLINIC.mapsEmbed,
								className: "h-56 w-full border-0",
								loading: "lazy"
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "rounded-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "grid gap-4",
							onSubmit: async (e) => {
								e.preventDefault();
								setLoading(true);
								try {
									await send({ data: form });
									toast.success("Message sent. We'll be in touch soon.");
									setForm({
										name: "",
										email: "",
										phone: "",
										message: ""
									});
								} catch (err) {
									toast.error(err instanceof Error ? err.message : "Could not send");
								} finally {
									setLoading(false);
								}
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: form.name,
									onChange: (e) => setForm({
										...form,
										name: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										type: "email",
										value: form.email,
										onChange: (e) => setForm({
											...form,
											email: e.target.value
										})
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "tel",
										value: form.phone,
										onChange: (e) => setForm({
											...form,
											phone: e.target.value
										})
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Message" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 5,
									required: true,
									value: form.message,
									onChange: (e) => setForm({
										...form,
										message: e.target.value
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									disabled: loading,
									type: "submit",
									className: "rounded-full",
									children: loading ? "Sending…" : "Send message"
								})
							]
						})
					})
				})]
			})
		]
	}) });
}
//#endregion
export { Contact as component };
