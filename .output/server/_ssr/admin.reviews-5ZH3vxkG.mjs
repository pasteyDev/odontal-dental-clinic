import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { f as rejectReview, l as listReviewsAdmin, t as approveReview } from "./admin.functions-CLsFu9GK.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.reviews-5ZH3vxkG.js
var import_jsx_runtime = require_jsx_runtime();
function ReviewsAdmin() {
	const fn = useServerFn(listReviewsAdmin);
	const app = useServerFn(approveReview);
	const rej = useServerFn(rejectReview);
	const qc = useQueryClient();
	const { data = [] } = useQuery({
		queryKey: ["admin:reviews"],
		queryFn: () => fn()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-serif text-3xl font-semibold",
		children: "Reviews (admin)"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 grid gap-3",
		children: [data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "rounded-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: r.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground",
							children: [
								"— ",
								r.reviewer_name,
								" • ",
								r.rating,
								" ⭐"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: new Date(r.created_at).toLocaleString()
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [!r.approved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: async () => {
								await app({ data: { id: r.id } });
								qc.invalidateQueries({ queryKey: ["admin:reviews"] });
								toast.success("Approved");
							},
							className: "rounded-full",
							children: "Approve"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: r.approved ? "destructive" : "outline",
							onClick: async () => {
								await rej({ data: { id: r.id } });
								qc.invalidateQueries({ queryKey: ["admin:reviews"] });
								toast.success("Deleted");
							},
							className: "rounded-full",
							children: r.approved ? "Delete" : "Reject"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 whitespace-pre-wrap text-sm",
					children: r.body
				})]
			})
		}, r.id)), data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "No reviews yet."
		})]
	})] });
}
//#endregion
export { ReviewsAdmin as component };
