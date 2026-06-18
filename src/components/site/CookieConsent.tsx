"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Link } from "@tanstack/react-router";
import { CLINIC } from "@/lib/clinic";

const STORAGE_KEY = "odontal_cookie_consent";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  acceptedAt?: string;
};

function setCookie(name: string, value: string, days = 365) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const secure = typeof window !== 'undefined' && (window.location.protocol === 'https:' || (import.meta.env && (import.meta.env.PROD as boolean))) ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax${secure}`;
  } catch (e) {
    // ignore
  }
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setVisible(true);
      }
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const saveConsent = (c: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
      setCookie(STORAGE_KEY, JSON.stringify(c));
    } catch (e) {
      // ignore
    }
    setVisible(false);
  };

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true, acceptedAt: new Date().toISOString() });
  };

  if (!mounted || !visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl rounded-2xl border border-border bg-background p-4 shadow-lg">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            We use cookies to give you the best possible experience while you browse through our website. By pursuing the
            use of our website you implicitly agree to the usage of cookies on this site.{' '}
            {
              (() => {
                const privacy = CLINIC.privacyUrl ?? "/privacy";
                const external = privacy.startsWith("http");
                return external ? (
                  <a className="underline" href={privacy} target="_blank" rel="noopener noreferrer">Learn more</a>
                ) : (
                  <Link to={privacy} className="underline">Learn more</Link>
                );
              })()
            }
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full">Preferences</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cookie preferences</DialogTitle>
                </DialogHeader>

                <div className="mt-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Necessary</div>
                      <div className="text-sm text-muted-foreground">Required for site functionality</div>
                    </div>
                    <Switch checked disabled />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Analytics</div>
                      <div className="text-sm text-muted-foreground">Help us improve the site with anonymous usage data</div>
                    </div>
                    <Switch checked={prefs.analytics} onCheckedChange={(v: boolean) => setPrefs((p) => ({ ...p, analytics: Boolean(v) }))} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Marketing</div>
                      <div className="text-sm text-muted-foreground">Personalised offers and recommendations</div>
                    </div>
                    <Switch checked={prefs.marketing} onCheckedChange={(v: boolean) => setPrefs((p) => ({ ...p, marketing: Boolean(v) }))} />
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="rounded-full">Cancel</Button>
                  </DialogClose>
                  <Button
                    className="rounded-full"
                    onClick={() => saveConsent({ necessary: true, analytics: prefs.analytics, marketing: prefs.marketing, acceptedAt: new Date().toISOString() })}
                  >
                    Save preferences
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={acceptAll} className="rounded-full">Accept All</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
