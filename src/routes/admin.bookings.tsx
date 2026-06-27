import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listBookings, updateBookingStatus } from "@/lib/admin.functions";
import { EmailDialog } from "@/components/admin/EmailDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNGN } from "@/lib/clinic";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bookings")({ component: Bookings });

const STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"] as const;

type Status = typeof STATUSES[number];

const STATUS_STYLES: Record<Status, string> = {
  pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  no_show:   "bg-muted text-muted-foreground border-border",
};

function StatusBadge({ status }: { status: string }) {
  const s = status as Status;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[s] ?? "bg-muted text-muted-foreground border-border"}`}>
      {s.replace("_", " ")}
    </span>
  );
}

function Bookings() {
  const fn = useServerFn(listBookings);
  const upd = useServerFn(updateBookingStatus);
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fn(),
  });

  async function handleStatusChange(id: string, status: Status) {
    try {
      await upd({ data: { id, status } });
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Bookings</h1>
          {!isLoading && (
            <p className="mt-1 text-sm text-muted-foreground">
              {data.length} booking{data.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          Loading bookings…
        </div>
      )}

      {/* ── Mobile: card list ──────────────────────────────────── */}
      {!isLoading && (
        <div className="mt-6 flex flex-col gap-3 md:hidden">
          {data.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No bookings yet.
            </p>
          ) : (
            data.map((b) => {
              const svc = (b as { services?: { name?: string; price_ngn?: number } | null }).services;
              const serviceName = svc?.name ?? "your dental service";
              return (
                <Card key={b.id} className="rounded-2xl">
                  <CardContent className="p-4">
                    {/* Name + status */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium leading-tight">{b.patient_name}</p>
                        {b.email && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{b.email}</p>
                        )}
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="my-3 h-px bg-border" />

                    {/* Detail grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Service</p>
                        <p className="mt-0.5 text-sm">{svc?.name ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Price</p>
                        <p className="mt-0.5 text-sm">{formatNGN(b.price_ngn ?? 0)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Date</p>
                        <p className="mt-0.5 text-sm">{b.preferred_date}</p>
                        <p className="text-xs text-muted-foreground">{b.preferred_time}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Phone</p>
                        <a
                          href={`tel:${b.phone}`}
                          className="mt-0.5 block text-sm text-primary hover:underline"
                        >
                          {b.phone}
                        </a>
                      </div>
                    </div>

                    <div className="my-3 h-px bg-border" />

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3">
                      <Select
                        value={b.status}
                        onValueChange={(v) => handleStatusChange(b.id, v as Status)}
                      >
                        <SelectTrigger className="h-8 w-36 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {s.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <EmailDialog
                        toEmail={b.email}
                        toName={b.patient_name}
                        triggerLabel="Confirm"
                        initialSubject="Appointment confirmation for {preferredDate}"
                        initialBody={`Hello {patientName},\n\nYour {serviceName} appointment at Odontal Dental Clinic is confirmed for {preferredDate} at {preferredTime}.\n\nPlease call us if you need to reschedule.\n\nThank you,\nOdontal Dental Clinic`}
                        replacements={{
                          patientName: b.patient_name,
                          serviceName,
                          preferredDate: b.preferred_date,
                          preferredTime: b.preferred_time,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* ── Desktop: table ─────────────────────────────────────── */}
      {!isLoading && (
        <Card className="mt-6 hidden rounded-2xl md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Patient</th>
                    <th className="py-3">Phone</th>
                    <th className="py-3">Service</th>
                    <th className="py-3">Date / time</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Created</th>
                    <th className="py-3" />
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">
                        No bookings yet.
                      </td>
                    </tr>
                  ) : (
                    data.map((b) => {
                      const svc = (b as { services?: { name?: string; price_ngn?: number } | null }).services;
                      const serviceName = svc?.name ?? "your dental service";
                      return (
                        <tr key={b.id} className="border-t border-border align-middle">
                          <td className="px-4 py-3">
                            <p className="font-medium">{b.patient_name}</p>
                            {b.email && (
                              <p className="text-xs text-muted-foreground">{b.email}</p>
                            )}
                          </td>
                          <td className="py-3">
                            <a href={`tel:${b.phone}`} className="hover:underline">
                              {b.phone}
                            </a>
                          </td>
                          <td className="py-3">{svc?.name ?? "—"}</td>
                          <td className="py-3">
                            <p>{b.preferred_date}</p>
                            <p className="text-xs text-muted-foreground">{b.preferred_time}</p>
                          </td>
                          <td className="py-3">{formatNGN(b.price_ngn ?? 0)}</td>
                          <td className="py-3">
                            <Select
                              value={b.status}
                              onValueChange={(v) => handleStatusChange(b.id, v as Status)}
                            >
                              <SelectTrigger className="h-8 w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUSES.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s.replace("_", " ")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 text-xs text-muted-foreground">
                            {new Date(b.created_at).toLocaleString()}
                          </td>
                          <td className="py-3 pr-4">
                            <EmailDialog
                              toEmail={b.email}
                              toName={b.patient_name}
                              triggerLabel="Confirm"
                              initialSubject="Appointment confirmation for {preferredDate}"
                              initialBody={`Hello {patientName},\n\nYour {serviceName} appointment at Odontal Dental Clinic is confirmed for {preferredDate} at {preferredTime}.\n\nPlease call us if you need to reschedule.\n\nThank you,\nOdontal Dental Clinic`}
                              replacements={{
                                patientName: b.patient_name,
                                serviceName,
                                preferredDate: b.preferred_date,
                                preferredTime: b.preferred_time,
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })
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