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
  // { to: "/book", label: "Book" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
  { to: "/blogs", label: "Blogs" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
  <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

    {/* Logo */}
    <Link
      to="/"
      className="flex shrink-0 items-center gap-2"
    >
      <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full sm:h-14 sm:w-14">
        <img
          src={logo}
          alt="Odontal Dental Clinic Logo"
          className="h-full w-full object-contain"
        />
      </span>

      <div className="hidden min-[420px]:block">
        <p className="font-serif text-lg font-semibold text-primary lg:text-xl">
          {CLINIC.shortName}
        </p>

        <p className="text-xs text-muted-foreground">
          Dental Clinic
        </p>
      </div>
    </Link>

    {/* Desktop Navigation */}
    <nav className="hidden items-center gap-1 md:flex">
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          activeOptions={{
            exact: n.to === "/",
          }}
          activeProps={{
            className:
              "bg-primary text-primary-foreground",
          }}
          className="
            rounded-full
            px-4
            py-2
            text-sm
            font-medium
            text-foreground/80
            transition-all
            duration-200
            hover:bg-accent
            hover:text-foreground
          "
        >
          {n.label}
        </Link>
      ))}
    </nav>

    {/* Right Actions */}
    <div className="flex items-center gap-2">

      {/* Phone */}
      <a
        href={`tel:${CLINIC.phoneIntl}`}
        className="
          hidden
          lg:inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-border
          px-4
          py-2
          text-sm
          font-medium
          text-foreground/80
          transition-colors
          hover:bg-accent
        "
      >
        <Phone className="h-4 w-4" />

        {CLINIC.phone}
      </a>

      {/* Book */}
      <Button
        asChild
        size="sm"
        className="
          hidden
          md:inline-flex
          rounded-full
        "
      >
        <Link to="/book">
          Book Appointment
        </Link>
      </Button>

      {/* Mobile Menu Button */}
      <button
        type="button"
        aria-label="Toggle Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="
          inline-flex
          items-center
          justify-center
          rounded-full
          p-2.5
          transition-colors
          hover:bg-accent
          md:hidden
        "
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>
    </div>
  </div>

  {/* Mobile Navigation */}
  <div
    className={`
      overflow-hidden
      transition-all
      duration-300
      md:hidden
      ${
        open
          ? "max-h-screen border-t border-border"
          : "max-h-0"
      }
    `}
  >
    <div className="bg-background px-4 py-5">

      <nav className="flex flex-col gap-2">

        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            onClick={() => setOpen(false)}
            activeOptions={{
              exact: n.to === "/",
            }}
            activeProps={{
              className:
                "bg-primary text-primary-foreground",
            }}
            className="
              rounded-2xl
              px-4
              py-3
              text-sm
              font-medium
              transition-colors
              hover:bg-accent
            "
          >
            {n.label}
          </Link>
        ))}

      </nav>

      {/* Mobile CTAs */}
      <div className="mt-6 space-y-3">

        <Button
          asChild
          className="w-full rounded-full"
        >
          <Link
            to="/book"
            onClick={() => setOpen(false)}
          >
            Book Appointment
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full rounded-full"
        >
          <a href={`tel:${CLINIC.phoneIntl}`}>
            <Phone className="mr-2 h-4 w-4" />

            Call {CLINIC.phone}
          </a>
        </Button>

      </div>

    </div>
  </div>
</header>
  );
}
