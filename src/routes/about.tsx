import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Sparkles, ShieldCheck, Users,
  ChevronRight, Clock, MapPin, Phone,
} from 'lucide-react'
import { SiteLayout } from '@/components/site/SiteLayout'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { buildHead } from '@/lib/seo'
import { CLINIC } from '@/lib/clinic'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import aboutVideo from '@/assets/Odontal-about.mp4'

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
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
      {children}
    </span>
  )
}

export const Route = createFileRoute('/about')({
  head: () =>
    buildHead({
      title: 'About Odontal Dental Clinic — Aguda, Surulere',
      description:
        'A modern dental clinic in Aguda providing patient-centred oral care for families across Surulere and wider Lagos.',
      path: '/about',
    }),
  component: About,
})

function About() {
  return (
    <SiteLayout>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <video
          autoPlay muted loop playsInline preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={aboutVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="relative mx-auto flex min-h-[80svh] max-w-6xl items-center px-5 py-24 sm:px-8">
          <div className="max-w-2xl text-white">
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/70">
              <Link to="/" className="transition hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-white">About Us</span>
            </nav>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4" />
              Trusted Family Dental Care
            </div>

            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.15] text-white sm:text-5xl md:text-6xl">
              Compassionate dental care designed around your comfort.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              At {CLINIC.name}, we combine modern dentistry with genuine compassion
              to help individuals and families enjoy healthier smiles with confidence.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/book">Book Appointment</Link>
              </Button>
              <Button
                asChild size="lg" variant="outline"
                className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white hover:text-black"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-sm text-white/75">
              {[
                { icon: ShieldCheck, label: 'Patient-Centred Care' },
                { icon: Clock, label: 'Open 7 Days a Week' },
                { icon: Sparkles, label: 'Modern Equipment' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <SectionLabel>Our Purpose</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">What Guides Us</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Everything we do is centred around delivering exceptional dental
              experiences built on trust, compassion and excellence.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              {
                icon: Sparkles,
                title: 'Our Mission',
                body: 'To provide exceptional, accessible and compassionate dental care that improves the quality of life of every patient we serve.',
              },
              {
                icon: ShieldCheck,
                title: 'Our Vision',
                body: 'To become the most trusted family dental clinic in Surulere through excellence, integrity and continuous innovation.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <Card key={title} className="rounded-3xl border-none shadow-sm">
                <CardContent className="p-8 sm:p-10">
                  <div className="inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl font-bold sm:text-3xl">{title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ── Values ────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="bg-[color:var(--cream)] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="text-center">
              <SectionLabel>What We Stand For</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">The Values We Live By</h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                These principles shape every interaction, treatment plan and decision we make.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Compassion', icon: Users, description: 'We treat every patient with empathy, kindness and genuine care.' },
                { title: 'Excellence', icon: Sparkles, description: 'We strive to deliver the highest standards in dental care.' },
                { title: 'Integrity', icon: ShieldCheck, description: 'We provide honest recommendations and transparent communication.' },
                { title: 'Education', icon: Sparkles, description: 'We empower patients through knowledge and prevention.' },
              ].map((value, i) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <Card className="h-full rounded-3xl border-none shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
                      <CardContent className="p-7 text-center">
                        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-7 w-7" />
                        </div>
                        <h3 className="mt-5 font-serif text-xl font-bold">{value.title}</h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Why Families Choose Us ────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div className="lg:sticky lg:top-24">
              <SectionLabel>Why Choose Us</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl">
                Why Families Choose Odontal
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We understand that visiting the dentist can feel overwhelming.
                That's why we've created an environment focused on comfort, trust
                and exceptional care.
              </p>
              <div className="mt-8">
                <Button asChild className="rounded-full">
                  <Link to="/book">Book Appointment</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                'Gentle treatment tailored to every patient.',
                'Spotless treatment rooms and sterilised equipment.',
                'Clear explanations before every procedure.',
                'Warm and welcoming team members.',
                'Convenient location in Surulere.',
                'Continuous professional development and training.',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{item}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Journey ───────────────────────────────────────────── */}
      <FadeInSection>
        <section className="bg-[color:var(--cream)] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="text-center">
              <SectionLabel>How It Works</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Your Journey With Us</h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                We make every step simple, reassuring and patient-friendly.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: '01', title: 'Book', description: 'Choose a convenient date and request your appointment online.' },
                { step: '02', title: 'Consultation', description: 'Meet our team, discuss your concerns and receive an assessment.' },
                { step: '03', title: 'Treatment', description: 'Receive personalised care using modern techniques.' },
                { step: '04', title: 'Follow-Up', description: "We'll support your long-term oral health journey." },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Card className="h-full rounded-3xl border-none shadow-sm">
                    <CardContent className="p-7 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary font-serif text-lg font-bold text-white">
                        {item.step}
                      </div>
                      <h3 className="mt-5 font-serif text-xl font-bold">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Community ─────────────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="rounded-3xl bg-primary/5 px-7 py-12 text-center sm:px-12 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="mt-6 font-serif text-3xl font-bold sm:text-4xl">Rooted in Community</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Beyond clinical care, we're committed to improving oral health
              awareness across our community through patient education and
              preventive guidance.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              We believe healthier smiles begin with knowledge, and we're proud
              to support individuals and families in making informed decisions
              about their dental health.
            </p>
            <div className="mt-8">
              <Button asChild className="rounded-full">
                <Link to="/book">Join Our Community</Link>
              </Button>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Visit Us ──────────────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <SectionLabel>Find Us</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">Visit Our Clinic</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Conveniently located in the heart of Aguda, Surulere — easily
              accessible for individuals and families across Lagos.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card className="rounded-3xl border-none shadow-sm">
              <CardContent className="p-7 sm:p-10">
                <h3 className="font-serif text-2xl font-bold">Contact Information</h3>

                <div className="mt-7 space-y-6">
                  {[
                    {
                      icon: MapPin,
                      label: 'Address',
                      content: <p className="mt-0.5 text-sm text-muted-foreground">{CLINIC.address}</p>,
                    },
                    {
                      icon: Phone,
                      label: 'Phone',
                      content: (
                        <a
                          href={`tel:${CLINIC.phoneIntl}`}
                          className="mt-0.5 block text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          {CLINIC.phone}
                        </a>
                      ),
                    },
                    {
                      icon: Clock,
                      label: 'Opening Hours',
                      content: (
                        <div className="mt-2 space-y-1.5">
                          {CLINIC.hours.map((hour) => (
                            <div key={hour.day} className="flex justify-between gap-6 text-sm">
                              <span className="text-foreground/80">{hour.day}</span>
                              <span className="text-muted-foreground">{hour.open}</span>
                            </div>
                          ))}
                        </div>
                      ),
                    },
                  ].map(({ icon: Icon, label, content }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{label}</p>
                        {content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="rounded-full">
                    <Link to="/book">Book Appointment</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <a href={CLINIC.mapsUrl} target="_blank" rel="noopener noreferrer">
                      Get Directions
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="overflow-hidden rounded-3xl shadow-sm">
              <iframe
                title="Odontal Dental Clinic Location"
                src={CLINIC.mapsEmbed}
                loading="lazy"
                className="h-[360px] w-full border-0 lg:h-full"
              />
            </div>
          </div>
        </section>
      </FadeInSection>

    </SiteLayout>
  )
}