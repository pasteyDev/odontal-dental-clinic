import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listPatients } from "@/lib/admin.functions";
import { EmailDialog } from "@/components/admin/EmailDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/patients")({ component: Patients });

function Patients() {
  const fn = useServerFn(listPatients);
  const { data = [] } = useQuery({ queryKey: ["patients"], queryFn: () => fn() });
  const [q, setQ] = useState("");
  const filtered = data.filter((p) =>
    `${p.name} ${p.phone} ${p.email ?? ""}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Patients</h1>
      <Input
        className="mt-4 max-w-sm"
        placeholder="Search by name, phone or email"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Card className="mt-4 rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Visits</th>
                  <th>First seen</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td>
                      <a className="hover:underline" href={`tel:${p.phone}`}>
                        {p.phone}
                      </a>
                    </td>
                    <td>{p.email ?? "-"}</td>
                    <td>{p.visit_count}</td>
                    <td className="text-xs text-muted-foreground">
                      {new Date(p.first_seen).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <EmailDialog
                        toEmail={p.email}
                        toName={p.name}
                        initialSubject="A note from Odontal Dental Clinic"
                        initialBody={`Hello ${p.name},

Thank you for choosing Odontal Dental Clinic.

Odontal Dental Clinic`}
                      />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                      No patients.
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
