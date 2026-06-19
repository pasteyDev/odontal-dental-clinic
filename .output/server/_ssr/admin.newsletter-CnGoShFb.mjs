import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as useServerFn } from "./createSsrRpc-2E9kuQ_G.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { O as Ban, b as Download, c as Send, g as MailPlus, l as RotateCcw } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./card-CH7CIgFY.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { d as listSubscribers } from "./admin.functions-CLsFu9GK.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as processEmailQueueBatch, i as listEmailCampaigns, n as createEmailCampaign, o as retryFailedEmails, r as enqueueCampaignRecipients, t as cancelEmailCampaign } from "./email.functions-CSKMlvIH.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.newsletter-CnGoShFb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KINDS = [
	{
		value: "newsletter",
		label: "Newsletter"
	},
	{
		value: "review_request",
		label: "Review request"
	},
	{
		value: "custom",
		label: "Custom"
	}
];
var STATUS_LABELS = {
	draft: "Draft",
	queued: "Queued",
	sending: "Sending",
	sent: "Sent",
	cancelled: "Cancelled"
};
function Newsletter() {
	const listSubscribersFn = useServerFn(listSubscribers);
	const listCampaignsFn = useServerFn(listEmailCampaigns);
	const createCampaignFn = useServerFn(createEmailCampaign);
	const enqueueFn = useServerFn(enqueueCampaignRecipients);
	const processBatchFn = useServerFn(processEmailQueueBatch);
	const retryFn = useServerFn(retryFailedEmails);
	const cancelFn = useServerFn(cancelEmailCampaign);
	const qc = useQueryClient();
	const { data: subscribers = [] } = useQuery({
		queryKey: ["subs"],
		queryFn: () => listSubscribersFn()
	});
	const { data: campaigns = [] } = useQuery({
		queryKey: ["email-campaigns"],
		queryFn: () => listCampaignsFn()
	});
	const [form, setForm] = (0, import_react.useState)({
		kind: "newsletter",
		name: "",
		subject: "",
		body: ""
	});
	const [batchSize, setBatchSize] = (0, import_react.useState)(25);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const activeSubscribers = subscribers.filter((s) => s.active && !s.unsubscribed_at);
	const queueCampaign = useMutation({
		mutationFn: async () => {
			const campaign = await createCampaignFn({ data: form });
			return {
				campaign,
				result: await enqueueFn({ data: { campaignId: campaign.id } })
			};
		},
		onSuccess: ({ result }) => {
			toast.success(`Queued ${result.queued} subscriber${result.queued === 1 ? "" : "s"}`);
			setForm({
				kind: "newsletter",
				name: "",
				subject: "",
				body: ""
			});
			qc.invalidateQueries({ queryKey: ["email-campaigns"] });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not queue campaign")
	});
	function exportCsv() {
		const csv = [[
			"email",
			"subscribed_at",
			"active",
			"unsubscribed_at"
		], ...subscribers.map((s) => [
			s.email,
			s.subscribed_at,
			String(s.active),
			s.unsubscribed_at ?? ""
		])].map((r) => r.map((c) => `"${String(c).replace(/"/g, "\"\"")}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `subscribers-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
	async function runCampaignAction(id, action) {
		setBusyId(`${action}:${id}`);
		try {
			if (action === "send") {
				const result = await processBatchFn({ data: {
					campaignId: id,
					batchSize
				} });
				toast.success(`Sent ${result.sent}; failed ${result.failed}`);
			}
			if (action === "retry") {
				const result = await retryFn({ data: { campaignId: id } });
				toast.success(`Requeued ${result.retried}`);
			}
			if (action === "cancel") {
				await cancelFn({ data: { campaignId: id } });
				toast.success("Campaign cancelled");
			}
			qc.invalidateQueries({ queryKey: ["email-campaigns"] });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Action failed");
		} finally {
			setBusyId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-semibold",
				children: "Newsletter"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					activeSubscribers.length,
					" active of ",
					subscribers.length,
					" subscribers"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: exportCsv,
				variant: "outline",
				className: "rounded-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Export CSV"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailPlus, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-xl font-semibold",
							children: "Compose campaign"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-5 grid gap-4",
						onSubmit: (e) => {
							e.preventDefault();
							queueCampaign.mutate();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.kind,
									onValueChange: (kind) => setForm((current) => ({
										...current,
										kind
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "mt-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: KINDS.map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: kind.value,
										children: kind.label
									}, kind.value)) })]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Campaign name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "mt-1.5",
									required: true,
									value: form.name,
									onChange: (e) => setForm((current) => ({
										...current,
										name: e.target.value
									}))
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Subject" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-1.5",
								required: true,
								value: form.subject,
								onChange: (e) => setForm((current) => ({
									...current,
									subject: e.target.value
								}))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Body" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-1.5 min-h-56",
								required: true,
								value: form.body,
								onChange: (e) => setForm((current) => ({
									...current,
									body: e.target.value
								}))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: queueCampaign.isPending || activeSubscribers.length === 0,
								className: "rounded-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailPlus, { className: "h-4 w-4" }), queueCampaign.isPending ? "Queueing..." : "Queue campaign"]
							})
						]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-xl font-semibold",
							children: "Campaigns"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-muted-foreground",
								children: "Batch"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								max: 50,
								value: batchSize,
								onChange: (e) => setBatchSize(Number(e.target.value)),
								className: "h-8 w-20"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Campaign"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Progress" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Updated" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [campaigns.map((campaign) => {
								const pending = campaign.recipient_count - campaign.sent_count - campaign.failed_count;
								const canSend = campaign.status !== "cancelled" && campaign.status !== "sent" && pending > 0;
								const canRetry = campaign.status !== "cancelled" && campaign.failed_count > 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border align-top",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium",
													children: campaign.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "max-w-xs truncate text-xs text-muted-foreground",
													children: campaign.subject
												}),
												campaign.last_error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 max-w-xs truncate text-xs text-destructive",
													children: campaign.last_error
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: campaign.status === "sent" ? "default" : "secondary",
											children: STATUS_LABELS[campaign.status] ?? campaign.status
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground",
													children: campaign.sent_count
												}),
												" sent",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground",
													children: campaign.failed_count
												}),
												" failed",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground",
													children: Math.max(0, pending)
												}),
												" pending"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-xs text-muted-foreground",
											children: new Date(campaign.updated_at).toLocaleString()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													className: "rounded-full",
													disabled: !canSend || busyId === `send:${campaign.id}`,
													onClick: () => runCampaignAction(campaign.id, "send"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Send batch"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													className: "rounded-full",
													disabled: !canRetry || busyId === `retry:${campaign.id}`,
													onClick: () => runCampaignAction(campaign.id, "retry"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), " Retry"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													className: "rounded-full",
													disabled: campaign.status === "cancelled" || campaign.status === "sent" || busyId === `cancel:${campaign.id}`,
													onClick: () => runCampaignAction(campaign.id, "cancel"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-4 w-4" }), " Cancel"]
												})
											]
										}) })
									]
								}, campaign.id);
							}), campaigns.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 5,
								className: "p-6 text-center text-muted-foreground",
								children: "No campaigns yet."
							}) })] })]
						})
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-5 rounded-2xl",
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
									children: "Email"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Subscribed" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [subscribers.map((subscriber) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: subscriber.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-muted-foreground",
									children: new Date(subscriber.subscribed_at).toLocaleDateString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: subscriber.active ? "Active" : "Inactive" })
							]
						}, subscriber.id)), subscribers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 3,
							className: "p-6 text-center text-muted-foreground",
							children: "No subscribers."
						}) })] })]
					})
				})
			})
		})
	] });
}
//#endregion
export { Newsletter as component };
