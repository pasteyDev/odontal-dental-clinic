import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAllServices, upsertService, deleteService } from "@/lib/admin.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { formatNGN } from "@/lib/clinic";
import { Plus, Clock, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/services")({ component: ServicesAdmin });

type ServiceForm = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price_ngn: number;
  duration_min: number;
  icon: string;
  active: boolean;
  sort_order: number;
};

const empty: ServiceForm = {
  name: "", slug: "", description: "",
  price_ngn: 0, duration_min: 30,
  icon: "Sparkles", active: true, sort_order: 0,
};

function ServicesAdmin() {
  const fn   = useServerFn(listAllServices);
  const save = useServerFn(upsertService);
  const del  = useServerFn(deleteService);
  const qc   = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["all-services"],
    queryFn: () => fn(),
  });

  const [open, setOpen]   = useState(false);
  const [form, setForm]   = useState<ServiceForm>(empty);
  const [saving, setSaving] = useState(false);

  function edit(s: typeof data[number]) {
    setForm({ ...s });
    setOpen(true);
  }

  function create() {
    setForm({ ...empty, sort_order: data.length + 1 });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await save({ data: form });
      toast.success(form.id ? "Service updated" : "Service created");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["all-services"] });
      qc.invalidateQueries({ queryKey: ["services"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await del({ data: { id } });
      qc.invalidateQueries({ queryKey: ["all-services"] });
      toast.success("Service deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  const f = (k: keyof ServiceForm, v: any) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Services</h1>
          {!isLoading && (
            <p className="mt-1 text-sm text-muted-foreground">
              {data.length} service{data.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full" onClick={create}>
              <Plus className="h-4 w-4" /> New service
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {form.id ? "Edit service" : "New service"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={submit} className="mt-2 grid gap-4">
              <div className="grid gap-1.5">
                <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Name</Label>
                <Input required value={form.name} onChange={(e) => f("name", e.target.value)} placeholder="e.g. Teeth whitening" />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Slug</Label>
                <Input required value={form.slug} onChange={(e) => f("slug", e.target.value)} placeholder="e.g. teeth-whitening" />
              </div>

              <div className="grid gap-1.5">
                <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Description</Label>
                <Textarea rows={3} value={form.description} onChange={(e) => f("description", e.target.value)} placeholder="Brief description shown to patients" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Price (₦)</Label>
                  <Input type="number" min={0} value={form.price_ngn} onChange={(e) => f("price_ngn", Number(e.target.value))} />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Duration</Label>
                  <Input type="number" min={5} value={form.duration_min} onChange={(e) => f("duration_min", Number(e.target.value))} />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">Sort order</Label>
                  <Input type="number" min={0} value={form.sort_order} onChange={(e) => f("sort_order", Number(e.target.value))} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">Visible to patients on the booking page</p>
                </div>
                <Switch checked={form.active} onCheckedChange={(v) => f("active", v)} />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="rounded-full">
                  {saving ? "Saving…" : form.id ? "Update service" : "Create service"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <p className="mt-10 text-center text-sm text-muted-foreground">Loading services…</p>
      )}

      {/* ── Mobile: card grid ───────────────────────────────── */}
      {!isLoading && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:hidden">
          {data.length === 0 ? (
            <p className="col-span-2 py-10 text-center text-sm text-muted-foreground">
              No services yet. Create your first one.
            </p>
          ) : (
            data.map((s) => (
              <Card key={s.id} className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium leading-tight">{s.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{s.slug}</p>
                    </div>
                    <Badge variant={s.active ? "default" : "secondary"} className="shrink-0">
                      {s.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {s.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {s.description}
                    </p>
                  )}

                  <div className="my-3 h-px bg-border" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{formatNGN(s.price_ngn)}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {s.duration_min} min
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 rounded-full"
                      onClick={() => edit(s)}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full px-3 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(s.id, s.name)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* ── Desktop: table ──────────────────────────────────── */}
      {!isLoading && (
        <Card className="mt-5 hidden rounded-2xl md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Duration</th>
                    <th className="py-3">Sort</th>
                    <th className="py-3">Status</th>
                    <th className="py-3" />
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No services yet.
                      </td>
                    </tr>
                  ) : (
                    data.map((s) => (
                      <tr key={s.id} className="border-t border-border align-middle">
                        <td className="px-4 py-3">
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.slug}</p>
                        </td>
                        <td className="py-3 font-medium">{formatNGN(s.price_ngn)}</td>
                        <td className="py-3">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" /> {s.duration_min} min
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground">{s.sort_order}</td>
                        <td className="py-3">
                          <Badge variant={s.active ? "default" : "secondary"}>
                            {s.active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full"
                              onClick={() => edit(s)}
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full px-2.5 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(s.id, s.name)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}