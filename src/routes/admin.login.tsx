import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { setupStatus, setupFirstAdmin } from "@/lib/setup.functions";
import { requestOtp, verifyOtp } from "@/lib/auth.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Staff Login — Odontal" }] }),
  component: Login,
});

// "step" drives which screen is shown!
type Step = "credentials" | "otp";

function Login() {
  const navigate = useNavigate();
  const statusFn = useServerFn(setupStatus);
  const bootstrapFn = useServerFn(setupFirstAdmin);
  const requestOtpFn = useServerFn(requestOtp);
  const verifyOtpFn = useServerFn(verifyOtp);

  const { data: setup } = useQuery({
    queryKey: ["setup-status"],
    queryFn: () => statusFn(),
  });
  const needsSetup = setup?.needsSetup ?? false;

  // Credentials step
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP step
  const [step, setStep] = useState<Step>("credentials");
  const [userId, setUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/admin" });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Step 1: submit credentials ─────────────────────────────────────────────
  async function onCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (needsSetup) {
        await bootstrapFn({ data: { email, password } });
        toast.success("Admin account created.");
      }
      const { userId: uid } = await requestOtpFn({ data: { email, password } });
      setUserId(uid);
      setStep("otp");
      setResendCooldown(60);
      toast.success("A 6-digit code has been sent to your email.");
      // Focus first OTP box after transition
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: submit OTP ─────────────────────────────────────────────────────
  async function onOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    const code = otp.join("");
    if (code.length < 6) return toast.error("Please enter all 6 digits.");
    setLoading(true);
    try {
      const { accessToken, refreshToken } = await verifyOtpFn({
        data: { userId, code, password },
      });
      // Set the real session on the client
      const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  // ── OTP input helpers ──────────────────────────────────────────────────────
  function handleOtpChange(index: number, value: string) {
    // Allow pasting a full 6-digit code into the first box
    if (value.length === 6 && index === 0) {
      const digits = value.slice(0, 6).split("");
      setOtp(digits);
      otpRefs.current[5]?.focus();
      return;
    }
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function handleResend() {
    if (resendCooldown > 0 || !email || !password) return;
    setLoading(true);
    try {
      const { userId: uid } = await requestOtpFn({ data: { email, password } });
      setUserId(uid);
      setOtp(["", "", "", "", "", ""]);
      setResendCooldown(60);
      toast.success("A new code has been sent.");
      otpRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend code.");
    } finally {
      setLoading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--cream)] px-4">
      <Toaster position="top-center" richColors />
      <Card className="w-full max-w-md rounded-2xl">
        <CardContent className="p-8">
          <Link to="/" className="font-serif text-2xl font-semibold text-primary">
            Odontal
          </Link>

          {step === "credentials" ? (
            <>
              <h1 className="mt-4 font-serif text-2xl font-semibold">
                {needsSetup ? "Create admin account" : "Staff sign in"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {needsSetup
                  ? "No admin exists yet. Set up the first admin account."
                  : "Sign in to manage bookings, patients and analytics."}
              </p>
              <form onSubmit={onCredentialsSubmit} className="mt-6 grid gap-4">
                <div className="grid gap-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading} className="rounded-full">
                  {loading ? "Checking…" : needsSetup ? "Create admin & continue" : "Continue"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="mt-4 font-serif text-2xl font-semibold">
                Check your email
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                A 6-digit code has been sent to <span className="font-medium text-foreground">{email}</span>.
                Enter it below to sign in.
              </p>

              <form onSubmit={onOtpSubmit} className="mt-6 grid gap-6">
                {/* 6-box OTP input */}
                <div className="flex justify-between gap-2">
                  {otp.map((digit, i) => (
                    <Input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={i === 0 ? 6 : 1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="h-14 w-full text-center text-xl font-semibold tracking-widest"
                    />
                  ))}
                </div>

                <Button type="submit" disabled={loading || otp.join("").length < 6} className="rounded-full">
                  {loading ? "Verifying…" : "Verify & sign in"}
                </Button>
              </form>

              <div className="mt-4 flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => { setStep("credentials"); setOtp(["", "", "", "", "", ""]); }}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleResend}
                  className="text-muted-foreground hover:text-foreground transition disabled:opacity-40"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
