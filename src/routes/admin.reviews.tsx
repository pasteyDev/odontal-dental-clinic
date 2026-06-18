import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listReviewsAdmin, approveReview, rejectReview } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reviews")({ component: ReviewsAdmin });

function ReviewsAdmin() {
  const fn = useServerFn(listReviewsAdmin);
  const app = useServerFn(approveReview);
  const rej = useServerFn(rejectReview);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin:reviews"], queryFn: () => fn() });

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Reviews (admin)</h1>
      <div className="mt-4 grid gap-3">
        {data.map((r: any) => (
          <Card key={r.id} className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-muted-foreground">— {r.reviewer_name} • {r.rating} ⭐</div>
                  <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  {!r.approved && (
                    <Button
                      onClick={async () => {
                        await app({ data: { id: r.id } });
                        qc.invalidateQueries({ queryKey: ["admin:reviews"] });
                        toast.success("Approved");
                      }}
                      className="rounded-full"
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    variant={r.approved ? "destructive" : "outline"}
                    onClick={async () => {
                      await rej({ data: { id: r.id } });
                      qc.invalidateQueries({ queryKey: ["admin:reviews"] });
                      toast.success("Deleted");
                    }}
                    className="rounded-full"
                  >
                    {r.approved ? "Delete" : "Reject"}
                  </Button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm">{r.body}</p>
            </CardContent>
          </Card>
        ))}
        {data.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}
      </div>
    </div>
  );
}

// Component intentionally not exported as default to allow route code-splitting
