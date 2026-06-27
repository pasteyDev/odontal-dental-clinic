import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { buildHead } from "@/lib/seo";
import { listReviewsPublic } from "@/lib/public.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ReviewForm from "@/components/site/ReviewForm";

function FadeInSection({
  children, delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "h-5 w-5" : "h-4 w-4"
  return (
    <div className="flex items-center gap-0.5 text-primary">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${cls} ${i < rating ? "fill-current" : "opacity-20"}`} />
      ))}
    </div>
  )
}

export const Route = createFileRoute("/reviews")({
  head: () =>
    buildHead({
      title: "Patient Reviews — Odontal Dental Clinic",
      description:
        "Read what our patients say about their experiences at Odontal Dental Clinic and share your own review.",
      path: "/reviews",
    }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const listFn = useServerFn(listReviewsPublic);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", page],
    queryFn: () => listFn({ data: { page, pageSize } }),
  });

  const reviews = data?.data ?? [];
  const total   = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <SiteLayout>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="border-b bg-[color:var(--cream)]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="transition hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-foreground">Reviews</span>
            </nav>

            <div className="max-w-2xl">
              <StarRow rating={5} size="md" />
              <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.15] sm:text-5xl md:text-6xl">
                Trusted by Families Across Surulere
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Discover what our patients have to say about their experiences
                at Odontal Dental Clinic.
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { value: "5.0★", label: "Average Rating" },
              { value: `${total}+`, label: "Patient Reviews" },
              { value: "98%", label: "Would Recommend" },
            ].map((stat) => (
              <Card key={stat.label} className="rounded-3xl text-center">
                <CardContent className="px-4 py-7 sm:p-8">
                  <div className="font-serif text-2xl font-bold text-primary sm:text-4xl">
                    {stat.value}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ── Reviews + Form ────────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-12">

            {/* ── Review list ───────────────────────────────── */}
            <div>
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">
                Patient Experiences
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Honest feedback from people who have trusted us with their smiles.
              </p>

              {/* Mobile: Write a review CTA — visible only below lg */}
              <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5 lg:hidden">
                <p className="text-sm font-medium">Had a visit recently?</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Share your experience — it helps other families choose quality care.
                </p>
                <Button
                  className="mt-4 w-full rounded-full"
                  onClick={() =>
                    document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Write a Review
                </Button>
              </div>

              <div className="mt-8 space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="rounded-3xl">
                        <CardContent className="p-7">
                          <div className="flex gap-4">
                            <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-muted" />
                            <div className="flex-1 space-y-2.5">
                              <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
                              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                              <div className="h-3 w-full animate-pulse rounded bg-muted" />
                              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <Card className="rounded-3xl">
                    <CardContent className="p-10 text-center">
                      <StarRow rating={0} size="md" />
                      <h3 className="mt-4 font-serif text-xl font-semibold">No Reviews Yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Be the first patient to share your experience with Odontal Dental Clinic.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  reviews.map((r: any, i: number) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                    >
                      <Card className="rounded-3xl shadow-sm transition-shadow duration-200 hover:shadow-md">
                        <CardContent className="p-6 sm:p-7">
                          <div className="flex gap-4">
                            {/* Initials avatar */}
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {r.reviewer_name?.charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold leading-tight">{r.reviewer_name}</p>
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    {new Date(r.created_at).toLocaleDateString("en-NG", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                                <StarRow rating={r.rating ?? 5} />
                              </div>

                              {r.title && (
                                <h4 className="mt-3 font-semibold">{r.title}</h4>
                              )}
                              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                                {r.body}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {reviews.length > 0 && (
                <div className="mt-10 flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    disabled={page <= 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* ── Review form ───────────────────────────────── */}
            <aside id="review-form">
              <Card className="rounded-3xl lg:sticky lg:top-24">
                <CardContent className="p-7 sm:p-8">
                  <h2 className="font-serif text-2xl font-bold">Share Your Experience</h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    Your feedback helps us improve and assists other patients in
                    choosing quality dental care.
                  </p>
                  <div className="mt-7">
                    <ReviewForm />
                  </div>
                </CardContent>
              </Card>
            </aside>

          </div>
        </section>
      </FadeInSection>

    </SiteLayout>
  );
}