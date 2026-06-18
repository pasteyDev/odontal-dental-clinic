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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { formatNGN } from "@/lib/clinic";

export const Route = createFileRoute("/admin/services")({ component: ServicesAdmin });

type ServiceForm = {
  id?: string; name: string; slug: string; description: string;
  price_ngn: number; duration_min: number; icon: string; active: boolean; sort_order: number;
};

const empty: ServiceForm = { name: "", slug: "", description: "", price_ngn: 0, duration_min: 30, icon: "Sparkles", active: true, sort_order: 0 };

function ServicesAdmin() {
  const fn = useServerFn(listAllServices);
  const save = useServerFn(upsertService);
  const del = useServerFn(deleteService);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["all-services"], queryFn: () => fn() });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ServiceForm>(empty);

  function edit(s: typeof data[number]) { setForm({ ...s }); setOpen(true); }
  function create() { setForm({ ...empty, sort_order: data.length + 1 }); setOpen(true); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try { await save({ data: form }); toast.success("Saved"); setOpen(false); qc.invalidateQueries({ queryKey: ["all-services"] }); qc.invalidateQueries({ queryKey: ["services"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">Services</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full" onClick={create}>New service</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{form.id ? "Edit service" : "New service"}</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="grid gap-3">
              <div><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Slug</Label><Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Price (NGN)</Label><Input type="number" min={0} value={form.price_ngn} onChange={(e) => setForm({ ...form, price_ngn: Number(e.target.value) })} /></div>
                <div><Label>Duration (min)</Label><Input type="number" min={5} value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })} /></div>
                <div><Label>Sort</Label><Input type="number" min={0} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} /><Label>Active</Label></div>
              <Button type="submit" className="rounded-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mt-4 rounded-2xl"><CardContent className="p-0">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Name</th><th>Price</th><th>Duration</th><th>Active</th><th></th></tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{s.name}<div className="text-xs text-muted-foreground">{s.slug}</div></td>
                <td>{formatNGN(s.price_ngn)}</td>
                <td>{s.duration_min} min</td>
                <td>{s.active ? "Yes" : "No"}</td>
                <td className="text-right pr-4">
                  <Button size="sm" variant="ghost" onClick={() => edit(s)}>Edit</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={async () => {
                    if (!confirm("Delete this service?")) return;
                    try { await del({ data: { id: s.id } }); qc.invalidateQueries({ queryKey: ["all-services"] }); toast.success("Deleted"); }
                    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                  }}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </CardContent></Card>
    </div>
  );
}
