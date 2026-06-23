import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/SiteLayout";
import { buildHead } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { listServicesPublic } from "@/lib/public.functions";
import { formatNGN } from "@/lib/clinic";
import { Sparkles } from "lucide-react";
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronRight } from 'lucide-react'

function FadeInSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const [ref, inView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.6,
        delay,
      }}
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
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => fetchServices() });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <FadeInSection>
          <nav
                        aria-label="Breadcrumb"
                        className="mb-8 mt-[-4] flex items-center gap-2 text-sm text-black/80"
                      >
                        <Link to="/" className="transition hover:text-black">
                          Home
                        </Link>
          
                        <ChevronRight className="h-4 w-4" />
          
                        <span className="font-medium text-black"> Services</span>
                  </nav>
          <h1 className="font-serif text-4xl font-semibold md:text-5xl">Services & pricing</h1>
        </FadeInSection>
        <FadeInSection delay={0.2}>
          <p className="mt-3 max-w-2xl text-muted-foreground">Clear, fair pricing for every treatment. Final costs are confirmed after consultation.</p>
        </FadeInSection>

       <FadeInSection>
         <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id} className="rounded-2xl border-border/70 transition-shadow hover:shadow-[var(--shadow-soft)]">
              <CardContent className="p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--blush)] text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-serif text-xl font-semibold">{s.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-primary">{formatNGN(s.price_ngn)}</div>
                    <div className="text-xs text-muted-foreground">{s.duration_min} min appointment</div>
                  </div>
                  <Button asChild size="sm" className="rounded-full">
                    <Link to="/book" search={{ service: s.id } as never}>Book</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
       </FadeInSection>
      </section>
    </SiteLayout>
  );
}
