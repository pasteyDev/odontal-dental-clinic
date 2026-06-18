"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "odontal_admin_last_activity";

interface ReauthGuardProps {
  timeoutMinutes?: number;
}

export default function ReauthGuard({ timeoutMinutes = 30 }: ReauthGuardProps) {
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const [locked, setLocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const timerRef = useRef<number | null>(null);

  const readLast = useCallback(() => {
    try {
      const v = sessionStorage.getItem(STORAGE_KEY);
      return v ? parseInt(v, 10) : null;
    } catch {
      return null;
    }
  }, []);

  const writeLast = useCallback((ts = Date.now()) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, String(ts));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // get email for reauth
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));

    // initialise last activity
    if (!readLast()) writeLast();

    const onActivity = () => {
      writeLast();
      if (locked) {
        // keep locked until reauth completes
      }
    };

    const events: (keyof DocumentEventMap)[] = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    for (const e of events) window.addEventListener(e, onActivity, { passive: true });

    const schedule = () => {
      const last = readLast() ?? Date.now();
      const elapsed = Date.now() - last;
      if (elapsed >= timeoutMs) {
        setLocked(true);
        setOpen(true);
        return;
      }
      const remaining = timeoutMs - elapsed;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setLocked(true);
        setOpen(true);
      }, remaining);
    };

    schedule();

    const visibilityHandler = () => schedule();
    document.addEventListener("visibilitychange", visibilityHandler);

    return () => {
      for (const e of events) window.removeEventListener(e, onActivity as any);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      document.removeEventListener("visibilitychange", visibilityHandler);
    };
  }, [locked, readLast, writeLast, timeoutMs]);

  useEffect(() => {
    // when unlocked, reset last activity and reschedule
    if (!locked) {
      writeLast();
      setOpen(false);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setLocked(true);
        setOpen(true);
      }, timeoutMs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email) {
      toast.error("Unable to reauthenticate: no email available");
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      writeLast();
      setPassword("");
      setLocked(false);
      setOpen(false);
      toast.success("Reauthenticated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reauthentication failed");
    }
  }

  if (!locked) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!locked) setOpen(v); }}>
      <DialogContent
        overlayClassName={"fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"}
        hideClose
        onEscapeKeyDown={(e: any) => e.preventDefault()}
        onPointerDownOutside={(e: any) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Session locked — Try reauthenticating</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 grid gap-3">
          <div>
            <Label>Email</Label>
            <Input value={email ?? ""} readOnly />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/admin/login'; }}>Sign out</Button>
            <Button type="submit" className="rounded-full">Unlock</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
