import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboard } from "@/lib/admin.functions";
import { Card, CardContent } from "@/components/ui/card";
import LazyRecharts from "@/components/admin/LazyRecharts";
import { formatNGN } from "@/lib/clinic";

export const Route = createFileRoute("/admin/analytics")({ component: Analytics });

function Analytics() {
  const fn = useServerFn(getDashboard);
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: () => fn() });
  if (!data) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">Last 30 days · Revenue {formatNGN(data.kpis.revenue)}</p>
      <Card className="mt-6 rounded-2xl"><CardContent className="p-5">
        <h2 className="font-serif text-lg font-semibold">Booking trend</h2>
        <div className="mt-4 h-72">
          <LazyRecharts>
            {(R) => (
              <R.ResponsiveContainer width="100%" height="100%">
                <R.AreaChart data={data.perDay}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.65 0.16 10)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="oklch(0.65 0.16 10)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <R.XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <R.YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <R.Tooltip />
                  <R.Area type="monotone" dataKey="count" stroke="oklch(0.65 0.16 10)" fill="url(#g)" strokeWidth={2} />
                </R.AreaChart>
              </R.ResponsiveContainer>
            )}
          </LazyRecharts>
        </div>
      </CardContent></Card>

      <Card className="mt-5 rounded-2xl"><CardContent className="p-5">
        <h2 className="font-serif text-lg font-semibold">Demand by service</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byService} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
              <Tooltip />
              <Bar dataKey="value" fill="oklch(0.7 0.13 230)" radius={[0,6,6,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent></Card>
    </div>
  );
}
