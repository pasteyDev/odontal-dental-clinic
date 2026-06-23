import { createFileRoute, Link } from '@tanstack/react-router'
import { SiteLayout } from '@/components/site/SiteLayout'
import { buildHead } from '@/lib/seo'
import { ChevronRight} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CLINIC } from '@/lib/clinic'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

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

export const Route = createFileRoute('/faq')({
  head: () =>
    buildHead({
      title: 'FAQ — Odontal Dental Clinic',
      description:
        'Answers to common questions about services, location, hours and how to book at Odontal Dental Clinic.',
      path: '/faq',
    }),
  component: FAQ,
})

const QA = [
  {
    q: 'What services does Odontal Dental Clinic offer?',
    a: "Checkups, professional cleaning, fillings, extractions, teeth whitening, restorative treatments, dental implant consultations and children's dental care.",
  },
  {
    q: 'Where is Odontal Dental Clinic located?',
    a: `${CLINIC.address}. We're in the heart of Aguda, easy to reach from Ijesha, Ogunlana Drive and surrounding parts of Surulere.`,
  },
  {
    q: 'How can I get in touch?',
    a: `Call us on ${CLINIC.phone} or use the contact form. You can also visit during our opening hours.`,
  },
  {
    q: 'What are your opening hours?',
    a: 'Monday–Friday 8:00 AM – 8:00 PM, Saturday & Sunday 9:00 AM – 5:00 PM.',
  },
  {
    q: 'Do I need to pay online to book?',
    a: "No. Booking is free — we'll call you to confirm your appointment. Payment is made at the clinic.",
  },
  {
    q: 'How much does a dental checkup cost?',
    a: 'The cost depends on the treatment required. Contact us directly or book an appointment for a personalised consultation.',
  },
  {
    q: 'Do you treat children?',
    a: 'Yes. We provide dental care for children, teenagers, adults, and seniors.',
  },
  {
    q: 'Do you offer teeth whitening?',
    a: 'Absolutely. We provide safe and effective professional whitening treatments.',
  },
  {
    q: 'What should I do during a dental emergency?',
    a: 'Call us immediately using our emergency contact number so we can advise you and arrange urgent care.',
  },
]

function FAQ() {
  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: QA.map((q) => ({
              '@type': 'Question',
              name: q.q,
              acceptedAnswer: { '@type': 'Answer', text: q.a },
            })),
          }).replace(/</g, '\\u003c'),
        }}
      />
      <FadeInSection>
        
        <section className="mx-auto max-w-3xl px-4 py-16">
          <nav
              aria-label="Breadcrumb"
              className="mb-8 mt-[-4] flex items-center gap-2 text-sm text-black/80"
            >
              <Link to="/" className="transition hover:text-black">
                Home
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span className="font-medium text-black"> FAQ</span>
        </nav>
          <h1 className="font-serif text-4xl font-semibold md:text-5xl">
            Frequently asked questions
          </h1>
          <Accordion type="single" collapsible className="mt-8">
            {QA.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left font-serif text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </FadeInSection>
    </SiteLayout>
  )
}
