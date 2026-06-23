import {
  Instagram,
  Phone,
  MapPin,
  Mail,
  ArrowRight,
  Clock,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { NewsletterForm } from "./NewsletterForm";
import { CLINIC } from "@/lib/clinic";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-[color:var(--cream)]">
      {/* CTA */}
      <div className="border-b">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="font-serif text-3xl font-bold">
              Ready for a Healthier Smile?
            </h2>

            <p className="mt-2 text-muted-foreground">
              Book your appointment today and let our team
              care for your family's dental health.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full">
              <Link to="/book">
                Book Appointment

                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full"
            >
              <a href={`tel:${CLINIC.phoneIntl}`}>
                <Phone className="mr-2 h-4 w-4" />

                Call Us
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full"
            >
              <a
                href={`https://wa.me/${CLINIC.whatsapp.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="mr-2 h-4 w-4" />

                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="font-serif text-2xl font-bold text-primary"
            >
              {CLINIC.name}
            </Link>

            <p className="mt-4 text-sm text-muted-foreground">
              {CLINIC.tagline}
            </p>

            <div className="mt-6 flex gap-4">
              <a
                href={CLINIC.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border p-2 transition hover:bg-primary hover:text-white"
              >
                <FaInstagram  className="h-4 w-4" />
              </a>

              <a
                href={`https://wa.me/${CLINIC.whatsapp.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border p-2 transition hover:bg-primary hover:text-white"
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
              <a
                href={CLINIC.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border p-2 transition hover:bg-primary hover:text-white"
              >
                <FaFacebook  className="h-4 w-4" />
              </a>
              <a
                href={CLINIC.xTwitter}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border p-2 transition hover:bg-primary hover:text-white"
              >
                <FaXTwitter  className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h4>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="hover:text-primary"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  to="/book"
                  className="hover:text-primary"
                >
                  Book Appointment
                </Link>
              </li>

              <li>
                <Link
                  to="/reviews"
                  className="hover:text-primary"
                >
                  Reviews
                </Link>
              </li>

              <li>
                <Link
                  to="/blogs"
                  className="hover:text-primary"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </h4>

            <div className="mt-4 space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="mt-1 h-4 w-4 text-primary" />

                <span>{CLINIC.address}</span>
              </div>

              <div className="flex gap-3">
                <Phone className="mt-1 h-4 w-4 text-primary" />

                <a
                  href={`tel:${CLINIC.phoneIntl}`}
                  className="hover:text-primary"
                >
                  {CLINIC.phone}
                </a>
              </div>

              <div className="flex gap-3">
                <Mail className="mt-1 h-4 w-4 text-primary" />

                <a
                  href={`mailto:${CLINIC.email}`}
                  className="hover:text-primary"
                >
                  {CLINIC.email}
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter + Hours */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Opening Hours
            </h4>

            <div className="mt-4 space-y-2 text-sm">
              {CLINIC.hours.map((hour) => (
                <div
                  key={hour.day}
                  className="flex items-center justify-between"
                >
                  <span>{hour.day}</span>

                  <span className="text-muted-foreground">
                    {hour.open}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />

                <h5 className="font-medium">
                  Smile Tips Newsletter
                </h5>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Helpful oral health tips and clinic updates.
              </p>

              <div className="mt-4">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-muted-foreground lg:flex-row">
            <p>
              © {new Date().getFullYear()} {CLINIC.name}. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/privacy"
                className="hover:text-primary"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="hover:text-primary"
              >
                Terms of Service
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span>✓ Open 7 Days</span>
              <span>✓ Family-Friendly Care</span>
              <span>✓ Patient-Centred Dentistry</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}