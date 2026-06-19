import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { r as listReviewsPublic, s as submitReview, t as SiteLayout } from "./SiteLayout-M2ayQlT7.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-DVh1PBbZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReviewForm() {
	const submit = useServerFn(submitReview);
	const [rating, setRating] = (0, import_react.useState)(5);
	const [name, setName] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: async (e) => {
			e.preventDefault();
			setLoading(true);
			try {
				await submit({ data: {
					rating,
					reviewer_name: name.trim(),
					title: title.trim(),
					body: body.trim()
				} });
				toast.success("Thanks! Your review will appear once approved.");
				setRating(5);
				setName("");
				setTitle("");
				setBody("");
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Could not submit review");
			} finally {
				setLoading(false);
			}
		},
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm font-medium text-muted-foreground",
					children: "Rating"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: rating,
					onChange: (e) => setRating(Number(e.target.value)),
					className: "mt-1 w-full rounded-md border bg-background px-3 py-2",
					children: [
						5,
						4,
						3,
						2,
						1
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: n,
						children: [
							n,
							" star",
							n > 1 ? "s" : ""
						]
					}, n))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						placeholder: "Full name",
						value: name,
						onChange: (e) => setName(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				required: true,
				placeholder: "Title",
				value: title,
				onChange: (e) => setTitle(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				required: true,
				placeholder: "Write your review",
				rows: 5,
				value: body,
				onChange: (e) => setBody(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: loading,
					children: loading ? "Submitting…" : "Submit review"
				})
			})
		]
	});
}
function ReviewsPage() {
	const listFn = useServerFn(listReviewsPublic);
	const [page, setPage] = (0, import_react.useState)(0);
	const pageSize = 10;
	const { data } = useQuery({
		queryKey: ["reviews", page],
		queryFn: () => listFn({ data: {
			page,
			pageSize
		} })
	});
	const reviews = data?.data ?? [];
	const total = data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-semibold",
				children: "Patient reviews"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Home"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground",
						children: new Date(r.created_at).toLocaleDateString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 font-medium",
						children: r.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: r.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-sm font-medium",
						children: ["— ", r.reviewer_name]
					})
				] })
			}, r.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setPage((p) => Math.max(0, p - 1)),
					disabled: page <= 0,
					className: "mr-2",
					children: "Previous"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setPage((p) => Math.min(totalPages - 1, p + 1)),
					disabled: page >= totalPages - 1,
					children: "Next"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted-foreground",
					children: [
						"Page ",
						page + 1,
						" / ",
						totalPages
					]
				})]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-medium",
				children: "Leave a review"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewForm, {})
			})] })]
		})]
	}) });
}
//#endregion
export { ReviewsPage as component };
