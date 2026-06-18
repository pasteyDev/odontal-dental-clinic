import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/SiteLayout";
import { buildHead } from "@/lib/seo";
import { listReviewsPublic } from "@/lib/public.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReviewForm from "@/components/site/ReviewForm";

export const Route = createFileRoute("/reviews")({
  head: () =>
    buildHead({
      title: "Reviews — Odontal Dental Clinic",
      description: "Read patient reviews and leave your own review for Odontal Dental Clinic.",
      path: "/reviews",
    }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const listFn = useServerFn(listReviewsPublic);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const { data } = useQuery({ queryKey: ["reviews", page], queryFn: () => listFn({ data: { page, pageSize } }) });
  const reviews = data?.data ?? [];
  const total = data?.total ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-semibold">Patient reviews</h1>
          <Link to="/">Home</Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            {reviews.map((r: any) => (
              <Card key={r.id} className="mb-4">
                <CardContent>
                  <div className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</div>
                  <h3 className="mt-1 font-medium">{r.title}</h3>
                  <p className="mt-2 text-sm">{r.body}</p>
                  <div className="mt-3 text-sm font-medium">— {r.reviewer_name}</div>
                </CardContent>
              </Card>
            ))}

            <div className="mt-4 flex items-center justify-between">
              <div>
                <Button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page <= 0} className="mr-2">Previous</Button>
                <Button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next</Button>
              </div>
              <div className="text-sm text-muted-foreground">Page {page + 1} / {totalPages}</div>
            </div>
          </div>

          <aside>
            <h2 className="font-medium">Leave a review</h2>
            <div className="mt-4">
              <ReviewForm />
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}

// Component intentionally not exported as default to allow route code-splitting
