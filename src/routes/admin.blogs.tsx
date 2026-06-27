import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, lazy, Suspense } from "react";
import { useServerFn, createClientOnlyFn } from "@tanstack/react-start";
import { buildHead } from "@/lib/seo";
import { adminListPosts, deletePost } from "@/lib/blog.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Pencil, Trash2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

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
  const delFn  = useServerFn(deletePost);

  const [page, setPage]       = useState(0);
  const [editing, setEditing] = useState<any | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pageSize = 20;

  const { data, refetch } = useQuery({
    queryKey: ["adminBlogs", page],
    queryFn: () => listFn({ data: { page, pageSize } }),
  });

  const posts = data?.data ?? [];

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await delFn({ data: { id } });
    refetch();
    if (editing?.id === id) {
      setEditing(null);
      setSheetOpen(false);
    }
  }

  function openEditor(post: any) {
    setEditing(post);
    setSheetOpen(true);
  }

  function openNew() {
    setEditing({});
    setSheetOpen(true);
  }

  const editorPanel = (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading editor…
        </div>
      }
    >
      <BlogEditor
        initial={editing ?? undefined}
        onSaved={() => {
          setEditing(null);
          setSheetOpen(false);
          refetch();
        }}
      />
    </Suspense>
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Blog management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {posts.length > 0
              ? `${posts.length} post${posts.length !== 1 ? "s" : ""} on this page`
              : "Create, edit, and publish blog content."}
          </p>
        </div>
        <Button className="rounded-full" onClick={openNew}>
          <Plus className="h-4 w-4" /> New post
        </Button>
      </div>

      {/* ── Mobile + tablet: stacked layout with Sheet editor ── */}
      <div className="xl:hidden">
        {/* Post cards */}
        <div className="flex flex-col gap-3">
          {posts.length === 0 ? (
            <Card className="rounded-2xl">
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                No blog posts yet. Create your first one.
              </CardContent>
            </Card>
          ) : (
            posts.map((post: any) => (
              <Card key={post.id} className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{post.title}</p>
                      {post.slug && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          /blogs/{post.slug}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={post.status === "published" ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {post.status}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      {post.slug && (
                        <Link
                          to="/blogs/$slug"
                          params={{ slug: post.slug }}
                          target="_blank"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => openEditor(post)}
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full px-2.5 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {posts.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              className="rounded-full"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page + 1}</span>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={posts.length < pageSize}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Editor in a bottom Sheet on mobile */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="bottom" className="h-[92dvh] overflow-y-auto rounded-t-2xl">
            <SheetHeader className="mb-5">
              <SheetTitle className="font-serif text-xl">
                {editing?.id ? "Edit post" : "Create new post"}
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                Draft and publish educational content.
              </p>
            </SheetHeader>
            {editorPanel}
          </SheetContent>
        </Sheet>
      </div>

      {/* ── Desktop: side-by-side layout ───────────────────── */}
      <div className="hidden xl:grid xl:grid-cols-3 xl:gap-6">

        {/* Post table */}
        <div className="xl:col-span-2">
          <Card className="rounded-2xl">
            <CardContent className="p-0">
              {posts.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  No blog posts yet.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Created</th>
                      <th className="py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post: any) => (
                      <tr
                        key={post.id}
                        className={`border-t border-border align-middle transition-colors ${
                          editing?.id === post.id ? "bg-accent/40" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium">{post.title}</p>
                          {post.slug && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              /blogs/{post.slug}
                            </p>
                          )}
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={post.status === "published" ? "default" : "secondary"}
                          >
                            {post.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center justify-end gap-1.5">
                            {post.slug && (
                              <Link
                                to="/blogs/$slug"
                                params={{ slug: post.slug }}
                                target="_blank"
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            )}
                            <Button
                              size="sm"
                              variant={editing?.id === post.id ? "default" : "outline"}
                              className="rounded-full"
                              onClick={() => setEditing(post)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              {editing?.id === post.id ? "Editing" : "Edit"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full px-2.5 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(post.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page + 1}</span>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={posts.length < pageSize}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sticky editor panel */}
        <aside className="xl:col-span-1">
          <div className="sticky top-6">
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
                {editorPanel}
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}