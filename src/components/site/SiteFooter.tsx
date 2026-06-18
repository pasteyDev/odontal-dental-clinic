import { Link } from "@tanstack/react-router";
import { Instagram, Phone, MapPin, Mail } from "lucide-react";
import { CLINIC } from "@/lib/clinic";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-[color:var(--cream)]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="font-serif text-2xl font-semibold text-primary">
              {CLINIC.name}
            </Link>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Thoughtful, patient-centred dental care for families across Aguda, Surulere and wider Lagos.
            </p>
            <div className="mt-6 max-w-md">
              <h4 className="font-serif text-base font-semibold">Get smile tips by email</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Occasional dental care tips and clinic news. No spam.
              </p>
              <div className="mt-3">
                <NewsletterForm />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground">Visit</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /><span>{CLINIC.address}</span></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><a href={`tel:${CLINIC.phoneIntl}`} className="hover:underline">{CLINIC.phone}</a></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><a href={`mailto:${CLINIC.email}`} className="hover:underline">{CLINIC.email}</a></li>
              <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-primary" /><a href={CLINIC.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">@odontaldentalclinicng</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hours</h4>
            <ul className="mt-3 space-y-1 text-sm">
              {CLINIC.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-3">
                  <span className="text-foreground/80">{h.day}</span>
                  <span className="text-muted-foreground">{h.open}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/admin/login" className="hover:text-foreground">Staff login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
