import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { listPatients } from '@/lib/admin.functions'
import { EmailDialog } from '@/components/admin/EmailDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Phone, Mail, CalendarDays, Activity } from 'lucide-react'

export const Route = createFileRoute('/admin/patients')({ component: Patients })

function Patients() {
  const fn = useServerFn(listPatients)
  const { data = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => fn(),
  })
  const [q, setQ] = useState('')

  const filtered = data.filter((p) =>
    `${p.name} ${p.phone} ${p.email ?? ''}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  )

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold">Patients</h1>
        {!isLoading && (
          <p className="mt-1 text-sm text-muted-foreground">
            {data.length} patient{data.length !== 1 ? 's' : ''} total
          </p>
        )}
      </div>

      {/* Search */}
      <div className="relative mt-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, phone or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {isLoading && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Loading patients…
        </p>
      )}

      {/* ── Mobile: card list ──────────────────────────────── */}
      {!isLoading && (
        <div className="mt-5 flex flex-col gap-3 md:hidden">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No patients found.
            </p>
          ) : (
            filtered.map((p) => (
              <Card key={p.id} className="rounded-2xl">
                <CardContent className="p-4">
                  {/* Name row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Initials avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-foreground">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium leading-tight">{p.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {p.visit_count} visit{p.visit_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <EmailDialog
                      toEmail={p.email}
                      toName={p.name}
                      initialSubject="A note from Odontal Dental Clinic"
                      initialBody={`Hello ${p.name},\n\nThank you for choosing Odontal Dental Clinic.\n\nOdontal Dental Clinic`}
                    />
                  </div>

                  <div className="my-3 h-px bg-border" />

                  {/* Details */}
                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:${p.phone}`}
                      className="flex items-center gap-2 text-sm hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      {p.phone}
                    </a>
                    {p.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate text-muted-foreground">
                          {p.email}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                      First seen {new Date(p.first_seen).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* ── Desktop: table ─────────────────────────────────── */}
      {!isLoading && (
        <Card className="mt-5 hidden rounded-2xl md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="py-3">Phone</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Visits</th>
                    <th className="py-3">First seen</th>
                    <th className="py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No patients found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <tr
                        key={p.id}
                        className="border-t border-border align-middle"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-foreground">
                              {p.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <a
                            href={`tel:${p.phone}`}
                            className="hover:underline"
                          >
                            {p.phone}
                          </a>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {p.email ?? '—'}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                            {p.visit_count}
                          </div>
                        </td>
                        <td className="py-3 text-xs text-muted-foreground">
                          {new Date(p.first_seen).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4">
                          <EmailDialog
                            toEmail={p.email}
                            toName={p.name}
                            initialSubject="A note from Odontal Dental Clinic"
                            initialBody={`Hello ${p.name},\n\nThank you for choosing Odontal Dental Clinic.\n\nOdontal Dental Clinic`}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
