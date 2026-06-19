import { n as formatNGN, t as CLINIC } from "./clinic-Ck8VySWy.mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { a as Sparkles, i as Star, k as ArrowRight, m as MapPin, o as ShieldCheck, u as Phone, x as Clock } from "../_libs/lucide-react.mjs";
import { i as listServicesPublic, n as getDailyRandomReviews, t as SiteLayout } from "./SiteLayout-M2ayQlT7.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes--UV_bfza.js
var import_jsx_runtime = require_jsx_runtime();
var odontal_introduct_default = "/assets/odontal-introduct-CE6x-ZHx.mp4";
var tools_default = "/assets/tools-DZPqVAF8.jpg";
function DailyReviews() {
	const fetchDaily = useServerFn(getDailyRandomReviews);
	const { data: reviews = [] } = useQuery({
		queryKey: ["dailyReviews"],
		queryFn: () => fetchDaily()
	});
	if (!reviews || reviews.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-6 text-center text-sm text-muted-foreground",
		children: "No reviews yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3",
		children: reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "rounded-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 text-primary",
						children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-4 w-4 ${i < (r.rating ?? 0) ? "fill-current" : ""}` }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm leading-relaxed text-foreground/90",
						children: [
							"\"",
							r.body,
							"\""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm font-medium",
						children: ["— ", r.reviewer_name]
					})
				]
			})
		}, r.id))
	});
}
function Home() {
	const fetchServices = useServerFn(listServicesPublic);
	const { data: services = [] } = useQuery({
		queryKey: ["services"],
		queryFn: () => fetchServices()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 bg-[image:var(--gradient-hero)] opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-primary text-primary" }), " 5.0 rating on Google"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-serif text-4xl font-semibold leading-tight text-foreground md:text-6xl",
						children: "Healthy smiles, gently cared for in Aguda."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-5 max-w-lg text-lg text-muted-foreground",
						children: [CLINIC.tagline, " From routine checkups to whitening and implants, we explain every step so you feel confident in your care."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/book",
								children: ["Book appointment ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${CLINIC.phoneIntl}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mr-1 h-4 w-4" }),
									" ",
									CLINIC.phone
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), " Clean & hygienic"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-primary" }), " Open every day"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-primary" }), " Surulere, Lagos"]
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						autoPlay: true,
						muted: true,
						loop: true,
						playsInline: true,
						preload: "metadata",
						className: "w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
							src: odontal_introduct_default,
							type: "video/mp4"
						})
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-3xl font-semibold md:text-4xl",
					children: "Comprehensive dental services"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-muted-foreground",
					children: "Preventive, restorative and cosmetic care — all under one welcoming roof."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					className: "rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/services",
						children: "View all & pricing →"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: services.slice(0, 6).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "rounded-2xl border-border/70 transition-shadow hover:shadow-[var(--shadow-soft)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--blush)] text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-serif text-xl font-semibold",
								children: s.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 line-clamp-3 text-sm text-muted-foreground",
								children: s.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-primary",
									children: formatNGN(s.price_ngn)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [s.duration_min, " min"]
								})]
							})
						]
					})
				}, s.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-[color:var(--cream)] py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: tools_default,
					alt: "Clean and organised dental tools",
					width: 1200,
					height: 900,
					loading: "lazy",
					className: "rounded-3xl shadow-[var(--shadow-soft)]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-3xl font-semibold md:text-4xl",
					children: "Why families choose Odontal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 space-y-4",
					children: [
						"Experienced dentists who explain every step clearly",
						"Spotless treatment rooms and properly sterilised tools",
						"Warm reception and short, well-organised visits",
						"Open 7 days a week, easy to reach from anywhere in Surulere",
						"Care for everyone — children, adults and older patients"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3 text-foreground/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 h-5 w-5 flex-shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t })]
					}, t))
				})] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex items-center gap-1 text-primary",
							children: [
								0,
								1,
								2,
								3,
								4
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 fill-current" }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-serif text-3xl font-semibold md:text-4xl",
							children: "Loved by our patients"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted-foreground",
							children: "5.0 average rating on Google."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyReviews, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						className: "rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/reviews",
							children: "View all reviews →"
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-6xl px-4 pb-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 rounded-3xl bg-gradient-to-br from-[color:var(--blush)] to-[color:var(--accent)] p-8 md:grid-cols-2 md:p-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-3xl font-semibold",
						children: "Visit us in Aguda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-foreground/80",
						children: CLINIC.address
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-foreground/80",
						children: ["Call: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "font-semibold underline",
							href: `tel:${CLINIC.phoneIntl}`,
							children: CLINIC.phone
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/book",
								children: "Book now"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "rounded-full bg-background",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: CLINIC.mapsUrl,
								target: "_blank",
								rel: "noopener noreferrer",
								children: "Open in Google Maps"
							})
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: "Map",
						src: CLINIC.mapsEmbed,
						className: "h-64 w-full border-0",
						loading: "lazy"
					})
				})]
			})
		})
	] });
}
//#endregion
export { Home as component };
