import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listStaff, inviteStaff, updateStaffRole, removeStaff } from "@/lib/admin.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/staff")({ component: Staff });

const ROLES = ["admin", "staff", "receptionist"] as const;

function Staff() {
  const fn = useServerFn(listStaff);
  const inv = useServerFn(inviteStaff);
  const upd = useServerFn(updateStaffRole);
  const rm = useServerFn(removeStaff);
  const qc = useQueryClient();
  const { data = [], error } = useQuery({ queryKey: ["staff"], queryFn: () => fn() });
  const [form, setForm] = useState({ email: "", password: "", role: "staff" as typeof ROLES[number] });

  if (error) return <p className="text-destructive">{(error as Error).message}</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Staff & roles</h1>

      <Card className="mt-6 rounded-2xl"><CardContent className="p-5">
        <h2 className="font-serif text-lg font-semibold">Invite staff</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-4" onSubmit={async (e) => {
          e.preventDefault();
          try { await inv({ data: form }); toast.success("Created"); setForm({ email: "", password: "", role: "staff" }); qc.invalidateQueries({ queryKey: ["staff"] }); }
          catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
        }}>
          <div><Label>Email</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label>Temp password</Label><Input required minLength={8} type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <div><Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as typeof ROLES[number] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-end"><Button type="submit" className="w-full rounded-full">Create</Button></div>
        </form>
      </CardContent></Card>

      <Card className="mt-5 rounded-2xl"><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Email</th><th>Roles</th><th>Add role</th><th></th></tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.user_id} className="border-t border-border">
                <td className="px-4 py-3">{u.email ?? u.user_id}</td>
                <td>
                  {u.roles.map((r) => (
                    <Badge key={r} variant="secondary" className="mr-1 cursor-pointer"
                      onClick={async () => { await upd({ data: { user_id: u.user_id, role: r as typeof ROLES[number], add: false } }); qc.invalidateQueries({ queryKey: ["staff"] }); }}>
                      {r} ×
                    </Badge>
                  ))}
                </td>
                <td>
                  <Select onValueChange={async (v) => { await upd({ data: { user_id: u.user_id, role: v as typeof ROLES[number], add: true } }); qc.invalidateQueries({ queryKey: ["staff"] }); toast.success("Role added"); }}>
                    <SelectTrigger className="h-8 w-36"><SelectValue placeholder="add role" /></SelectTrigger>
                    <SelectContent>{ROLES.filter((r) => !u.roles.includes(r)).map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className="text-right pr-4">
                  <Button size="sm" variant="ghost" className="text-destructive"
                    onClick={async () => { if (!confirm("Remove this staff member entirely?")) return; try { await rm({ data: { user_id: u.user_id } }); qc.invalidateQueries({ queryKey: ["staff"] }); toast.success("Removed"); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); } }}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}
