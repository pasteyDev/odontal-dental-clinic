import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  AlertCircle,
  Award,
  Users,
  CalendarDays,
} from 'lucide-react'
import { SiteLayout } from '@/components/site/SiteLayout'
import { buildHead } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  listServicesPublic,
  getDailyRandomReviews,
} from '@/lib/public.functions'
import { CLINIC, formatNGN } from '@/lib/clinic'
import introVideo from '@/assets/odontal-introduct.mp4'
import odontalDoctor from '@/assets/odontal-doctor.png'
import result from '@/assets/result.jpg'

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

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <Card className="rounded-3xl border-white/10 bg-white/20 backdrop-blur-md">
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="mb-3 text-primary">{icon}</div>

        <div className="text-3xl font-bold text-grey-500">{value}</div>

        <p className="mt-2 text-sm text-primary/80">{label}</p>
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

  if (!reviews.length) {
    return (
      <p className="mt-6 text-center text-sm text-muted-foreground">
        No reviews yet.
      </p>
    )
  }

  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r: any) => (
        <Card
          key={r.id}
          className="rounded-3xl transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < (r.rating ?? 0) ? 'fill-current' : ''
                  }`}
                />
              ))}
            </div>

            <p className="mt-4 text-sm leading-relaxed">"{r.body}"</p>

            <p className="mt-4 font-medium">— {r.reviewer_name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const Route = createFileRoute('/')({
  head: () =>
    buildHead({
      title:
        'Odontal Dental Clinic — Trusted Dentist in Aguda, Surulere, Lagos',
      description:
        'Modern dental clinic in Aguda, Lagos. Checkups, cleaning, fillings, whitening and more. Book your appointment with Odontal Dental Clinic today.',
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
      <section className="relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={introVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-center px-4 py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md"
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              Trusted by families across Surulere
            </motion.div>
            <motion.h1
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
              }}
              className="mt-6 font-serif text-5xl font-bold leading-tight text-white md:text-7xl"
            >
              Trusted Dental Care
              <br />
              for the Whole Family.
            </motion.h1>
            <motion.p
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.8,
              }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
            >
              From routine checkups and professional cleaning to cosmetic
              dentistry and restorative treatments, our experienced team
              delivers compassionate, patient-centred care designed to keep your
              smile healthy and confident.
            </motion.p>
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/book">
                  Book Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white bg-white/10 px-8 text-white backdrop-blur-md hover:bg-white/20"
              >
                <a href={`tel:${CLINIC.phoneIntl}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call {CLINIC.phone}
                </a>
              </Button>
            </motion.div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {[
                'Licensed Dental Professionals',
                'Modern Equipment',
                'Open 7 Days a Week',
                'Patient-Centred Care',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-white/90"
                >
                  <ShieldCheck className="h-5 w-5 text-primary" />

                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FadeInSection>
        <section className="-mt-16 relative z-20 mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<Award className="h-8 w-8" />}
              value="10+"
              label="Years of Experience"
            />

            <StatCard
              icon={<Users className="h-8 w-8" />}
              value="5,000+"
              label="Patients Treated"
            />

            <StatCard
              icon={<Star className="h-8 w-8" />}
              value="98%"
              label="Patient Satisfaction"
            />

            <StatCard
              icon={<CalendarDays className="h-8 w-8" />}
              value="7 Days"
              label="Open Every Week"
            />
          </div>
        </section>
      </FadeInSection>
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="rounded-[32px] bg-red-50 p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle className="h-6 w-6" />

                  <span className="font-semibold">Dental Emergency?</span>
                </div>

                <h2 className="mt-4 font-serif text-3xl font-bold">
                  Immediate Help When You Need It Most
                </h2>

                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Experiencing severe tooth pain, swelling, a broken tooth, or a
                  dental injury? Contact our team immediately for urgent care
                  and guidance.
                </p>
              </div>

              <Button asChild size="lg" className="rounded-full">
                <a href={`tel:${CLINIC.phoneIntl}`}>Call Emergency Line</a>
              </Button>
            </div>
          </div>
        </section>
      </FadeInSection>
      {/* SERVICES SECTION */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Our Services
              </span>

              <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
                Comprehensive Dental Care Under One Roof
              </h2>

              <p className="mt-4 max-w-2xl text-muted-foreground">
                Whether you need preventive care, cosmetic enhancements, or
                restorative treatment, we provide modern solutions tailored to
                your needs.
              </p>
            </div>

            <Button asChild variant="outline" className="rounded-full">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <motion.div
                key={service.id}
                whileHover={{
                  y: -8,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <Card className="h-full rounded-3xl border-border/60 transition-shadow hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <ShieldCheck className="h-7 w-7 text-primary" />
                    </div>

                    <h3 className="mt-6 font-serif text-2xl font-semibold">
                      {service.name}
                    </h3>

                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {formatNGN(service.price_ngn)}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {service.duration_min} mins
                      </span>
                    </div>

                    <Button asChild variant="ghost" className="mt-6 px-0">
                      <Link to="/book">
                        Book Treatment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="bg-[color:var(--cream)] py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2 lg:items-center">
            <div>
              <img
                src={odontalDoctor}
                alt="Odontal Dental Team"
                className="rounded-[32px] shadow-xl"
                loading="lazy"
              />
            </div>

            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Meet Our Team
              </span>

              <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
                Compassionate Care from Experienced Professionals
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                At Odontal Dental Clinic, we understand that visiting the
                dentist can feel overwhelming. That's why our team focuses on
                clear communication, gentle treatment, and creating a
                comfortable experience for every patient.
              </p>

              <p className="mt-4 text-muted-foreground">
                From children attending their first dental appointment to adults
                seeking advanced restorative treatments, we are committed to
                helping every patient achieve a healthy, confident smile.
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

      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Why Choose Us
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
              Dentistry Designed Around You
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We combine modern technology with a warm, patient-first approach
              to deliver dental care you can trust.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Modern Technology',
                desc: 'Advanced odontal-doctor png equipment for accurate diagnosis and treatment.',
              },
              {
                title: 'Experienced Team',
                desc: 'Skilled professionals committed to excellent patient outcomes.',
              },
              {
                title: 'Comfort Focused',
                desc: 'A welcoming environment designed to reduce anxiety.',
              },
              {
                title: 'Convenient Access',
                desc: 'Easy to reach from anywhere in Surulere.',
              },
            ].map((feature) => (
              <Card key={feature.title} className="rounded-3xl">
                <CardContent className="p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <ShieldCheck className="h-7 w-7 text-primary" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="bg-muted/40 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                How It Works
              </span>

              <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
                Your Journey to a Healthier Smile
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Getting started is simple and stress-free.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: '01',
                  title: 'Book Appointment',
                  desc: 'Choose a convenient time online or by phone.',
                },
                {
                  step: '02',
                  title: 'Dental Assessment',
                  desc: 'Receive a comprehensive examination and consultation.',
                },
                {
                  step: '03',
                  title: 'Treatment Plan',
                  desc: 'Understand your options with transparent recommendations.',
                },
                {
                  step: '04',
                  title: 'Smile Confidently',
                  desc: 'Enjoy healthier teeth and improved confidence.',
                },
              ].map((item) => (
                <Card key={item.step} className="rounded-3xl text-center">
                  <CardContent className="p-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                      {item.step}
                    </div>

                    <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>

                    <p className="mt-3 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* REVIEWS SECTION */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Patient Reviews
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
              Loved by Our Patients
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Our greatest reward is seeing our patients smile with confidence.
              Here's what some of them have to say about their experience at
              Odontal Dental Clinic.
            </p>

            <div className="mt-4 flex justify-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-5 w-5 fill-current" />
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

      <FadeInSection>
        <section className="bg-[color:var(--cream)] py-20">
          <div className="mx-auto max-w-4xl px-4">
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Frequently Asked Questions
              </span>

              <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
                Answers to Common Questions
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Everything you need to know before your visit.
              </p>
            </div>

            <Accordion type="single" collapsible className="mt-12 space-y-4">
              <AccordionItem
                value="item-1"
                className="rounded-2xl border bg-background px-6"
              >
                <AccordionTrigger>
                  How much does a dental checkup cost?
                </AccordionTrigger>

                <AccordionContent>
                  The cost depends on the treatment required. Contact us
                  directly or book an appointment for a personalised
                  consultation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="rounded-2xl border bg-background px-6"
              >
                <AccordionTrigger>Do you treat children?</AccordionTrigger>

                <AccordionContent>
                  Yes. We provide dental care for children, teenagers, adults,
                  and seniors.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="rounded-2xl border bg-background px-6"
              >
                <AccordionTrigger>
                  Do you offer teeth whitening?
                </AccordionTrigger>

                <AccordionContent>
                  Absolutely. We provide safe and effective professional
                  whitening treatments.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="rounded-2xl border bg-background px-6"
              >
                <AccordionTrigger>Can I book online?</AccordionTrigger>

                <AccordionContent>
                  Yes. You can schedule your appointment directly through our
                  website.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="rounded-2xl border bg-background px-6"
              >
                <AccordionTrigger>
                  What should I do during a dental emergency?
                </AccordionTrigger>

                <AccordionContent>
                  Call us immediately using our emergency contact number so we
                  can advise you and arrange urgent care.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-8 rounded-[32px] bg-muted p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Visit Us
              </span>

              <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
                Conveniently Located in Surulere
              </h2>

              <p className="mt-6 text-muted-foreground">
                We are located in the heart of Aguda, making quality dental care
                accessible to individuals and families throughout Surulere and
                surrounding communities.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 text-primary" />

                  <div>
                    <p className="font-semibold">Address</p>

                    <p className="text-muted-foreground">{CLINIC.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="mt-1 h-5 w-5 text-primary" />

                  <div>
                    <p className="font-semibold">Phone</p>

                    <a
                      href={`tel:${CLINIC.phoneIntl}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {CLINIC.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="mt-1 h-5 w-5 text-primary" />

                  <div>
                    <p className="font-semibold">Opening Hours</p>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      {CLINIC.hours.map((hour) => (
                        <div
                          key={hour.day}
                          className="flex justify-between gap-4"
                        >
                          <span>{hour.day}</span>

                          <span>{hour.open}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button asChild className="rounded-full">
                  <Link to="/book">Book Appointment</Link>
                </Button>

                <Button asChild variant="outline" className="rounded-full">
                  <a
                    href={CLINIC.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl">
              <iframe
                title="Odontal Dental Clinic Location"
                src={CLINIC.mapsEmbed}
                className="h-[400px] w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4">
            <img src={result} alt="A before and after at Odontal" />
          </div>
        </section>
      </FadeInSection>
    </SiteLayout>
  )
}
