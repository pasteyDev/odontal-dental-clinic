import React from "react";
import BlogCard from "./BlogCard";

export default function BlogList({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return <div className="text-center text-muted-foreground">No posts found.</div>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <BlogCard key={p.id} post={p} />
      ))}
    </div>
  );
}
