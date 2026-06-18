import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { setupStatus, setupFirstAdmin } from "@/lib/setup.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Staff Login — Odontal" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const status = useServerFn(setupStatus);
  const bootstrap = useServerFn(setupFirstAdmin);
  const { data: setup } = useQuery({ queryKey: ["setup-status"], queryFn: () => status() });
  const needsSetup = setup?.needsSetup ?? false;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/admin" });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (needsSetup) {
        await bootstrap({ data: { email, password } });
        toast.success("Admin account created — signing in…");
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--cream)] px-4">
      <Toaster position="top-center" richColors />
      <Card className="w-full max-w-md rounded-2xl">
        <CardContent className="p-8">
          <Link to="/" className="font-serif text-2xl font-semibold text-primary">Odontal</Link>
          <h1 className="mt-4 font-serif text-2xl font-semibold">
            {needsSetup ? "Create admin account" : "Staff sign in"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {needsSetup
              ? "No admin exists yet. Set up the first admin account."
              : "Sign in to manage bookings, patients and analytics."}
          </p>
          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label>Password</Label><Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button type="submit" disabled={loading} className="rounded-full">
              {loading ? "…" : needsSetup ? "Create admin & sign in" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
