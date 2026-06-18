import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { buildHead } from "@/lib/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CLINIC } from "@/lib/clinic";

export const Route = createFileRoute("/faq")({
  head: () =>
    buildHead({
      title: "FAQ — Odontal Dental Clinic",
      description: "Answers to common questions about services, location, hours and how to book at Odontal Dental Clinic.",
      path: "/faq",
    }),
  component: FAQ,
});

const QA = [
  { q: "What services does Odontal Dental Clinic offer?", a: "Checkups, professional cleaning, fillings, extractions, teeth whitening, restorative treatments, dental implant consultations and children's dental care." },
  { q: "Where is Odontal Dental Clinic located?", a: `${CLINIC.address}. We're in the heart of Aguda, easy to reach from Ijesha, Ogunlana Drive and surrounding parts of Surulere.` },
  { q: "How can I get in touch?", a: `Call us on ${CLINIC.phone} or use the contact form. You can also visit during our opening hours.` },
  { q: "What are your opening hours?", a: "Monday–Friday 8:00 AM – 8:00 PM, Saturday & Sunday 9:00 AM – 5:00 PM." },
  { q: "Do I need to pay online to book?", a: "No. Booking is free — we'll call you to confirm your appointment. Payment is made at the clinic." },
];

function FAQ() {
  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: QA.map((q) => ({
              "@type": "Question",
              name: q.q,
              acceptedAnswer: { "@type": "Answer", text: q.a },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-serif text-4xl font-semibold md:text-5xl">Frequently asked questions</h1>
        <Accordion type="single" collapsible className="mt-8">
          {QA.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left font-serif text-lg">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}
