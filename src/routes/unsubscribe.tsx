import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { unsubscribeByToken } from "@/lib/email.functions";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronRight } from 'lucide-react'

function FadeInSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const [ref, inView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.6,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

const searchSchema = z.object({ token: z.string().optional() });

export const Route = createFileRoute("/unsubscribe")({
  validateSearch: searchSchema,
  component: Unsubscribe,
});

function Unsubscribe() {
  const search = Route.useSearch();
  const unsubscribe = useServerFn(unsubscribeByToken);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Updating your email preferences...");

  useEffect(() => {
    if (!search.token) {
      setStatus("error");
      setMessage("This unsubscribe link is missing a token.");
      return;
    }
    unsubscribe({ data: { token: search.token } })
      .then((result) => {
        setStatus(result.ok ? "success" : "error");
        setMessage(result.ok ? "You have been unsubscribed." : result.message);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Could not update your preferences.");
      });
  }, [search.token, unsubscribe]);

  return (
    <SiteLayout>
      <FadeInSection>
        <section className="mx-auto max-w-xl px-4 py-24 text-center">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 mt-[-4] flex items-center gap-2 text-sm text-black/80"
          >
            <Link to="/" className="transition hover:text-black">
              Home
            </Link>

            <ChevronRight className="h-4 w-4" />

            <span className="font-medium text-black">Unsubscribe</span>
          </nav>
        <h1 className="font-serif text-3xl font-semibold">
          {status === "success" ? "Email preferences updated" : "Unsubscribe"}
        </h1>
        <p className="mt-3 text-muted-foreground">{message}</p>
        <Button asChild className="mt-8 rounded-full">
          <Link to="/">Back to home</Link>
        </Button>
      </section>
      </FadeInSection>
    </SiteLayout>
  );
}
