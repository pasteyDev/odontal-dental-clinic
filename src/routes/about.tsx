import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Sparkles,
  ShieldCheck,
  Users,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
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
      <section className="relative overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={aboutVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Content */}
        <div className="relative mx-auto flex min-h-[75vh] max-w-6xl items-center px-4 py-24">
          <div className="max-w-3xl text-white">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-8 mt-[-4] flex items-center gap-2 text-sm text-white/80"
            >
              <Link to="/" className="transition hover:text-white">
                Home
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span className="font-medium text-white">About Us</span>
            </nav>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4" />
              Trusted Family Dental Care
            </div>

            <h1 className="mt-6 font-serif text-5xl font-bold leading-tight md:text-7xl">
              Compassionate dental care designed around your comfort.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              At {CLINIC.name}, we combine modern dentistry with genuine
              compassion to help individuals and families enjoy healthier smiles
              with confidence.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/book">Book Appointment</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white bg-white/10 text-white hover:bg-white hover:text-black"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Patient-Centred Care
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Open 7 Days a Week
              </div>

              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Modern Equipment
              </div>
            </div>
          </div>
        </div>
      </section>

      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-bold">What Guides Us</h2>

            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Everything we do is centred around delivering exceptional dental
              experiences built on trust, compassion and excellence.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Mission */}
            <Card className="rounded-[32px] border-none shadow-sm">
              <CardContent className="p-8 md:p-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-7 w-7" />
                </div>

                <h3 className="mt-6 font-serif text-3xl font-bold">
                  Our Mission
                </h3>

                <p className="mt-4 leading-relaxed text-muted-foreground">
                  To provide exceptional, accessible and compassionate dental
                  care that improves the quality of life of every patient we
                  serve.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="rounded-[32px] border-none shadow-sm">
              <CardContent className="p-8 md:p-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-7 w-7" />
                </div>

                <h3 className="mt-6 font-serif text-3xl font-bold">
                  Our Vision
                </h3>

                <p className="mt-4 leading-relaxed text-muted-foreground">
                  To become the most trusted family dental clinic in Surulere
                  through excellence, integrity and continuous innovation.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="bg-[color:var(--cream)] py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="font-serif text-4xl font-bold">
                The Values We Live By
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                These principles shape every interaction, treatment plan and
                decision we make.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Compassion',
                  icon: Users,
                  description:
                    'We treat every patient with empathy, kindness and genuine care.',
                },
                {
                  title: 'Excellence',
                  icon: Sparkles,
                  description:
                    'We strive to deliver the highest standards in dental care.',
                },
                {
                  title: 'Integrity',
                  icon: ShieldCheck,
                  description:
                    'We provide honest recommendations and transparent communication.',
                },
                {
                  title: 'Education',
                  icon: Sparkles,
                  description:
                    'We empower patients through knowledge and prevention.',
                },
              ].map((value) => {
                const Icon = value.icon

                return (
                  <Card
                    key={value.title}
                    className="rounded-[32px] border-none shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                  >
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-8 w-8" />
                      </div>

                      <h3 className="mt-6 font-serif text-2xl font-bold">
                        {value.title}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold">
                Why Families Choose Odontal
              </h2>

              <p className="mt-5 text-lg text-muted-foreground">
                We understand that visiting the dentist can feel overwhelming.
                That's why we've created an environment focused on comfort,
                trust and exceptional care.
              </p>
            </div>

            <div className="grid gap-5">
              {[
                'Gentle treatment tailored to every patient.',
                'Spotless treatment rooms and sterilised equipment.',
                'Clear explanations before every procedure.',
                'Warm and welcoming team members.',
                'Convenient location in Surulere.',
                'Continuous professional development and training.',
              ].map((item) => (
                <Card key={item} className="rounded-3xl shadow-sm">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ShieldCheck className="h-6 w-6" />
                    </div>

                    <p className="font-medium leading-relaxed">{item}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="bg-[color:var(--cream)] py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="font-serif text-4xl font-bold">
                Your Journey With Us
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                We make every step simple, reassuring and patient-friendly.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-4">
              {[
                {
                  step: '01',
                  title: 'Book',
                  description:
                    'Choose a convenient date and request your appointment online.',
                },
                {
                  step: '02',
                  title: 'Consultation',
                  description:
                    'Meet our team, discuss your concerns and receive an assessment.',
                },
                {
                  step: '03',
                  title: 'Treatment',
                  description:
                    'Receive personalised care using modern techniques.',
                },
                {
                  step: '04',
                  title: 'Follow-Up',
                  description:
                    "We'll support your long-term oral health journey.",
                },
              ].map((item) => (
                <Card
                  key={item.step}
                  className="rounded-[32px] border-none shadow-sm"
                >
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                      {item.step}
                    </div>

                    <h3 className="mt-6 font-serif text-2xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="mx-auto max-w-5xl px-4 py-20 text-center">
          <div className="rounded-[40px] bg-primary/5 px-8 py-14">
            <Users className="mx-auto h-14 w-14 text-primary" />

            <h2 className="mt-6 font-serif text-4xl font-bold">
              Rooted in Community
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Beyond clinical care, we're committed to improving oral health
              awareness across our community through patient education and
              preventive guidance.
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
              We believe healthier smiles begin with knowledge, and we're proud
              to support individuals and families in making informed decisions
              about their dental health.
            </p>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="text-center">
            <h2 className="font-serif text-4xl font-bold">Visit Our Clinic</h2>

            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Conveniently located in the heart of Aguda, Surulere, we're easily
              accessible for individuals and families across Lagos.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Clinic Information */}
            <Card className="rounded-[32px] border-none shadow-sm">
              <CardContent className="p-8">
                <h3 className="font-serif text-3xl font-bold">
                  Contact Information
                </h3>

                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="font-semibold">Address</p>

                      <p className="mt-1 text-muted-foreground">
                        {CLINIC.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Phone className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="font-semibold">Phone</p>

                      <a
                        href={`tel:${CLINIC.phoneIntl}`}
                        className="mt-1 block text-muted-foreground hover:text-primary"
                      >
                        {CLINIC.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Clock className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="font-semibold">Opening Hours</p>

                      <div className="mt-3 space-y-2">
                        {CLINIC.hours.map((hour) => (
                          <div
                            key={hour.day}
                            className="flex justify-between gap-6 text-sm"
                          >
                            <span className="text-foreground/80">
                              {hour.day}
                            </span>

                            <span className="text-muted-foreground">
                              {hour.open}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
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
              </CardContent>
            </Card>

            {/* Map */}
            <div className="overflow-hidden rounded-[32px] shadow-sm">
              <iframe
                title="Odontal Dental Clinic Location"
                src={CLINIC.mapsEmbed}
                loading="lazy"
                className="h-full min-h-[500px] w-full border-0"
              />
            </div>
          </div>
        </section>
      </FadeInSection>

    </SiteLayout>
  )
}

// <section className="mx-auto max-w-6xl px-4 py-16">
//   <div className="grid gap-10 md:grid-cols-2 md:items-center">
//     <div>
//       <h1 className="font-serif text-4xl font-semibold md:text-5xl">About {CLINIC.name}</h1>
//       <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
//         {CLINIC.name} is a modern dental practice in Aguda, Lagos offering thoughtful,
//         patient-centred oral care for individuals and families across Surulere and wider
//         Lagos. We combine clinical expertise with a calm, hygienic environment so patients of
//         all ages can receive treatment with confidence.
//       </p>

//       <div className="mt-6 flex flex-wrap gap-3">
//         <Button asChild size="lg" className="rounded-full">
//           <Link to="/book">Book appointment</Link>
//         </Button>
//         <Button asChild size="lg" variant="outline" className="rounded-full">
//           <Link to="/contact">Contact us</Link>
//         </Button>
//       </div>
//     </div>

//     <div>
//       <video
//         autoPlay
//         muted
//         loop
//         playsInline
//         preload="metadata"
//         className="w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
//       >
//         <source src={aboutVideo} type="video/mp4" />
//       </video>
//     </div>
//   </div>

//   <div className="mt-12 grid gap-6 md:grid-cols-3">
//     <Card className="rounded-2xl">
//       <CardContent className="p-6 text-center">
//         <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--blush)] text-primary mx-auto">
//           <Sparkles className="h-6 w-6" />
//         </div>
//         <h3 className="mt-4 font-serif text-lg font-semibold">Care built around you</h3>
//         <p className="mt-2 text-sm text-muted-foreground">
//           Clear communication, gentle treatment and personalised plans to suit every patient.
//         </p>
//       </CardContent>
//     </Card>

//     <Card className="rounded-2xl">
//       <CardContent className="p-6 text-center">
//         <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--blush)] text-primary mx-auto">
//           <ShieldCheck className="h-6 w-6" />
//         </div>
//         <h3 className="mt-4 font-serif text-lg font-semibold">Prevention first</h3>
//         <p className="mt-2 text-sm text-muted-foreground">
//           Emphasis on early detection, prevention and patient education to avoid emergencies.
//         </p>
//       </CardContent>
//     </Card>

//     <Card className="rounded-2xl">
//       <CardContent className="p-6 text-center">
//         <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--blush)] text-primary mx-auto">
//           <Users className="h-6 w-6" />
//         </div>
//         <h3 className="mt-4 font-serif text-lg font-semibold">
//           A calm, hygienic environment
//         </h3>
//         <p className="mt-2 text-sm text-muted-foreground">
//           Spotless treatment rooms, strict sterilisation and a welcoming team to ease anxiety.
//         </p>
//       </CardContent>
//     </Card>
//   </div>

//   <div className="mt-10 prose prose-neutral max-w-none text-foreground/90">
//     <div className="mb-6">
//       <h2 className="font-serif text-2xl font-semibold">A patient-first approach</h2>
//       <p>
//         From the moment you step into our clinic at 21 Agbebi Street, you meet a welcoming
//         team focused on your comfort and understanding. We take time to explain diagnoses,
//         options and expected outcomes so you can make informed choices about your care.
//       </p>
//     </div>
//     <div className="mb-6">
//       <h2 className="font-serif text-2xl font-semibold">Infection control and equipment</h2>
//       <p>
//         We adhere to professional infection control standards. Instruments are sterilised
//         using validated procedures and our treatment rooms are regularly cleaned. We invest in
//         modern dental equipment to provide effective, minimally-invasive care.
//       </p>
//     </div>
//     <div className="mb-6">
//       <h2 className="font-serif text-2xl font-semibold">Community and training</h2>
//       <p>
//         We are part of the local community and support oral health education initiatives. Our
//         clinicians undertake regular professional development to stay current with best
//         practice.
//       </p>
//     </div>
//     <div>
//       <h2 className="font-serif text-2xl font-semibold">Accessibility</h2>
//       <p>
//         If you have accessibility needs, language preferences or specific concerns, please
//         contact us before your visit so we can make appropriate arrangements.
//       </p>
//     </div>
//   </div>
// </section>
