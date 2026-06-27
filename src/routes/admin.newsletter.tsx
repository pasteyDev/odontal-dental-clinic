import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Send, RotateCcw, Ban, Download, MailPlus } from "lucide-react";
import { listSubscribers } from "@/lib/admin.functions";
import {
  cancelEmailCampaign,
  createEmailCampaign,
  enqueueCampaignRecipients,
  listEmailCampaigns,
  processEmailQueueBatch,
  retryFailedEmails,
} from "@/lib/email.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/newsletter")({ component: Newsletter });

const KINDS = [
  { value: "newsletter", label: "Newsletter" },
  { value: "review_request", label: "Review request" },
  { value: "custom", label: "Custom" },
] as const;

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  queued: "Queued",
  sending: "Sending",
  sent: "Sent",
  cancelled: "Cancelled",
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
    queryFn: () => listSubscribersFn(),
  });
  const { data: campaigns = [] } = useQuery({
    queryKey: ["email-campaigns"],
    queryFn: () => listCampaignsFn(),
  });

  const [form, setForm] = useState({
    kind: "newsletter" as (typeof KINDS)[number]["value"],
    name: "",
    subject: "",
    body: "",
  });
  const [batchSize, setBatchSize] = useState(25);
  const [busyId, setBusyId] = useState<string | null>(null);

  const activeSubscribers = subscribers.filter((s) => s.active && !s.unsubscribed_at);

  const queueCampaign = useMutation({
    mutationFn: async () => {
      const campaign = await createCampaignFn({ data: form });
      const result = await enqueueFn({ data: { campaignId: campaign.id } });
      return { campaign, result };
    },
    onSuccess: ({ result }) => {
      toast.success(`Queued ${result.queued} subscriber${result.queued === 1 ? "" : "s"}`);
      setForm({ kind: "newsletter", name: "", subject: "", body: "" });
      qc.invalidateQueries({ queryKey: ["email-campaigns"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not queue campaign"),
  });

  function exportCsv() {
    const rows = [
      ["email", "subscribed_at", "active", "unsubscribed_at"],
      ...subscribers.map((s) => [
        s.email,
        s.subscribed_at,
        String(s.active),
        s.unsubscribed_at ?? "",
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function runCampaignAction(id: string, action: "send" | "retry" | "cancel") {
    setBusyId(`${action}:${id}`);
    try {
      if (action === "send") {
        const result = await processBatchFn({ data: { campaignId: id, batchSize } });
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

 return (
  <div>
    {/* Header */}
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Newsletter</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeSubscribers.length} active of {subscribers.length} subscribers
        </p>
      </div>
      <Button onClick={exportCsv} variant="outline" className="rounded-full">
        <Download className="h-4 w-4" /> Export CSV
      </Button>
    </div>

    {/* Compose + Campaigns */}
    <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">

      {/* Compose */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <MailPlus className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-serif text-lg font-semibold">Compose campaign</h2>
          </div>

          <form
            className="grid gap-4"
            onSubmit={(e) => { e.preventDefault(); queueCampaign.mutate(); }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Type</Label>
                <Select
                  value={form.kind}
                  onValueChange={(kind) => setForm((c) => ({ ...c, kind: kind as typeof form.kind }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {KINDS.map((k) => <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Campaign name</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                  placeholder="e.g. June update"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Subject</Label>
              <Input
                required
                value={form.subject}
                onChange={(e) => setForm((c) => ({ ...c, subject: e.target.value }))}
                placeholder="What's new at Odontal…"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Body</Label>
              <Textarea
                required
                className="min-h-40 resize-y"
                value={form.body}
                onChange={(e) => setForm((c) => ({ ...c, body: e.target.value }))}
                placeholder="Write your message…"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Sends to <span className="font-medium text-foreground">{activeSubscribers.length}</span> subscribers
              </p>
              <Button
                type="submit"
                disabled={queueCampaign.isPending || activeSubscribers.length === 0}
                className="rounded-full"
              >
                <Send className="h-4 w-4" />
                {queueCampaign.isPending ? "Queueing…" : "Queue campaign"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Campaigns */}
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h2 className="font-serif text-lg font-semibold">Campaigns</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Batch size</span>
              <Input
                type="number"
                min={1}
                max={50}
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="h-8 w-20 text-center"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5">Campaign</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Progress</th>
                  <th className="py-2.5" />
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => {
                  const pending = campaign.recipient_count - campaign.sent_count - campaign.failed_count;
                  const total = campaign.recipient_count || 1;
                  const pct = Math.round((campaign.sent_count / total) * 100);
                  const canSend = campaign.status !== "cancelled" && campaign.status !== "sent" && pending > 0;
                  const canRetry = campaign.status !== "cancelled" && campaign.failed_count > 0;
                  return (
                    <tr key={campaign.id} className="border-t border-border align-middle">
                      <td className="px-3 py-3">
                        <div className="font-medium">{campaign.name}</div>
                        <div className="mt-0.5 max-w-[160px] truncate text-xs text-muted-foreground">
                          {campaign.subject}
                        </div>
                        {campaign.last_error && (
                          <div className="mt-1 max-w-[160px] truncate text-xs text-destructive">
                            {campaign.last_error}
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        <Badge variant={campaign.status === "sent" ? "default" : "secondary"}>
                          {STATUS_LABELS[campaign.status] ?? campaign.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          <span className="font-medium text-foreground">{campaign.sent_count}</span> sent ·{" "}
                          <span className="font-medium text-foreground">{Math.max(0, pending)}</span> pending
                        </div>
                        {/* Progress bar */}
                        <div className="mt-1.5 h-1 w-24 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-foreground transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            className="rounded-full"
                            disabled={!canSend || busyId === `send:${campaign.id}`}
                            onClick={() => runCampaignAction(campaign.id, "send")}
                          >
                            <Send className="h-3.5 w-3.5" /> Send
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full px-2.5"
                            disabled={!canRetry || busyId === `retry:${campaign.id}`}
                            onClick={() => runCampaignAction(campaign.id, "retry")}
                            title="Retry failed"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full px-2.5"
                            disabled={campaign.status === "cancelled" || campaign.status === "sent" || busyId === `cancel:${campaign.id}`}
                            onClick={() => runCampaignAction(campaign.id, "cancel")}
                            title="Cancel campaign"
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                      No campaigns yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Subscribers */}
    <Card className="mt-4 rounded-2xl">
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-serif text-lg font-semibold">Subscribers</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-muted px-3 py-1 text-xs text-muted-foreground">
              {activeSubscribers.length} active
            </span>
            <span className="rounded-lg bg-muted px-3 py-1 text-xs text-muted-foreground">
              {subscribers.length - activeSubscribers.length} inactive
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5">Email</th>
                <th className="py-2.5">Subscribed</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-t border-border">
                  <td className="px-5 py-3">{sub.email}</td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(sub.subscribed_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <Badge variant={sub.active ? "default" : "secondary"}>
                      {sub.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted-foreground">
                    No subscribers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);
}
