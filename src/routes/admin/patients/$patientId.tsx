import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getPatientDetail } from '@/lib/admin.functions'
import { EmailDialog } from '@/components/admin/EmailDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Phone,
  Mail,
  CalendarDays,
  Clock,
  Activity,
  ChevronRight,
  ArrowLeft,
  Stethoscope,
  Banknote,
} from 'lucide-react'
import { formatNGN } from '@/lib/clinic'

export const Route = createFileRoute('/admin/patients/$patientId')({
  component: PatientDetail,
})

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  no_show: 'bg-muted text-muted-foreground border-border',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground border-border'}`}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

function PatientDetail() {
  const { patientId } = Route.useParams()
  const fn = useServerFn(getPatientDetail)
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => fn({ data: { id: patientId } }),
  })

  const patient = data?.patient
  const bookings = data?.bookings ?? []

  const completedVisits = bookings.filter((b) => b.status === 'completed')
  const totalSpend = completedVisits.reduce(
    (sum, b) => sum + ((b as any).services?.price_ngn ?? b.price_ngn ?? 0),
    0,
  )
  const lastVisit = completedVisits[0]?.preferred_date ?? null

  // ── Loading skeleton ───────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl font-semibold">Patient not found</p>
        <Button
          variant="outline"
          className="mt-6 rounded-full"
          onClick={() => navigate({ to: '/admin/patients' })}
        >
          Back to patients
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              to="/admin/patients"
              className="transition hover:text-foreground"
            >
              Patients
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">{patient.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-lg font-semibold text-foreground">
              {patient.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="font-serif text-3xl font-semibold">
                {patient.name}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Patient since{' '}
                {new Date(patient.first_seen).toLocaleDateString('en-NG', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <EmailDialog
            toEmail={patient.email}
            toName={patient.name}
            initialSubject="A note from Odontal Dental Clinic"
            initialBody={`Hello ${patient.name},\n\nThank you for choosing Odontal Dental Clinic.\n\nOdontal Dental Clinic`}
          />
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => navigate({ to: '/admin/patients' })}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Activity,
            label: 'Total visits',
            value: patient.visit_count,
          },
          {
            icon: Stethoscope,
            label: 'Completed',
            value: completedVisits.length,
          },
          {
            icon: Banknote,
            label: 'Total spend',
            value: formatNGN(totalSpend),
          },
          {
            icon: CalendarDays,
            label: 'Last visit',
            value: lastVisit
              ? new Date(lastVisit).toLocaleDateString('en-NG', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '—',
          },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label} className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span className="text-xs uppercase tracking-widest">
                  {label}
                </span>
              </div>
              <p className="mt-2 font-serif text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Contact info ────────────────────────────────── */}
        <Card className="rounded-2xl lg:col-span-1">
          <CardContent className="p-5">
            <h2 className="font-serif text-lg font-semibold">
              Contact details
            </h2>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Phone
                  </p>
                  <a
                    href={`tel:${patient.phone}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {patient.phone}
                  </a>
                </div>
              </div>

              {patient.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                      Email
                    </p>
                    <a
                      href={`mailto:${patient.email}`}
                      className="break-all text-sm font-medium hover:underline"
                    >
                      {patient.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    First seen
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(patient.first_seen).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Activity className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Total visits
                  </p>
                  <p className="text-sm font-medium">{patient.visit_count}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Visit history ───────────────────────────────── */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-semibold">
                  Visit history
                </h2>
                <span className="text-xs text-muted-foreground">
                  {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                </span>
              </div>

              {bookings.length === 0 ? (
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  No bookings found for this patient.
                </p>
              ) : (
                <div className="mt-4 flex flex-col gap-3">
                  {bookings.map((b: any) => {
                    const svc = b.services
                    return (
                      <div
                        key={b.id}
                        className="rounded-xl border border-border p-4"
                      >
                        {/* Top row: service + status */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">
                              {svc?.name ?? 'General appointment'}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {new Date(b.preferred_date).toLocaleDateString(
                                  'en-NG',
                                  {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  },
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {b.preferred_time}
                              </span>
                              {svc?.duration_min && (
                                <span>{svc.duration_min} min</span>
                              )}
                            </div>
                          </div>
                          <StatusBadge status={b.status} />
                        </div>

                        {/* Bottom row: price + notes */}
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3 text-sm">
                            {(svc?.price_ngn || b.price_ngn) && (
                              <span className="flex items-center gap-1 font-medium">
                                <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
                                {formatNGN(svc?.price_ngn ?? b.price_ngn)}
                              </span>
                            )}
                          </div>
                          {b.notes && (
                            <p className="text-xs text-muted-foreground italic">
                              "{b.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
