import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "sonner";
import ReauthGuard from "@/components/admin/ReauthGuard";
import { LayoutDashboard, MessageSquare, CalendarCheck, Users, Mail, Megaphone, Settings, UserCog, LogOut, BarChart3 } from "lucide-react";
import logo from "@/assets/odontal-logo-2.png";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/patients", label: "Patients", icon: Users },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/newsletter", label: "Newsletter", icon: Megaphone },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/services", label: "Services", icon: Settings },
  { to: "/admin/staff", label: "Staff", icon: UserCog },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
];

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (path === "/admin/login") {
      setReady(true);
      return;
    }
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) navigate({ to: "/admin/login" });
      else setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session && path !== "/admin/login") navigate({ to: "/admin/login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, path]);

  if (path === "/admin/login") return <Outlet />;
  if (!ready) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;

  return (
    <div className="flex min-h-screen bg-[color:var(--cream)]">
      <Toaster position="top-center" richColors />
      <ReauthGuard timeoutMinutes={1} />
      <aside className="hidden w-64 shrink-0 border-r border-border bg-background p-4 md:block">
        <Link to="/" className="flex items-center gap-2 px-2 py-2 font-serif text-xl font-semibold text-primary">
          <span className="inline-flex h-15 w-15 items-center justify-center rounded-full bg-background text-primary-foreground"><img src={logo} alt="Odontal Dental Clinic Logo" /></span>
          Admin
        </Link>
        <nav className="mt-6 grid gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact ?? false }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-accent"
              activeProps={{ className: "bg-accent text-foreground font-medium" }}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
          className="mt-6 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-accent"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
