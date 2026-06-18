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
      <div className="flex flex-wrap items-center justify-between gap-3">
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

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <MailPlus className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-semibold">Compose campaign</h2>
            </div>
            <form
              className="mt-5 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                queueCampaign.mutate();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={form.kind}
                    onValueChange={(kind) =>
                      setForm((current) => ({
                        ...current,
                        kind: kind as typeof form.kind,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {KINDS.map((kind) => (
                        <SelectItem key={kind.value} value={kind.value}>
                          {kind.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Campaign name</Label>
                  <Input
                    className="mt-1.5"
                    required
                    value={form.name}
                    onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>Subject</Label>
                <Input
                  className="mt-1.5"
                  required
                  value={form.subject}
                  onChange={(e) => setForm((current) => ({ ...current, subject: e.target.value }))}
                />
              </div>
              <div>
                <Label>Body</Label>
                <Textarea
                  className="mt-1.5 min-h-56"
                  required
                  value={form.body}
                  onChange={(e) => setForm((current) => ({ ...current, body: e.target.value }))}
                />
              </div>
              <Button
                type="submit"
                disabled={queueCampaign.isPending || activeSubscribers.length === 0}
                className="rounded-full"
              >
                <MailPlus className="h-4 w-4" />
                {queueCampaign.isPending ? "Queueing..." : "Queue campaign"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-xl font-semibold">Campaigns</h2>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Batch</Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="h-8 w-20"
                />
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Campaign</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Updated</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => {
                    const pending =
                      campaign.recipient_count - campaign.sent_count - campaign.failed_count;
                    const canSend = campaign.status !== "cancelled" && campaign.status !== "sent" && pending > 0;
                    const canRetry = campaign.status !== "cancelled" && campaign.failed_count > 0;
                    return (
                      <tr key={campaign.id} className="border-t border-border align-top">
                        <td className="px-4 py-3">
                          <div className="font-medium">{campaign.name}</div>
                          <div className="max-w-xs truncate text-xs text-muted-foreground">
                            {campaign.subject}
                          </div>
                          {campaign.last_error && (
                            <div className="mt-1 max-w-xs truncate text-xs text-destructive">
                              {campaign.last_error}
                            </div>
                          )}
                        </td>
                        <td>
                          <Badge variant={campaign.status === "sent" ? "default" : "secondary"}>
                            {STATUS_LABELS[campaign.status] ?? campaign.status}
                          </Badge>
                        </td>
                        <td className="text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{campaign.sent_count}</span> sent
                          <br />
                          <span className="font-medium text-foreground">{campaign.failed_count}</span> failed
                          <br />
                          <span className="font-medium text-foreground">{Math.max(0, pending)}</span> pending
                        </td>
                        <td className="text-xs text-muted-foreground">
                          {new Date(campaign.updated_at).toLocaleString()}
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              className="rounded-full"
                              disabled={!canSend || busyId === `send:${campaign.id}`}
                              onClick={() => runCampaignAction(campaign.id, "send")}
                            >
                              <Send className="h-4 w-4" /> Send batch
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full"
                              disabled={!canRetry || busyId === `retry:${campaign.id}`}
                              onClick={() => runCampaignAction(campaign.id, "retry")}
                            >
                              <RotateCcw className="h-4 w-4" /> Retry
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full"
                              disabled={campaign.status === "cancelled" || campaign.status === "sent" || busyId === `cancel:${campaign.id}`}
                              onClick={() => runCampaignAction(campaign.id, "cancel")}
                            >
                              <Ban className="h-4 w-4" /> Cancel
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {campaigns.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-muted-foreground">
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

      <Card className="mt-5 rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th>Subscribed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-t border-border">
                    <td className="px-4 py-3">{subscriber.email}</td>
                    <td className="text-muted-foreground">
                      {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </td>
                    <td>{subscriber.active ? "Active" : "Inactive"}</td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-muted-foreground">
                      No subscribers.
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
