import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { z } from 'zod'
import {
  CheckCircle2,
  Calendar,
  Clock,
  Phone,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { SiteLayout } from '@/components/site/SiteLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { listServicesPublic, submitBooking } from '@/lib/public.functions'
import { CLINIC, formatNGN } from '@/lib/clinic'
import { toast } from 'sonner'

const searchSchema = z.object({ service: z.string().optional() })

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

export const Route = createFileRoute('/book')({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: 'Book an Appointment — Odontal Dental Clinic' },
      {
        name: 'description',
        content:
          'Request an appointment with Odontal Dental Clinic in Aguda, Lagos. Simple online booking — we confirm by phone.',
      },
    ],
  }),
  component: Book,
})

const TIMES = [
  '8:30 AM',
  '9:30 AM',
  '10:30 AM',
  '11:30 AM',
  '12:30 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
]

function Book() {
  const fetchServices = useServerFn(listServicesPublic)
  const submit = useServerFn(submitBooking)
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => fetchServices(),
  })
  const search = Route.useSearch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    service_id: search.service ?? '',
    patient_name: '',
    phone: '',
    email: '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const selected = services.find((s) => s.id === form.service_id)
  const today = new Date().toISOString().slice(0, 10)

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await submit({ data: form })
      setDone(true)
      toast.success('Appointment request received!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not submit')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-2xl px-4 py-24">
          <Card className="rounded-[32px] text-center shadow-lg">
            <CardContent className="p-10 md:p-14">
              <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />

              <h1 className="mt-6 font-serif text-4xl font-bold">
                Request Received
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                Thank you for choosing Odontal Dental Clinic. We've received
                your booking request and our team will contact you shortly to
                confirm your appointment.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  className="rounded-full"
                  onClick={() =>
                    navigate({
                      to: '/',
                    })
                  }
                >
                  Back to Home
                </Button>

                <Button asChild variant="outline" className="rounded-full">
                  <a href={`tel:${CLINIC.phoneIntl}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Clinic
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <FadeInSection>
        <section className="border-b bg-[color:var(--cream)]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Link to="/" className="transition-colors hover:text-primary">
                Home
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span className="font-medium text-foreground">
                Book Appointment
              </span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
                Book Your Appointment
              </h1>

              <p className="mt-5 text-lg text-muted-foreground">
                Scheduling your visit takes less than two minutes. Submit your
                request online, and our team will contact you to confirm a time
                that works best for you.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />

                  <span>No Online Payment Required</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />

                  <span>Confirmation by Phone</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />

                  <span>Open 7 Days a Week</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            {/* FORM COLUMN */}
            <div>
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-4">
                  {[
                    'Appointment Details',
                    'Personal Information',
                    'Additional Notes',
                  ].map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                        {index + 1}
                      </div>

                      <span className="text-sm font-medium">{step}</span>

                      {index < 2 && (
                        <div className="hidden h-px w-10 bg-border sm:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Card className="rounded-[32px] shadow-sm">
                <CardContent className="p-6 md:p-8">
                  <form onSubmit={onSubmit} className="space-y-8">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">
                        Appointment Details
                      </h2>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Tell us the type of care you need and when you'd prefer
                        to visit.
                      </p>
                    </div>
                    <div>
                      <Label>Service</Label>

                      <Select
                        value={form.service_id}
                        onValueChange={(value) => update('service_id', value)}
                      >
                        <SelectTrigger className="mt-2 h-12 rounded-xl">
                          <SelectValue placeholder="Choose a service" />
                        </SelectTrigger>

                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name}
                              {' • '}
                              {formatNGN(service.price_ngn)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selected && (
                        <div className="mt-4 rounded-2xl border bg-muted/40 p-4">
                          <h3 className="font-medium">{selected.name}</h3>

                          <p className="mt-2 text-sm text-muted-foreground">
                            {selected.description}
                          </p>

                          <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="font-semibold text-primary">
                              {formatNGN(selected.price_ngn)}
                            </span>

                            <span className="text-muted-foreground">
                              {selected.duration_min}
                              {' mins'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <Label>Preferred Date</Label>

                        <div className="relative mt-2">
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                          <Input
                            type="date"
                            min={today}
                            required
                            value={form.preferred_date}
                            onChange={(e) =>
                              update('preferred_date', e.target.value)
                            }
                            className="h-12 rounded-xl pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Preferred Time</Label>

                        <Select
                          value={form.preferred_time}
                          onValueChange={(value) =>
                            update('preferred_time', value)
                          }
                        >
                          <SelectTrigger className="mt-2 h-12 rounded-xl">
                            <SelectValue placeholder="Choose a time" />
                          </SelectTrigger>

                          <SelectContent>
                            {TIMES.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                      Need urgent care?
                      <a
                        href={`tel:${CLINIC.phoneIntl}`}
                        className="ml-1 font-medium text-primary underline"
                      >
                        Call us immediately
                      </a>{' '}
                      for emergency appointments.
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold">
                        Personal Information
                      </h2>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Help us identify and contact you.
                      </p>
                    </div>
                    <div>
                      <Label>Full Name</Label>

                      <Input
                        required
                        minLength={2}
                        value={form.patient_name}
                        onChange={(e) => update('patient_name', e.target.value)}
                        className="mt-2 h-12 rounded-xl"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <Label>Phone Number</Label>

                        <Input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          className="mt-2 h-12 rounded-xl"
                          placeholder="080..."
                        />
                      </div>

                      <div>
                        <Label>
                          Email Address
                          <span className="ml-1 text-muted-foreground">
                            (optional)
                          </span>
                        </Label>

                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => update('email', e.target.value)}
                          className="mt-2 h-12 rounded-xl"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold">
                        Additional Notes
                      </h2>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Share anything that will help us prepare for your visit.
                      </p>

                      <Textarea
                        rows={4}
                        value={form.notes}
                        onChange={(e) => update('notes', e.target.value)}
                        className="mt-4 rounded-xl"
                        placeholder="Any symptoms, concerns, allergies, or additional information..."
                      />
                    </div>
                    <div className="border-t pt-6">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={
                          loading ||
                          !form.service_id ||
                          !form.preferred_date ||
                          !form.preferred_time
                        }
                        className="w-full rounded-full"
                      >
                        {loading ? 'Submitting...' : 'Request Appointment'}
                      </Button>

                      <p className="mt-4 text-center text-xs text-muted-foreground">
                        By submitting this form, you agree to be contacted
                        regarding your appointment. No payment is taken online.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </FadeInSection>
    </SiteLayout>
  )
}