import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export default function BlogCard({ post }: { post: any }) {
  const date = post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date(post.created_at).toLocaleDateString();
  return (
    <Card className="overflow-hidden">
      {post.hero_image ? <img src={post.hero_image} alt={post.title} className="w-full h-48 object-cover" /> : null}
      <CardContent>
        <div className="text-sm text-muted-foreground">{date} • {post.reading_time ?? '—'} min read</div>
        <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-3">
<Link
  to="/blogs/$slug"
  params={{
    slug: post.slug,
  }}
  className="text-sm font-medium text-primary"
>
  Read article →
</Link>        </div>
      </CardContent>
    </Card>
  );
}
