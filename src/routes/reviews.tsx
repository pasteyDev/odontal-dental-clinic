import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {Star} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { buildHead } from "@/lib/seo";
import { listReviewsPublic } from "@/lib/public.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

import ReviewForm from "@/components/site/ReviewForm";
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
    queryFn: () =>
      listFn({
        data: {
          page,
          pageSize,
        },
      }),
  });

  const reviews = data?.data ?? [];
  const total = data?.total ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize)
  );

  return (
    <SiteLayout>
      {/* HERO */}
      <FadeInSection>
        <section className="border-b bg-[color:var(--cream)]">
          <div className="mx-auto max-w-6xl px-4 py-20">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Link
                to="/"
                className="hover:text-primary"
              >
                Home
              </Link>

              <span>/</span>

              <span className="font-medium text-foreground">
                Reviews
              </span>
            </nav>

            <div className="max-w-3xl">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map(
                  (_, index) => (
                    <Star
                      key={index}
                      className="h-5 w-5 fill-current"
                    />
                  )
                )}
              </div>

              <h1 className="mt-4 font-serif text-4xl font-bold md:text-6xl">
                Trusted by Families Across Surulere
              </h1>

              <p className="mt-6 text-lg text-muted-foreground">
                Discover what our patients have to say
                about their experiences at Odontal
                Dental Clinic.
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* STATS */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="rounded-3xl text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary">
                  5.0★
                </div>

                <p className="mt-2 text-muted-foreground">
                  Average Rating
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary">
                  {total}+
                </div>

                <p className="mt-2 text-muted-foreground">
                  Patient Reviews
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary">
                  98%
                </div>

                <p className="mt-2 text-muted-foreground">
                  Would Recommend Us
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </FadeInSection>

      {/* REVIEWS + FORM */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            {/* Reviews */}
            <div>
              <h2 className="font-serif text-3xl font-bold">
                Patient Experiences
              </h2>

              <p className="mt-2 text-muted-foreground">
                Honest feedback from people who have
                trusted us with their smiles.
              </p>

              <div className="mt-8 space-y-6">
                {isLoading ? (
                  <p>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <Card className="rounded-3xl">
                    <CardContent className="p-10 text-center">
                      <h3 className="text-xl font-semibold">
                        No Reviews Yet
                      </h3>

                      <p className="mt-3 text-muted-foreground">
                        Be the first patient to share
                        your experience with Odontal
                        Dental Clinic.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  reviews.map((r: any) => (
                    <Card
                      key={r.id}
                      className="rounded-3xl shadow-sm transition hover:shadow-lg"
                    >
                      <CardContent className="p-8">
                        <div className="flex gap-4">
                          {/* Avatar */}
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {r.reviewer_name?.charAt(0)}
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <h3 className="font-semibold">
                                  {r.reviewer_name}
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                  {new Date(
                                    r.created_at
                                  ).toLocaleDateString()}
                                </p>
                              </div>

                              <div className="flex gap-1 text-primary">
                                {Array.from({
                                  length: 5,
                                }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i <
                                      (r.rating ?? 5)
                                        ? "fill-current"
                                        : ""
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {r.title && (
                              <h4 className="mt-4 text-lg font-semibold">
                                {r.title}
                              </h4>
                            )}

                            <p className="mt-3 leading-relaxed text-muted-foreground">
                              {r.body}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Pagination */}
              {reviews.length > 0 && (
                <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPage((p) =>
                        Math.max(0, p - 1)
                      )
                    }
                    disabled={page <= 0}
                  >
                    ← Previous
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Page {page + 1} of {totalPages}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          totalPages - 1,
                          p + 1
                        )
                      )
                    }
                    disabled={
                      page >= totalPages - 1
                    }
                  >
                    Next →
                  </Button>
                </div>
              )}
            </div>

            {/* Form */}
            <aside>
              <Card className="sticky top-24 rounded-3xl">
                <CardContent className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Share Your Experience
                  </h2>

                  <p className="mt-3 text-sm text-muted-foreground">
                    Your feedback helps us improve
                    and assists other patients in
                    choosing quality dental care.
                  </p>

                  <div className="mt-8">
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