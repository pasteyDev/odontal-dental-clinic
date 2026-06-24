// src/routes/admin.blogs.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, lazy, Suspense } from "react";
import { useServerFn, createClientOnlyFn } from "@tanstack/react-start";
import { buildHead } from "@/lib/seo";
import { adminListPosts, deletePost } from "@/lib/blog.functions";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const loadBlogEditor = createClientOnlyFn(
  () => import("@/components/admin/BlogEditor.client")
);

const BlogEditor = lazy(
  loadBlogEditor as () => Promise<{ default: React.ComponentType<any> }>
);

export const Route = createFileRoute("/admin/blogs")({
  head: () =>
    buildHead({
      title: "Admin — Blogs",
      description: "Manage blog posts",
      path: "/admin/blogs",
    }),
  component: AdminBlogsPage,
});

function AdminBlogsPage() {
  const listFn = useServerFn(adminListPosts);
  const delFn = useServerFn(deletePost);

  const [page, setPage] = useState(0);
  const pageSize = 20;

  const [editing, setEditing] = useState<any | null>(null);

  const { data, refetch } = useQuery({
    queryKey: ["adminBlogs", page],
    queryFn: () => listFn({ data: { page, pageSize } }),
  });

  const posts = data?.data ?? [];

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? (soft-delete)")) return;
    await delFn({ data: { id } });
    refetch();
    if (editing?.id === id) setEditing(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold">
              Blog management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create, edit, publish, and manage blog content.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button className="rounded-full" onClick={() => setEditing({})}>
              New post
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/admin">Back</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Blog List */}
          <div className="xl:col-span-2">
            <Card className="rounded-2xl">
              <CardContent className="p-0">
                {posts.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No blog posts found.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Title</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post: any) => (
                        <tr key={post.id} className="border-t border-border">
                          <td className="px-4 py-3">
                            <div className="font-medium">{post.title}</div>
                            {post.slug && (
                              <div className="text-xs text-muted-foreground">
                                /blogs/{post.slug}
                              </div>
                            )}
                          </td>
                          <td>
                            <Badge
                              variant={
                                post.status === "published"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {post.status}
                            </Badge>
                          </td>
                          <td className="text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </td>
                          <td className="pr-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditing(post)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive"
                                onClick={() => handleDelete(post.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <Button
                variant="outline"
                className="rounded-full"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1}
              </span>
              <Button
                variant="outline"
                className="rounded-full"
                disabled={posts.length < pageSize}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Editor */}
          <aside>
            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <div className="mb-5">
                  <h2 className="font-serif text-lg font-semibold">
                    {editing?.id ? "Edit post" : "Create new post"}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Draft and publish educational content.
                  </p>
                </div>

                <Suspense
                  fallback={
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      Loading editor…
                    </div>
                  }
                >
                  <BlogEditor
                    initial={editing ?? undefined}
                    onSaved={() => {
                      setEditing(null);
                      refetch();
                    }}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}