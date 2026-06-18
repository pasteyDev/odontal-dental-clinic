import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star, ShieldCheck, Sparkles, Clock, MapPin, Phone, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { buildHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listServicesPublic, getDailyRandomReviews } from "@/lib/public.functions";
import { CLINIC, formatNGN } from "@/lib/clinic";
import introVideo from "@/assets/odontal-introduct.mp4";
import tools from "@/assets/tools.jpg";

function DailyReviews() {
  const fetchDaily = useServerFn(getDailyRandomReviews);
  const { data: reviews = [] } = useQuery({ queryKey: ["dailyReviews"], queryFn: () => fetchDaily() });
  if (!reviews || reviews.length === 0) {
    return <p className="mt-6 text-center text-sm text-muted-foreground">No reviews yet.</p>;
  }
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r: any) => (
        <Card key={r.id} className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < (r.rating ?? 0) ? "fill-current" : ""}`} />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{r.body}"</p>
            <p className="mt-4 text-sm font-medium">— {r.reviewer_name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export const Route = createFileRoute("/")({
  head: () =>
    buildHead({
      title: "Odontal Dental Clinic — Trusted Dentist in Aguda, Surulere, Lagos",
      description:
        "Modern dental clinic in Aguda, Lagos. Checkups, cleaning, fillings, whitening and more. Book your appointment with Odontal Dental Clinic today.",
      path: "/",
    }),
  component: Home,
});

function Home() {
  const fetchServices = useServerFn(listServicesPublic);
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => fetchServices() });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[image:var(--gradient-hero)] opacity-70" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground/70">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" /> 5.0 rating on Google
            </div>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-foreground md:text-6xl">
              Healthy smiles, gently cared for in Aguda.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              {CLINIC.tagline} From routine checkups to whitening and implants, we explain every step so you feel confident in your care.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/book">Book appointment <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href={`tel:${CLINIC.phoneIntl}`}><Phone className="mr-1 h-4 w-4" /> {CLINIC.phone}</a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Clean & hygienic</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Open every day</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Surulere, Lagos</div>
            </div>
          </div>
          <div className="relative">
            <video
              autoPlay
              muted
              loop
              
              playsInline
              preload="metadata"
              className="w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
            >
              <source src={introVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-semibold md:text-4xl">Comprehensive dental services</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">Preventive, restorative and cosmetic care — all under one welcoming roof.</p>
          </div>
          <Button asChild variant="ghost" className="rounded-full"><Link to="/services">View all & pricing →</Link></Button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <Card key={s.id} className="rounded-2xl border-border/70 transition-shadow hover:shadow-[var(--shadow-soft)]">
              <CardContent className="p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--blush)] text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold">{s.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{s.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-primary">{formatNGN(s.price_ngn)}</span>
                  <span className="text-muted-foreground">{s.duration_min} min</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why choose */}
      <section className="bg-[color:var(--cream)] py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center">
          <img src={tools} alt="Clean and organised dental tools" width={1200} height={900} loading="lazy" className="rounded-3xl shadow-[var(--shadow-soft)]" />
          <div>
            <h2 className="font-serif text-3xl font-semibold md:text-4xl">Why families choose Odontal</h2>
            <ul className="mt-6 space-y-4">
              {[
                "Experienced dentists who explain every step clearly",
                "Spotless treatment rooms and properly sterilised tools",
                "Warm reception and short, well-organised visits",
                "Open 7 days a week, easy to reach from anywhere in Surulere",
                "Care for everyone — children, adults and older patients",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-foreground/90">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" /><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-1 text-primary">
            {[0,1,2,3,4].map((i) => <Star key={i} className="h-5 w-5 fill-current" />)}
          </div>
          <h2 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">Loved by our patients</h2>
          <p className="mt-2 text-muted-foreground">5.0 average rating on Google.</p>
        </div>
        <DailyReviews />
        <div className="mt-6 text-center">
          <Button asChild variant="ghost" className="rounded-full"><Link to="/reviews">View all reviews →</Link></Button>
        </div>
      </section>

      {/* Location + CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-8 rounded-3xl bg-gradient-to-br from-[color:var(--blush)] to-[color:var(--accent)] p-8 md:grid-cols-2 md:p-12">
          <div>
            <h2 className="font-serif text-3xl font-semibold">Visit us in Aguda</h2>
            <p className="mt-3 text-foreground/80">{CLINIC.address}</p>
            <p className="mt-1 text-foreground/80">Call: <a className="font-semibold underline" href={`tel:${CLINIC.phoneIntl}`}>{CLINIC.phone}</a></p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-full"><Link to="/book">Book now</Link></Button>
              <Button asChild variant="outline" className="rounded-full bg-background"><a href={CLINIC.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <iframe title="Map" src={CLINIC.mapsEmbed} className="h-64 w-full border-0" loading="lazy" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
