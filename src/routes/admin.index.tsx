import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getDashboard } from '@/lib/admin.functions'
import { Card, CardContent } from '@/components/ui/card'
import { formatNGN } from '@/lib/clinic'
import { Badge } from '@/components/ui/badge'
import LazyRecharts from '@/components/admin/LazyRecharts'

export const Route = createFileRoute('/admin/')({
  component: Dashboard,
})

const COLORS = [
  'oklch(0.65 0.16 10)',
  'oklch(0.7 0.13 230)',
  'oklch(0.75 0.12 60)',
  'oklch(0.6 0.14 180)',
  'oklch(0.55 0.17 320)',
]

function Dashboard() {
  const fn = useServerFn(getDashboard)
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fn(),
  })

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>
  if (error)
    return <p className="text-destructive">{(error as Error).message}</p>
  if (!data) return null

  const kpis = [
    { label: 'New today', value: data.kpis.todayCount },
    { label: 'This week', value: data.kpis.weekCount },
    { label: 'Pending', value: data.kpis.pendingCount },
    { label: 'Completed (30d)', value: data.kpis.completedCount },
    { label: 'Newsletter subs', value: data.kpis.subscribers },
    { label: 'Revenue (30d)', value: formatNGN(data.kpis.revenue) },
  ]

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of the last 30 days.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <Card key={k.label} className="rounded-2xl">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {k.label}
              </div>
              <div className="mt-1 font-serif text-2xl font-semibold">
                {k.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-2">
          <CardContent className="p-5">
            <h2 className="font-serif text-lg font-semibold">
              Bookings per day
            </h2>
            <div className="mt-4 h-64">
              <LazyRecharts>
                {(R) => (
                  <R.ResponsiveContainer width="100%" height={256}>
                    <R.LineChart data={data.perDay}>
                      <R.XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <R.YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <R.Tooltip />
                      <R.Line
                        type="monotone"
                        dataKey="count"
                        stroke={COLORS[0]}
                        strokeWidth={2}
                        dot={false}
                      />
                    </R.LineChart>
                  </R.ResponsiveContainer>
                )}
              </LazyRecharts>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <h2 className="font-serif text-lg font-semibold">By status</h2>
            <div className="mt-4 h-64">
              <LazyRecharts>
                {(R) => (
                  <R.ResponsiveContainer width="100%" height={256}>
                    <R.PieChart>
                      <R.Pie
                        data={data.byStatus}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                      >
                        {data.byStatus.map((_, i) => (
                          <R.Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </R.Pie>
                      <R.Legend />
                    </R.PieChart>
                  </R.ResponsiveContainer>
                )}
              </LazyRecharts>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5 rounded-2xl">
        <CardContent className="p-5">
          <h2 className="font-serif text-lg font-semibold">By service</h2>
          <div className="mt-4 h-64">
            <LazyRecharts>
              {(R) => (
                <R.ResponsiveContainer width="100%" height={256}>
                  <R.BarChart data={data.byService}>
                    <R.XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <R.YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <R.Tooltip />
                    <R.Bar
                      dataKey="value"
                      fill={COLORS[1]}
                      radius={[6, 6, 0, 0]}
                    />
                  </R.BarChart>
                </R.ResponsiveContainer>
              )}
            </LazyRecharts>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-5 rounded-2xl">
        <CardContent className="p-5">
          <h2 className="font-serif text-lg font-semibold">Recent bookings</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2">Patient</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>When</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((b) => {
                  const svc =
                    (b as { services?: { name?: string } | null }).services
                      ?.name ?? '—'
                  return (
                    <tr key={b.id} className="border-t border-border">
                      <td className="py-2">{b.patient_name}</td>
                      <td>{b.phone}</td>
                      <td>{svc}</td>
                      <td>
                        {b.preferred_date} {b.preferred_time}
                      </td>
                      <td>
                        <Badge variant="secondary">{b.status}</Badge>
                      </td>
                    </tr>
                  )
                })}
                {data.recent.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No bookings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
