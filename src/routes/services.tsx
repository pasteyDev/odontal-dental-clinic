import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/SiteLayout";
import { buildHead } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listServicesPublic } from "@/lib/public.functions";
import { formatNGN } from "@/lib/clinic";
import { Sparkles, ChevronRight, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function FadeInSection({
  children, delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export const Route = createFileRoute("/services")({
  head: () =>
    buildHead({
      title: "Dental Services & Pricing — Odontal Dental Clinic",
      description:
        "Transparent pricing for dental checkups, cleaning, fillings, extractions, whitening, implants and children's dentistry in Aguda, Lagos.",
      path: "/services",
    }),
  component: Services,
});

function Services() {
  const fetchServices = useServerFn(listServicesPublic);
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchServices(),
  });

  return (
    <SiteLayout>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="border-b bg-[color:var(--cream)]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Link to="/" className="transition hover:text-foreground">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-foreground">Services</span>
            </nav>

            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                What We Offer
              </span>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.15] sm:text-5xl">
                Services & Pricing
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Clear, fair pricing for every treatment. Final costs are
                confirmed after consultation so there are never any surprises.
              </p>
            </div>

            {/* Trust strip */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {[
                "Transparent pricing",
                "No hidden fees",
                "Family-friendly care",
                "Open 7 days a week",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="text-primary">✓</span> {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Services grid ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-muted/30 p-6">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
                <div className="mt-5 space-y-2.5">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div className="space-y-1.5">
                    <div className="h-7 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-9 w-16 animate-pulse rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl font-semibold">No services listed yet</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Please check back soon or contact us directly for pricing.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card className="group h-full rounded-2xl border-border/60 transition-shadow duration-200 hover:shadow-lg">
                  <CardContent className="flex h-full flex-col p-6 sm:p-7">
                    {/* Icon */}
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    {/* Name + description */}
                    <h2 className="mt-4 font-serif text-xl font-semibold leading-snug">
                      {s.name}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>

                    {/* Divider */}
                    <div className="my-5 h-px bg-border" />

                    {/* Price + duration + CTA */}
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="font-serif text-2xl font-bold text-primary">
                          {formatNGN(s.price_ngn)}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 shrink-0" />
                          {s.duration_min} min appointment
                        </div>
                      </div>
                      <Button asChild size="sm" className="shrink-0 rounded-full">
                        <Link to="/book" search={{ service: s.id } as never}>
                          Book
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

      </section>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      <FadeInSection>
        <section className="bg-[color:var(--cream)]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
            <div className="rounded-3xl bg-primary/5 px-7 py-12 text-center sm:px-12 sm:py-16">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Not sure where to start?
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                Book a Consultation First
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Not sure which treatment you need? Book a general consultation
                and our team will assess your dental health and recommend the
                best path forward.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link to="/book">
                    Book Appointment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                  <Link to="/contact">Ask a Question</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

    </SiteLayout>
  );
}