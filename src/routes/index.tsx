import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import {
  Accordion, AccordionContent,
  AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Star, ShieldCheck, Clock, MapPin, Phone,
  ArrowRight, AlertCircle, Award, Users, CalendarDays,
} from 'lucide-react'
import { SiteLayout } from '@/components/site/SiteLayout'
import { buildHead } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { listServicesPublic, getDailyRandomReviews } from '@/lib/public.functions'
import { CLINIC, formatNGN } from '@/lib/clinic'
import introVideo from '@/assets/odontal-introduct.mp4'
import odontalDoctor from '@/assets/odontal-doctor.png'
import result from '@/assets/result.jpg'

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

function StatCard({ icon, value, label }: {
  icon: React.ReactNode; value: string; label: string
}) {
  return (
    <Card className="rounded-3xl border-white/10 bg-white/20 backdrop-blur-md">
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="mb-3 text-primary">{icon}</div>
        <div className="font-serif text-3xl font-bold text-black">{value}</div>
        <p className="mt-1.5 text-sm text-primary/75">{label}</p>
      </CardContent>
    </Card>
  )
}

function DailyReviews() {
  const fetchDaily = useServerFn(getDailyRandomReviews)
  const { data: reviews = [] } = useQuery({
    queryKey: ['dailyReviews'],
    queryFn: () => fetchDaily(),
  })

  if (!reviews.length) return (
    <p className="mt-6 text-center text-sm text-muted-foreground">No reviews yet.</p>
  )

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r: any) => (
        <Card key={r.id} className="rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < (r.rating ?? 0) ? 'fill-current' : 'opacity-25'}`} />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">"{r.body}"</p>
            <p className="mt-4 text-sm font-semibold">— {r.reviewer_name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const Route = createFileRoute('/')({
  head: () =>
    buildHead({
      title: 'Odontal Dental Clinic — Trusted Dentist in Aguda, Surulere, Lagos',
      description: 'Modern dental clinic in Aguda, Lagos. Checkups, cleaning, fillings, whitening and more. Book your appointment with Odontal Dental Clinic today.',
      path: '/',
    }),
  component: Home,
})

function Home() {
  const fetchServices = useServerFn(listServicesPublic)
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => fetchServices(),
  })

  return (
    <SiteLayout>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <video
          autoPlay muted loop playsInline preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={introVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[95svh] max-w-7xl items-center px-5 py-24 sm:px-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-md"
            >
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              Trusted by families across Surulere
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-5 font-serif text-4xl font-bold leading-[1.15] text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Trusted Dental Care<br />
              for the Whole Family.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
            >
              From routine checkups and professional cleaning to cosmetic
              dentistry and restorative treatments — compassionate,
              patient-centred care designed to keep your smile healthy and
              confident.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/book">
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild size="lg" variant="outline"
                className="rounded-full border-white/40 bg-white/10 px-8 text-white backdrop-blur-md hover:bg-white/20"
              >
                <a href={`tel:${CLINIC.phoneIntl}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call {CLINIC.phone}
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 grid grid-cols-2 gap-3"
            >
              {[
                'Licensed Dental Professionals',
                'Modern Equipment',
                'Open 7 Days a Week',
                'Patient-Centred Care',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-white/90">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="relative z-20 mx-auto -mt-14 max-w-5xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={<Award className="h-7 w-7" />} value="5+" label="Years of Experience" />
            <StatCard icon={<Users className="h-7 w-7" />} value="1,000+" label="Patients Treated" />
            <StatCard icon={<Star className="h-7 w-7" />} value="98%" label="Patient Satisfaction" />
            <StatCard icon={<CalendarDays className="h-7 w-7" />} value="7 Days" label="Open Every Week" />
          </div>
        </section>
      </FadeInSection>

      {/* ── Emergency banner ──────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="rounded-3xl bg-red-50 p-7 sm:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Dental Emergency?</span>
                </div>
                <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                  Immediate Help When You Need It Most
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Experiencing severe tooth pain, swelling, a broken tooth, or a
                  dental injury? Contact our team immediately for urgent care and guidance.
                </p>
              </div>
              <Button asChild size="lg" className="shrink-0 rounded-full">
                <a href={`tel:${CLINIC.phoneIntl}`}>Call Emergency Line</a>
              </Button>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Services ──────────────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <SectionLabel>Our Services</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                Comprehensive Dental Care Under One Roof
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Whether you need preventive care, cosmetic enhancements, or
                restorative treatment, we provide modern solutions tailored to your needs.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 rounded-full">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -6 }}
              >
                <Card className="h-full rounded-3xl border-border/50 transition-shadow hover:shadow-lg">
                  <CardContent className="flex h-full flex-col p-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-semibold">{service.name}</h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="font-bold text-primary">{formatNGN(service.price_ngn)}</span>
                      <span className="text-xs text-muted-foreground">{service.duration_min} mins</span>
                    </div>
                    <Button asChild variant="ghost" className="mt-4 w-fit px-0 text-sm">
                      <Link to="/book">
                        Book Treatment
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ── Team ──────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="bg-[color:var(--cream)] py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="overflow-hidden rounded-3xl">
              <img
                src={odontalDoctor}
                alt="Odontal Dental Team"
                className="w-full object-cover shadow-lg"
                loading="lazy"
              />
            </div>
            <div>
              <SectionLabel>Meet Our Team</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                Compassionate Care from Experienced Professionals
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                At Odontal Dental Clinic, we understand that visiting the dentist
                can feel overwhelming. That's why our team focuses on clear
                communication, gentle treatment, and creating a comfortable
                experience for every patient.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                From children attending their first appointment to adults seeking
                advanced restorative treatments, we are committed to helping every
                patient achieve a healthy, confident smile.
              </p>
              <div className="mt-8">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/book">Schedule a Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Why Choose Us ─────────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <SectionLabel>Why Choose Us</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
              Dentistry Designed Around You
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              We combine modern technology with a warm, patient-first approach
              to deliver dental care you can trust.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Modern Technology', desc: 'Advanced equipment for accurate diagnosis and treatment.' },
              { title: 'Experienced Team', desc: 'Skilled professionals committed to excellent patient outcomes.' },
              { title: 'Comfort Focused', desc: 'A welcoming environment designed to reduce anxiety.' },
              { title: 'Convenient Access', desc: 'Easy to reach from anywhere in Surulere.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="h-full rounded-3xl">
                  <CardContent className="p-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ── How It Works ──────────────────────────────────────── */}
      <FadeInSection>
        <section className="bg-muted/40 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="text-center">
              <SectionLabel>How It Works</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
                Your Journey to a Healthier Smile
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                Getting started is simple and stress-free.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: '01', title: 'Book Appointment', desc: 'Choose a convenient time online or by phone.' },
                { step: '02', title: 'Dental Assessment', desc: 'Receive a comprehensive examination and consultation.' },
                { step: '03', title: 'Treatment Plan', desc: 'Understand your options with transparent recommendations.' },
                { step: '04', title: 'Smile Confidently', desc: 'Enjoy healthier teeth and improved confidence.' },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Card className="h-full rounded-3xl text-center">
                    <CardContent className="p-7">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary font-serif text-lg font-bold text-white">
                        {item.step}
                      </div>
                      <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Reviews ───────────────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="text-center">
            <SectionLabel>Patient Reviews</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
              Loved by Our Patients
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Our greatest reward is seeing our patients smile with confidence.
              Here's what some of them have to say.
            </p>
            <div className="mt-4 flex justify-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
          </div>

          <DailyReviews />

          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/reviews">View All Reviews</Link>
            </Button>
          </div>
        </section>
      </FadeInSection>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="bg-[color:var(--cream)] py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="text-center">
              <SectionLabel>Frequently Asked Questions</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
                Answers to Common Questions
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                Everything you need to know before your visit.
              </p>
            </div>

            <Accordion type="single" collapsible className="mt-10 space-y-3">
              {[
                {
                  value: 'item-1',
                  q: 'How much does a dental checkup cost?',
                  a: 'The cost depends on the treatment required. Contact us directly or book an appointment for a personalised consultation.',
                },
                {
                  value: 'item-2',
                  q: 'Do you treat children?',
                  a: 'Yes. We provide dental care for children, teenagers, adults, and seniors.',
                },
                {
                  value: 'item-3',
                  q: 'Do you offer teeth whitening?',
                  a: 'Absolutely. We provide safe and effective professional whitening treatments.',
                },
                {
                  value: 'item-4',
                  q: 'Can I book online?',
                  a: 'Yes. You can schedule your appointment directly through our website.',
                },
                {
                  value: 'item-5',
                  q: 'What should I do during a dental emergency?',
                  a: 'Call us immediately using our emergency contact number so we can advise you and arrange urgent care.',
                },
              ].map((item) => (
                <AccordionItem
                  key={item.value}
                  value={item.value}
                  className="rounded-2xl border bg-background px-6"
                >
                  <AccordionTrigger className="text-left text-base font-medium">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </FadeInSection>

      {/* ── Location ──────────────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-8 rounded-3xl bg-muted p-7 sm:p-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <SectionLabel>Visit Us</SectionLabel>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl">
                Conveniently Located in Surulere
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We are located in the heart of Aguda, making quality dental care
                accessible to individuals and families throughout Surulere and
                surrounding communities.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{CLINIC.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a
                      href={`tel:${CLINIC.phoneIntl}`}
                      className="mt-0.5 block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {CLINIC.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Opening Hours</p>
                    <div className="mt-1.5 space-y-1 text-sm text-muted-foreground">
                      {CLINIC.hours.map((hour) => (
                        <div key={hour.day} className="flex justify-between gap-6">
                          <span>{hour.day}</span>
                          <span>{hour.open}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
            </div>

            <div className="overflow-hidden rounded-2xl">
              <iframe
                title="Odontal Dental Clinic Location"
                src={CLINIC.mapsEmbed}
                className="h-[360px] w-full border-0 lg:h-full"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Result image ──────────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={result}
              alt="Before and after dental treatment at Odontal"
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        </section>
      </FadeInSection>

    </SiteLayout>
  )
}