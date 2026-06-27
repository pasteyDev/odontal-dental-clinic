import {
  Phone, MapPin, Mail, ArrowRight, Clock,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./NewsletterForm";
import { CLINIC } from "@/lib/clinic";

const QUICK_LINKS = [
  { to: "/",        label: "Home" },
  { to: "/about",   label: "About" },
  { to: "/services",label: "Services" },
  { to: "/book",    label: "Book Appointment" },
  { to: "/reviews", label: "Reviews" },
  { to: "/blogs",   label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

const SOCIAL = [
  { href: CLINIC.instagram, icon: FaInstagram, label: "Instagram" },
  {
    href: `https://wa.me/${CLINIC.whatsapp.replace(/\D/g, "")}`,
    icon: FaWhatsapp,
    label: "WhatsApp",
  },
  { href: CLINIC.facebook, icon: FaFacebook, label: "Facebook" },
  { href: CLINIC.xTwitter, icon: FaXTwitter,  label: "X / Twitter" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-[color:var(--cream)] sm:mt-28">

      {/* ── CTA banner ────────────────────────────────────────── */}
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-lg">
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                Ready for a Healthier Smile?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Book your appointment today and let our team care for your
                family's dental health.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button asChild className="rounded-full">
                <Link to="/book">
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <a href={`tel:${CLINIC.phoneIntl}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <a
                  href={`https://wa.me/${CLINIC.whatsapp.replace(/\D/g, "")}`}
                  target="_blank" rel="noopener noreferrer"
                >
                  <FaWhatsapp className="mr-2 h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="font-serif text-2xl font-bold text-primary">
              {CLINIC.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {CLINIC.tagline}
            </p>

            <div className="mt-6 flex gap-3">
              {SOCIAL.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Contact
            </h4>
            <div className="mt-4 space-y-4">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-foreground/80">
                  {CLINIC.address}
                </p>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={`tel:${CLINIC.phoneIntl}`}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {CLINIC.phone}
                </a>
              </div>
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={`mailto:${CLINIC.email}`}
                  className="break-all text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {CLINIC.email}
                </a>
              </div>
            </div>

            {/* Hours */}
            <h4 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Opening Hours
            </h4>
            <div className="mt-3 space-y-1.5">
              {CLINIC.hours.map((hour) => (
                <div
                  key={hour.day}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-foreground/80">{hour.day}</span>
                  <span className="text-muted-foreground">{hour.open}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Newsletter
            </h4>
            <div className="mt-4 flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">Smile Tips</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Helpful oral health tips and clinic updates delivered to your inbox.
                </p>
              </div>
            </div>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>

        </div>

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div className="mt-12 border-t border-border pt-6">
          <div className="flex flex-col gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Link to="/privacy" className="transition-colors hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="/terms" className="transition-colors hover:text-primary">
                Terms of Service
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="text-primary">✓</span> Open 7 Days
              </span>
              <span className="flex items-center gap-1">
                <span className="text-primary">✓</span> Family-Friendly
              </span>
              <span className="flex items-center gap-1">
                <span className="text-primary">✓</span> Patient-Centred
              </span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}