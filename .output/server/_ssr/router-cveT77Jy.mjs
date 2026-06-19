import { i as __toESM } from "../_runtime.mjs";
import { t as CLINIC } from "./clinic-Ck8VySWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$20 } from "./book-B4M7mpo4.mjs";
import { t as Route$21 } from "./unsubscribe-Lvhz3viG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-cveT77Jy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BzGDb-qN.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$19 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "robots",
				content: "index, follow"
			},
			{
				name: "theme-color",
				content: "#ffffff"
			},
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:site_name",
				content: CLINIC.name
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "canonical",
			href: "/"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: JSON.stringify({
				"@context": "https://schema.org",
				"@graph": [{
					"@type": "LocalBusiness",
					"@id": typeof window !== "undefined" ? window.location.origin : "",
					"name": CLINIC.name,
					"telephone": CLINIC.phoneIntl,
					"email": CLINIC.email,
					"address": {
						"@type": "PostalAddress",
						"streetAddress": CLINIC.address,
						"addressLocality": CLINIC.area,
						"addressCountry": "NG"
					},
					"url": typeof window !== "undefined" ? window.location.origin : "",
					"openingHoursSpecification": CLINIC.hours.map((h) => ({
						"@type": "OpeningHoursSpecification",
						"dayOfWeek": h.day,
						"opens": h.open.split("–")[0].trim(),
						"closes": h.open.split("–")[1]?.trim() ?? h.open
					}))
				}, {
					"@type": "Dentist",
					"name": CLINIC.name
				}]
			}).replace(/</g, "\\u003c") }
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$19.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
function buildHead({ title, description = "", path = "/", image }) {
	const href = path;
	const meta = [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			property: "og:url",
			content: href
		}
	];
	if (image) {
		meta.push({
			property: "og:image",
			content: image
		});
		meta.push({
			name: "twitter:image",
			content: image
		});
	}
	return {
		meta,
		links: [{
			rel: "canonical",
			href
		}]
	};
}
var $$splitComponentImporter$18 = () => import("./terms-DIfolJCO.mjs");
var Route$18 = createFileRoute("/terms")({
	head: () => buildHead({
		title: `${CLINIC.name} — Terms of Use`,
		description: `Terms of use for ${CLINIC.name}`,
		path: "/terms"
	}),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./services-BMbCb48S.mjs");
var Route$17 = createFileRoute("/services")({
	head: () => buildHead({
		title: "Dental Services & Pricing — Odontal Dental Clinic",
		description: "Transparent pricing for dental checkups, cleaning, fillings, extractions, whitening, implants and children's dentistry in Aguda, Lagos.",
		path: "/services"
	}),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./reviews-DVh1PBbZ.mjs");
var Route$16 = createFileRoute("/reviews")({
	head: () => buildHead({
		title: "Reviews — Odontal Dental Clinic",
		description: "Read patient reviews and leave your own review for Odontal Dental Clinic.",
		path: "/reviews"
	}),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./privacy-D_dRmMkq.mjs");
var Route$15 = createFileRoute("/privacy")({
	head: () => buildHead({
		title: `${CLINIC.name} — Privacy & Cookies`,
		description: `Privacy policy and cookie usage for ${CLINIC.name}`,
		path: "/privacy"
	}),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./faq-BM2ASu59.mjs");
var Route$14 = createFileRoute("/faq")({
	head: () => buildHead({
		title: "FAQ — Odontal Dental Clinic",
		description: "Answers to common questions about services, location, hours and how to book at Odontal Dental Clinic.",
		path: "/faq"
	}),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./contact-DJt85rjK.mjs");
var Route$13 = createFileRoute("/contact")({
	head: () => buildHead({
		title: "Contact — Odontal Dental Clinic, Aguda, Surulere",
		description: "Call, visit or message Odontal Dental Clinic in Aguda, Lagos. We're open every day.",
		path: "/contact"
	}),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./admin-aC2sd1Un.mjs");
var Route$12 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./about-CA06bL9q.mjs");
var Route$11 = createFileRoute("/about")({
	head: () => buildHead({
		title: "About Odontal Dental Clinic — Aguda, Surulere",
		description: "A modern dental clinic in Aguda providing patient-centred oral care for families across Surulere and wider Lagos.",
		path: "/about"
	}),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./routes--UV_bfza.mjs");
var Route$10 = createFileRoute("/")({
	head: () => buildHead({
		title: "Odontal Dental Clinic — Trusted Dentist in Aguda, Surulere, Lagos",
		description: "Modern dental clinic in Aguda, Lagos. Checkups, cleaning, fillings, whitening and more. Book your appointment with Odontal Dental Clinic today.",
		path: "/"
	}),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.index-DYUYV-YV.mjs");
var Route$9 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.staff-D6YNjD4z.mjs");
var Route$8 = createFileRoute("/admin/staff")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.services-Cpz6E-2O.mjs");
var Route$7 = createFileRoute("/admin/services")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.reviews-5ZH3vxkG.mjs");
var Route$6 = createFileRoute("/admin/reviews")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin.patients-B-WDGupk.mjs");
var Route$5 = createFileRoute("/admin/patients")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin.newsletter-CnGoShFb.mjs");
var Route$4 = createFileRoute("/admin/newsletter")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.messages-CeCP_h6t.mjs");
var Route$3 = createFileRoute("/admin/messages")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.login-BDqTGzk9.mjs");
var Route$2 = createFileRoute("/admin/login")({
	head: () => ({ meta: [{ title: "Staff Login — Odontal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.bookings-CiKG7ytP.mjs");
var Route$1 = createFileRoute("/admin/bookings")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.analytics-ChkCQpRf.mjs");
var Route = createFileRoute("/admin/analytics")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var UnsubscribeRoute = Route$21.update({
	id: "/unsubscribe",
	path: "/unsubscribe",
	getParentRoute: () => Route$19
});
var TermsRoute = Route$18.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$19
});
var ServicesRoute = Route$17.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => Route$19
});
var ReviewsRoute = Route$16.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => Route$19
});
var PrivacyRoute = Route$15.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$19
});
var FaqRoute = Route$14.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$19
});
var ContactRoute = Route$13.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$19
});
var BookRoute = Route$20.update({
	id: "/book",
	path: "/book",
	getParentRoute: () => Route$19
});
var AdminRoute = Route$12.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$19
});
var AboutRoute = Route$11.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$19
});
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var AdminIndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminStaffRoute = Route$8.update({
	id: "/staff",
	path: "/staff",
	getParentRoute: () => AdminRoute
});
var AdminServicesRoute = Route$7.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => AdminRoute
});
var AdminReviewsRoute = Route$6.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => AdminRoute
});
var AdminPatientsRoute = Route$5.update({
	id: "/patients",
	path: "/patients",
	getParentRoute: () => AdminRoute
});
var AdminNewsletterRoute = Route$4.update({
	id: "/newsletter",
	path: "/newsletter",
	getParentRoute: () => AdminRoute
});
var AdminMessagesRoute = Route$3.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => AdminRoute
});
var AdminLoginRoute = Route$2.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRoute
});
var AdminBookingsRoute = Route$1.update({
	id: "/bookings",
	path: "/bookings",
	getParentRoute: () => AdminRoute
});
var AdminRouteChildren = {
	AdminAnalyticsRoute: Route.update({
		id: "/analytics",
		path: "/analytics",
		getParentRoute: () => AdminRoute
	}),
	AdminBookingsRoute,
	AdminLoginRoute,
	AdminMessagesRoute,
	AdminNewsletterRoute,
	AdminPatientsRoute,
	AdminReviewsRoute,
	AdminServicesRoute,
	AdminStaffRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	BookRoute,
	ContactRoute,
	FaqRoute,
	PrivacyRoute,
	ReviewsRoute,
	ServicesRoute,
	TermsRoute,
	UnsubscribeRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
