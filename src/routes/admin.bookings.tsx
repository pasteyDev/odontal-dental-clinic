import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listBookings, updateBookingStatus } from "@/lib/admin.functions";
import { EmailDialog } from "@/components/admin/EmailDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNGN } from "@/lib/clinic";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bookings")({ component: Bookings });

const STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"] as const;

function Bookings() {
  const fn = useServerFn(listBookings);
  const upd = useServerFn(updateBookingStatus);
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["bookings"], queryFn: () => fn() });

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Bookings</h1>
      <Card className="mt-6 rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Patient</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Date/Time</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                )}
                {data.map((b) => {
                  const svc = (b as { services?: { name?: string; price_ngn?: number } | null }).services;
                  const serviceName = svc?.name ?? "your dental service";
                  return (
                    <tr key={b.id} className="border-t border-border align-top">
                      <td className="px-4 py-3 font-medium">
                        {b.patient_name}
                        <div className="text-xs text-muted-foreground">{b.email ?? ""}</div>
                      </td>
                      <td>
                        <a className="hover:underline" href={`tel:${b.phone}`}>
                          {b.phone}
                        </a>
                      </td>
                      <td>{svc?.name ?? "-"}</td>
                      <td>
                        {b.preferred_date}
                        <div className="text-xs text-muted-foreground">{b.preferred_time}</div>
                      </td>
                      <td>{formatNGN(b.price_ngn ?? 0)}</td>
                      <td>
                        <Select
                          value={b.status}
                          onValueChange={async (v) => {
                            try {
                              await upd({ data: { id: b.id, status: v as typeof STATUSES[number] } });
                              toast.success("Updated");
                              qc.invalidateQueries({ queryKey: ["bookings"] });
                              qc.invalidateQueries({ queryKey: ["dashboard"] });
                            } catch (e) {
                              toast.error(e instanceof Error ? e.message : "Failed");
                            }
                          }}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="text-xs text-muted-foreground">
                        {new Date(b.created_at).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <EmailDialog
                          toEmail={b.email}
                          toName={b.patient_name}
                          triggerLabel="Confirm"
                          initialSubject="Appointment confirmation for {preferredDate}"
                          initialBody={`Hello {patientName},

Your {serviceName} appointment at Odontal Dental Clinic is confirmed for {preferredDate} at {preferredTime}.

Please call us if you need to reschedule.

Thank you,
Odontal Dental Clinic`}
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
                })}
                {!isLoading && data.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-muted-foreground">
                      No bookings yet.
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
