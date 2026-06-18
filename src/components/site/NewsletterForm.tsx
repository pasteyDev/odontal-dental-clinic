import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/public.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// sonner is client-side only; dynamically import to avoid bundling on server
let toast: any;

async function ensureToast() {
  if (!toast) {
    const mod = await import("sonner");
    toast = mod.toast ?? mod.toast;
  }
}

export function NewsletterForm() {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        try {
          await subscribe({ data: { email: email.trim() } });
          await ensureToast();
          toast.success("Subscribed! Thanks for joining.");
          setEmail("");
        } catch (err) {
          await ensureToast();
          toast.error(err instanceof Error ? err.message : "Could not subscribe");
        } finally {
          setLoading(false);
        }
      }}
      className="flex gap-2"
    >
      <Input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-full bg-background"
      />
      <Button type="submit" disabled={loading} className="rounded-full">
        {loading ? "…" : "Subscribe"}
      </Button>
    </form>
  );
}
