import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listServicesPublic, submitBooking } from "@/lib/public.functions";
import { formatNGN } from "@/lib/clinic";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const searchSchema = z.object({ service: z.string().optional() });

export const Route = createFileRoute("/book")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Book an Appointment — Odontal Dental Clinic" },
      { name: "description", content: "Request an appointment with Odontal Dental Clinic in Aguda, Lagos. Simple online booking — we confirm by phone." },
    ],
  }),
  component: Book,
});

const TIMES = ["8:30 AM","9:30 AM","10:30 AM","11:30 AM","12:30 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM"];

function Book() {
  const fetchServices = useServerFn(listServicesPublic);
  const submit = useServerFn(submitBooking);
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => fetchServices() });
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    service_id: search.service ?? "",
    patient_name: "",
    phone: "",
    email: "",
    preferred_date: "",
    preferred_time: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const selected = services.find((s) => s.id === form.service_id);
  const today = new Date().toISOString().slice(0, 10);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await submit({ data: form });
      setDone(true);
      toast.success("Appointment request received!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-xl px-4 py-24 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-4 font-serif text-3xl font-semibold">Request received</h1>
          <p className="mt-3 text-muted-foreground">Thank you — we've received your booking request and our team will call you shortly to confirm your appointment.</p>
          <Button className="mt-8 rounded-full" onClick={() => navigate({ to: "/" })}>Back to home</Button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-serif text-4xl font-semibold md:text-5xl">Book an appointment</h1>
        <p className="mt-3 text-muted-foreground">Fill in your details — we'll call you to confirm a time that works.</p>

        <Card className="mt-8 rounded-2xl">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={onSubmit} className="grid gap-5">
              <div>
                <Label>Service</Label>
                <Select value={form.service_id} onValueChange={(v) => update("service_id", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose a service" /></SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name} · {formatNGN(s.price_ngn)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selected && <p className="mt-1.5 text-xs text-muted-foreground">{selected.description}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Preferred date</Label>
                  <Input type="date" min={today} required value={form.preferred_date} onChange={(e) => update("preferred_date", e.target.value)} />
                </div>
                <div>
                  <Label>Preferred time</Label>
                  <Select value={form.preferred_time} onValueChange={(v) => update("preferred_time", v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Pick a time" /></SelectTrigger>
                    <SelectContent>
                      {TIMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Full name</Label>
                <Input required minLength={2} value={form.patient_name} onChange={(e) => update("patient_name", e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Phone</Label>
                  <Input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </div>
                <div>
                  <Label>Email <span className="text-muted-foreground">(optional)</span></Label>
                  <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Notes <span className="text-muted-foreground">(optional)</span></Label>
                <Textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Tell us anything that helps us prepare for your visit." />
              </div>
              <Button type="submit" disabled={loading || !form.service_id || !form.preferred_date || !form.preferred_time} size="lg" className="rounded-full">
                {loading ? "Submitting…" : "Request appointment"}
              </Button>
              <p className="text-xs text-muted-foreground">By submitting, you agree to be contacted about your appointment. No payment is taken online.</p>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
