import {
  createFileRoute, Link, Outlet, useNavigate,
  useRouterState, redirect,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "sonner";
import ReauthGuard from "@/components/admin/ReauthGuard";
import {
  LayoutDashboard, MessageSquare, CalendarCheck, Edit3,
  Users, Mail, Megaphone, Settings, UserCog, LogOut,
  BarChart3, Menu, X, MoreHorizontal, CircleUserRound,
} from "lucide-react";
import logo from "@/assets/odontal-logo-2.png";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });
  },
  component: AdminLayout,
});

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin",            label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings",   label: "Bookings",   icon: CalendarCheck },
  { to: "/admin/patients",   label: "Patients",   icon: Users },
  { to: "/admin/messages",   label: "Messages",   icon: Mail },
  { to: "/admin/newsletter", label: "Newsletter", icon: Megaphone },
  { to: "/admin/analytics",  label: "Analytics",  icon: BarChart3 },
  { to: "/admin/services",   label: "Services",   icon: Settings },
  { to: "/admin/staff",      label: "Staff",      icon: UserCog },
  { to: "/admin/blogs",      label: "Blogs",      icon: Edit3 },
  { to: "/admin/reviews",    label: "Reviews",    icon: MessageSquare },
];

const BOTTOM_NAV = NAV.slice(0, 3);

function AdminSessionGuard() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const wasInAdmin = useRef(true);

  useEffect(() => {
    const isInAdmin = path.startsWith("/admin");
    if (wasInAdmin.current && !isInAdmin) {
      supabase.auth.signOut().then(() => navigate({ to: "/admin/login" }));
    }
    wasInAdmin.current = isInAdmin;
  }, [path, navigate]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session && path !== "/admin/login") navigate({ to: "/admin/login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, path]);

  return null;
}

// ── Avatar circle with initials ───────────────────────────────────────────────
function UserAvatar({ email }: { email: string }) {
  const initials = email.slice(0, 2).toUpperCase();
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-foreground">
      {initials}
    </div>
  );
}

// ── User info card shown at the bottom of sidebars ───────────────────────────
function UserCard({
  email,
  onSignOut,
}: {
  email: string;
  onSignOut: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
      <UserAvatar email={email} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-foreground">{email}</p>
        <p className="text-[10px] text-muted-foreground">Administrator</p>
      </div>
      <button
        onClick={onSignOut}
        title="Sign out"
        className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // ── Fetch logged-in user ──────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (path === "/admin/login") return <Outlet />;

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  const navLinks = (onClick?: () => void) =>
    NAV.map((n) => (
      <Link
        key={n.to}
        to={n.to}
        activeOptions={{ exact: n.exact ?? false }}
        onClick={onClick}
        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
        activeProps={{ className: "bg-accent text-foreground font-medium" }}
      >
        <n.icon className="h-4 w-4 shrink-0" />
        {n.label}
      </Link>
    ));

  return (
    <div className="flex min-h-screen bg-[color:var(--cream)]">
      <Toaster position="top-center" richColors />
      <ReauthGuard timeoutMinutes={10} />
      <AdminSessionGuard />

      {/* ── Desktop sidebar ───────────────────────────────────────── */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-background md:flex">
        <div className="flex h-full flex-col p-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-2 py-2 font-serif text-lg font-semibold text-primary"
          >
            <img src={logo} alt="" className="h-8 w-8 rounded-full object-cover" />
            Admin
          </Link>

          <nav className="mt-5 flex flex-1 flex-col gap-0.5">
            {navLinks()}
          </nav>

          {/* User info + sign out */}
          <div className="mt-4 border-t border-border pt-4">
            {userEmail ? (
              <UserCard email={userEmail} onSignOut={handleSignOut} />
            ) : (
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign out
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Mobile drawer overlay ─────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer ─────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background transition-transform duration-200 md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Link
            to="/"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-2 font-serif text-lg font-semibold text-primary"
          >
            <img src={logo} alt="" className="h-7 w-7 rounded-full object-cover" />
            Odontal Admin
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
          {navLinks(() => setDrawerOpen(false))}
        </nav>

        {/* User info + sign out in drawer */}
        <div className="border-t border-border p-3">
          {userEmail ? (
            <UserCard email={userEmail} onSignOut={handleSignOut} />
          ) : (
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground/60 hover:bg-accent hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          )}
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <Link to="/" className="font-serif text-base font-semibold text-primary">
            Odontal
          </Link>

          {/* Avatar in top bar on mobile */}
          {userEmail ? (
            <UserAvatar email={userEmail} />
          ) : (
            <CircleUserRound className="h-7 w-7 text-muted-foreground" />
          )}
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl p-4 pb-24 md:p-8 md:pb-8">
            <Outlet />
          </div>
        </main>

        {/* ── Mobile bottom nav ────────────────────────────────────── */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-background md:hidden">
          {BOTTOM_NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact ?? false }}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] text-muted-foreground transition-colors"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              <n.icon className="h-5 w-5" />
              {n.label}
            </Link>
          ))}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] text-muted-foreground"
          >
            <MoreHorizontal className="h-5 w-5" />
            More
          </button>
        </nav>
      </div>
    </div>
  );
}