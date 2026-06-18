import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/lib/public.functions";
import { CLINIC } from "@/lib/clinic";
import { buildHead } from "@/lib/seo";
import { Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildHead({
      title: "Contact — Odontal Dental Clinic, Aguda, Surulere",
      description: "Call, visit or message Odontal Dental Clinic in Aguda, Lagos. We're open every day.",
      path: "/contact",
    }),
  component: Contact,
});

function Contact() {
  const send = useServerFn(submitContact);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-serif text-4xl font-semibold md:text-5xl">Get in touch</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">Questions about treatment, pricing or directions? We're happy to help.</p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-primary" /><div><div className="font-medium">Address</div><div className="text-muted-foreground">{CLINIC.address}</div></div></li>
                <li className="flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 text-primary" /><div><div className="font-medium">Phone</div><a href={`tel:${CLINIC.phoneIntl}`} className="text-muted-foreground hover:underline">{CLINIC.phone}</a></div></li>
                <li className="flex items-start gap-3"><Mail className="mt-0.5 h-5 w-5 text-primary" /><div><div className="font-medium">Email</div><a href={`mailto:${CLINIC.email}`} className="text-muted-foreground hover:underline">{CLINIC.email}</a></div></li>
              </ul>
              <div className="mt-6 overflow-hidden rounded-xl">
                <iframe title="Map" src={CLINIC.mapsEmbed} className="h-56 w-full border-0" loading="lazy" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <form
                className="grid gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  try {
                    await send({ data: form });
                    toast.success("Message sent. We'll be in touch soon.");
                    setForm({ name: "", email: "", phone: "", message: "" });
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Could not send");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Email</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div><Label>Phone</Label><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                </div>
                <div><Label>Message</Label><Textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
                <Button disabled={loading} type="submit" className="rounded-full">{loading ? "Sending…" : "Send message"}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
