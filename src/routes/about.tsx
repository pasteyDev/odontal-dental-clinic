import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { buildHead } from "@/lib/seo";
import aboutVideo from "@/assets/Odontal-about.mp4";
import { CLINIC } from "@/lib/clinic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () =>
    buildHead({
      title: "About Odontal Dental Clinic — Aguda, Surulere",
      description:
        "A modern dental clinic in Aguda providing patient-centred oral care for families across Surulere and wider Lagos.",
      path: "/about",
    }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="font-serif text-4xl font-semibold md:text-5xl">About {CLINIC.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {CLINIC.name} is a modern dental practice in Aguda, Lagos offering thoughtful,
              patient-centred oral care for individuals and families across Surulere and wider
              Lagos. We combine clinical expertise with a calm, hygienic environment so patients of
              all ages can receive treatment with confidence.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/book">Book appointment</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/contact">Contact us</Link>
              </Button>
            </div>
          </div>

          <div>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
            >
              <source src={aboutVideo} type="video/mp4" />
            </video>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--blush)] text-primary mx-auto">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">Care built around you</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Clear communication, gentle treatment and personalised plans to suit every patient.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--blush)] text-primary mx-auto">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">Prevention first</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Emphasis on early detection, prevention and patient education to avoid emergencies.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--blush)] text-primary mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">
                A calm, hygienic environment
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Spotless treatment rooms, strict sterilisation and a welcoming team to ease anxiety.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 prose prose-neutral max-w-none text-foreground/90">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-semibold">A patient-first approach</h2>
            <p>
              From the moment you step into our clinic at 21 Agbebi Street, you meet a welcoming
              team focused on your comfort and understanding. We take time to explain diagnoses,
              options and expected outcomes so you can make informed choices about your care.
            </p>
          </div>
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-semibold">Infection control and equipment</h2>
            <p>
              We adhere to professional infection control standards. Instruments are sterilised
              using validated procedures and our treatment rooms are regularly cleaned. We invest in
              modern dental equipment to provide effective, minimally-invasive care.
            </p>
          </div>
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-semibold">Community and training</h2>
            <p>
              We are part of the local community and support oral health education initiatives. Our
              clinicians undertake regular professional development to stay current with best
              practice.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold">Accessibility</h2>
            <p>
              If you have accessibility needs, language preferences or specific concerns, please
              contact us before your visit so we can make appropriate arrangements.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
