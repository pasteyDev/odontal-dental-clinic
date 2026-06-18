import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitReview } from "@/lib/public.functions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ReviewForm() {
  const submit = useServerFn(submitReview);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          await submit({
            data: {
              rating,
              reviewer_name: name.trim(),
              title: title.trim(),
              body: body.trim(),
            },
          });
          toast.success("Thanks! Your review will appear once approved.");
          setRating(5);
          setName("");
          setTitle("");
          setBody("");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Could not submit review");
        } finally {
          setLoading(false);
        }
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-muted-foreground">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <Input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>

      <Input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea required placeholder="Write your review" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
      <div className="flex items-center justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting…" : "Submit review"}
        </Button>
      </div>
    </form>
  );
}

export default ReviewForm;
