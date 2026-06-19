import { i as __toESM } from "../_runtime.mjs";
import { t as CLINIC } from "./clinic-Ck8VySWy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { n as useServerFn, t as createSsrRpc } from "./createSsrRpc-2E9kuQ_G.mjs";
import { t as odontal_logo_2_default } from "./odontal-logo-2-F10kLYhx.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { f as Menu, h as Mail, m as MapPin, t as X, u as Phone, y as Instagram } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogClose, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Dialog } from "./dialog-DXonTloK.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { a as object, i as number, o as string, r as literal } from "../_libs/zod.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteLayout-M2ayQlT7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/about",
		label: "About"
	},
	{
		to: "/services",
		label: "Services"
	},
	{
		to: "/book",
		label: "Book"
	},
	{
		to: "/contact",
		label: "Contact"
	},
	{
		to: "/faq",
		label: "FAQ"
	}
];
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 font-serif text-xl font-semibold text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex h-20 w-20 items-center justify-center rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: odontal_logo_2_default,
							alt: "Odontal Dental Clinic Logo"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: CLINIC.shortName
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-1 md:flex",
					children: NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.to,
						className: "rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground",
						activeProps: { className: "bg-accent text-foreground" },
						activeOptions: { exact: n.to === "/" },
						children: n.label
					}, n.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${CLINIC.phoneIntl}`,
							className: "hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent sm:inline-flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }),
								" ",
								CLINIC.phone
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "hidden md:inline-flex rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/book",
								children: "Book appointment"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-full p-2 hover:bg-accent md:hidden",
							onClick: () => setOpen((o) => !o),
							"aria-label": "Toggle menu",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						})
					]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-background md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-col p-4",
				children: [NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: n.to,
					onClick: () => setOpen(false),
					className: "rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent",
					activeProps: { className: "bg-accent" },
					children: n.label
				}, n.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-2 rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/book",
						onClick: () => setOpen(false),
						children: "Book appointment"
					})
				})]
			})
		})]
	});
}
var bookingSchema = object({
	service_id: string().uuid(),
	patient_name: string().trim().min(2).max(120),
	phone: string().trim().min(7).max(30),
	email: string().trim().email().max(255).optional().or(literal("")),
	preferred_date: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	preferred_time: string().min(3).max(20),
	notes: string().max(1e3).optional().or(literal(""))
});
var listServicesPublic = createServerFn({ method: "GET" }).handler(createSsrRpc("4d17c1720c67bcd892b5942ccc90b70c5d17e5d21ede21ddbc694e33d6906e5a"));
var submitBooking = createServerFn({ method: "POST" }).validator((d) => bookingSchema.parse(d)).handler(createSsrRpc("db854b033a399ef12d9926c61bdb550e6370d1e9f01066c9fba53387e8924730"));
var subscribeNewsletter = createServerFn({ method: "POST" }).validator((d) => object({ email: string().trim().email().max(255) }).parse(d)).handler(createSsrRpc("84c4645925774e4b47fa180579d404d020c39b76e91da29e3a84b844e713139e"));
var submitContact = createServerFn({ method: "POST" }).validator((d) => object({
	name: string().trim().min(2).max(120),
	email: string().trim().email().max(255),
	phone: string().trim().max(30).optional().or(literal("")),
	message: string().trim().min(5).max(2e3)
}).parse(d)).handler(createSsrRpc("d2a3242dac0b4819599025fd15e521ae243a87744d3530bd49d727e608dd1af2"));
var submitReview = createServerFn({ method: "POST" }).validator((d) => object({
	rating: number().int().min(1).max(5),
	reviewer_name: string().trim().min(1).max(120),
	title: string().trim().min(1).max(200),
	body: string().trim().min(5).max(2e3)
}).parse(d)).handler(createSsrRpc("743c1d610528e9139438a7b98708deccfaf64be4938c58d69811b7996d0fe340"));
var listReviewsPublic = createServerFn({ method: "POST" }).validator((d) => object({
	page: number().int().min(0).optional().default(0),
	pageSize: number().int().min(1).max(100).optional().default(10)
}).parse(d)).handler(createSsrRpc("816cf79eced3f12fed55ceae8c6bd5ceb681cc735777671260760740f95bbe43"));
var getDailyRandomReviews = createServerFn({ method: "GET" }).handler(createSsrRpc("4953abf11f9ba651bae07532ada0979c095b0f0e19d5a699a596db558dcfd360"));
var toast$1;
async function ensureToast() {
	if (!toast$1) {
		const mod = await import("../_libs/sonner.mjs").then((n) => n.n);
		toast$1 = mod.toast ?? mod.toast;
	}
}
function NewsletterForm() {
	const subscribe = useServerFn(subscribeNewsletter);
	const [email, setEmail] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: async (e) => {
			e.preventDefault();
			if (!email.trim()) return;
			setLoading(true);
			try {
				await subscribe({ data: { email: email.trim() } });
				await ensureToast();
				toast$1.success("Subscribed! Thanks for joining.");
				setEmail("");
			} catch (err) {
				await ensureToast();
				toast$1.error(err instanceof Error ? err.message : "Could not subscribe");
			} finally {
				setLoading(false);
			}
		},
		className: "flex gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "email",
			required: true,
			placeholder: "you@example.com",
			value: email,
			onChange: (e) => setEmail(e.target.value),
			className: "rounded-full bg-background"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "submit",
			disabled: loading,
			className: "rounded-full",
			children: loading ? "…" : "Subscribe"
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-24 border-t border-border bg-[color:var(--cream)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "font-serif text-2xl font-semibold text-primary",
								children: CLINIC.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-md text-sm text-muted-foreground",
								children: "Thoughtful, patient-centred dental care for families across Aguda, Surulere and wider Lagos."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 max-w-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-serif text-base font-semibold",
										children: "Get smile tips by email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "Occasional dental care tips and clinic news. No spam."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterForm, {})
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Visit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: CLINIC.address })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `tel:${CLINIC.phoneIntl}`,
									className: "hover:underline",
									children: CLINIC.phone
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `mailto:${CLINIC.email}`,
									className: "hover:underline",
									children: CLINIC.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: CLINIC.instagram,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "hover:underline",
									children: "@odontaldentalclinicng"
								})]
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Hours"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-1 text-sm",
						children: CLINIC.hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground/80",
								children: h.day
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: h.open
							})]
						}, h.day))
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					CLINIC.name,
					". All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/privacy",
							className: "hover:underline",
							children: "Privacy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/terms",
							className: "hover:underline",
							children: "Terms"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/login",
							className: "hover:text-foreground",
							children: "Staff login"
						})
					]
				})]
			})]
		})
	});
}
var STORAGE_KEY = "odontal_cookie_consent";
function setCookie(name, value, days = 365) {
	try {
		const d = /* @__PURE__ */ new Date();
		d.setTime(d.getTime() + days * 24 * 60 * 60 * 1e3);
		const secure = typeof window !== "undefined" && (window.location.protocol === "https:" || true) ? "; Secure" : "";
		document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax${secure}`;
	} catch (e) {}
}
function CookieConsent() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [visible, setVisible] = (0, import_react.useState)(false);
	const [prefs, setPrefs] = (0, import_react.useState)({
		analytics: false,
		marketing: false
	});
	(0, import_react.useEffect)(() => {
		setMounted(true);
		try {
			if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
		} catch (e) {
			setVisible(true);
		}
	}, []);
	const saveConsent = (c) => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
			setCookie(STORAGE_KEY, JSON.stringify(c));
		} catch (e) {}
		setVisible(false);
	};
	const acceptAll = () => {
		saveConsent({
			necessary: true,
			analytics: true,
			marketing: true,
			acceptedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	};
	if (!mounted || !visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-0 bottom-4 z-50 flex items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-6xl rounded-2xl border border-border bg-background p-4 shadow-lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"We use cookies to give you the best possible experience while you browse through our website. By pursuing the use of our website you implicitly agree to the usage of cookies on this site.",
						" ",
						(() => {
							const privacy = CLINIC.privacyUrl ?? "/privacy";
							return privacy.startsWith("http") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "underline",
								href: privacy,
								target: "_blank",
								rel: "noopener noreferrer",
								children: "Learn more"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: privacy,
								className: "underline",
								children: "Learn more"
							});
						})()
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "rounded-full",
							children: "Preferences"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Cookie preferences" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: "Necessary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: "Required for site functionality"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: true,
										disabled: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: "Analytics"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: "Help us improve the site with anonymous usage data"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.analytics,
										onCheckedChange: (v) => setPrefs((p) => ({
											...p,
											analytics: Boolean(v)
										}))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: "Marketing"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground",
										children: "Personalised offers and recommendations"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: prefs.marketing,
										onCheckedChange: (v) => setPrefs((p) => ({
											...p,
											marketing: Boolean(v)
										}))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "rounded-full",
								children: "Cancel"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "rounded-full",
							onClick: () => saveConsent({
								necessary: true,
								analytics: prefs.analytics,
								marketing: prefs.marketing,
								acceptedAt: (/* @__PURE__ */ new Date()).toISOString()
							}),
							children: "Save preferences"
						})] })
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: acceptAll,
						className: "rounded-full",
						children: "Accept All"
					})]
				})]
			})
		})
	});
}
function SiteLayout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				richColors: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieConsent, {})
		]
	});
}
//#endregion
export { submitBooking as a, listServicesPublic as i, getDailyRandomReviews as n, submitContact as o, listReviewsPublic as r, submitReview as s, SiteLayout as t };
