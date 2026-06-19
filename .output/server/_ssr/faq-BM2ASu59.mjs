import { i as __toESM } from "../_runtime.mjs";
import { t as CLINIC } from "./clinic-Ck8VySWy.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as Trigger2, i as Root2, n as Header, r as Item, t as Content2, v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { w as ChevronDown } from "../_libs/lucide-react.mjs";
import { t as SiteLayout } from "./SiteLayout-M2ayQlT7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-BM2ASu59.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
var QA = [
	{
		q: "What services does Odontal Dental Clinic offer?",
		a: "Checkups, professional cleaning, fillings, extractions, teeth whitening, restorative treatments, dental implant consultations and children's dental care."
	},
	{
		q: "Where is Odontal Dental Clinic located?",
		a: `${CLINIC.address}. We're in the heart of Aguda, easy to reach from Ijesha, Ogunlana Drive and surrounding parts of Surulere.`
	},
	{
		q: "How can I get in touch?",
		a: `Call us on ${CLINIC.phone} or use the contact form. You can also visit during our opening hours.`
	},
	{
		q: "What are your opening hours?",
		a: "Monday–Friday 8:00 AM – 8:00 PM, Saturday & Sunday 9:00 AM – 5:00 PM."
	},
	{
		q: "Do I need to pay online to book?",
		a: "No. Booking is free — we'll call you to confirm your appointment. Payment is made at the clinic."
	}
];
function FAQ() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		type: "application/ld+json",
		dangerouslySetInnerHTML: { __html: JSON.stringify({
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: QA.map((q) => ({
				"@type": "Question",
				name: q.q,
				acceptedAnswer: {
					"@type": "Answer",
					text: q.a
				}
			}))
		}).replace(/</g, "\\u003c") }
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-4xl font-semibold md:text-5xl",
			children: "Frequently asked questions"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
			type: "single",
			collapsible: true,
			className: "mt-8",
			children: QA.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
				value: item.q,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
					className: "text-left font-serif text-lg",
					children: item.q
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
					className: "text-muted-foreground",
					children: item.a
				})]
			}, item.q))
		})]
	})] });
}
//#endregion
export { FAQ as component };
