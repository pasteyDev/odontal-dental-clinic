import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { CLINIC } from "@/lib/clinic";
import { Button } from "@/components/ui/button";
import logo from "@/assets/odontal-logo-2.png";


const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/book", label: "Book" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-semibold text-primary">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full">
            <img src={logo} alt="Odontal Dental Clinic Logo" />
          </span>
          <span className="hidden sm:inline">{CLINIC.shortName}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${CLINIC.phoneIntl}`}
            className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent sm:inline-flex"
          >
            <Phone className="h-4 w-4" /> {CLINIC.phone}
          </a>
          <Button asChild size="sm" className="hidden md:inline-flex rounded-full">
            <Link to="/book">Book appointment</Link>
          </Button>
          <button
            className="rounded-full p-2 hover:bg-accent md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col p-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent"
                activeProps={{ className: "bg-accent" }}
              >
                {n.label}
              </Link>
            ))}
            <Button asChild className="mt-2 rounded-full">
              <Link to="/book" onClick={() => setOpen(false)}>Book appointment</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
