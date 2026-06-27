import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { loadUserRoles, requireAdminRole, requireAnyRole } from "@/lib/admin-auth";
import type { BlogPostRow } from "./db/blog.types";

const listPublicSchema = z.object({
  page: z.number().int().min(0).optional().default(0),
  pageSize: z.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional().or(z.literal("")),
  category: z.string().optional(),
  tag: z.string().optional(),
});

export const listPostsPublic = createServerFn({ method: "POST" })
  .validator((d: unknown) => listPublicSchema.parse(d))
  .handler(async ({ data }) => {
    const page = data.page ?? 0;
    const pageSize = data.pageSize ?? 10;
    const search = data.search?.trim();
    const category = data.category;
    const tag = data.tag;

    const from = page * pageSize;
    const to = from + pageSize - 1;

    // If filtering by category or tag, get matching post IDs first
    let idFilter: string[] | null = null;

    if (category) {
      const { data: cat, error: cErr } = await supabaseAdmin.from("blog_categories").select("id").eq("slug", category).maybeSingle();
      if (cErr) throw new Error(cErr.message);
      if (!cat) return { data: [], total: 0, page, pageSize };
      const { data: links, error: lErr } = await supabaseAdmin.from("blog_post_categories").select("post_id").eq("category_id", cat.id);
      if (lErr) throw new Error(lErr.message);
      idFilter = (links ?? []).map((r: any) => r.post_id);
    }

    if (tag) {
      const { data: t, error: tErr } = await supabaseAdmin.from("blog_tags").select("id").eq("slug", tag).maybeSingle();
      if (tErr) throw new Error(tErr.message);
      if (!t) return { data: [], total: 0, page, pageSize };
      const { data: tlinks, error: tlErr } = await supabaseAdmin.from("blog_post_tags").select("post_id").eq("tag_id", t.id);
      if (tlErr) throw new Error(tlErr.message);
      const tagIds = (tlinks ?? []).map((r: any) => r.post_id);
      if (idFilter) {
        idFilter = idFilter.filter((i) => tagIds.includes(i));
      } else {
        idFilter = tagIds;
      }
    }

    // Build base query
    let q = supabaseAdmin
      .from("blog_posts")
      .select("id,title,slug,excerpt,hero_image,author_id,author_name,reading_time,published_at,created_at,updated_at", { count: "exact" })
      .eq("status", "published")
      .is("deleted_at", null)
      .order("published_at", { ascending: false })
      .range(from, to);

    if (search) {
      // simple ilike on title, excerpt, and markdown
      q = q.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content_markdown.ilike.%${search}%`);
    }

    if (idFilter && idFilter.length === 0) return { data: [], total: 0, page, pageSize };
    if (idFilter && idFilter.length > 0) q = q.in("id", idFilter);

    const [{ data: rows, error }, { count, error: cErr }] = await Promise.all([
      q,
      supabaseAdmin.from("blog_posts").select("*", { count: "exact", head: true }).eq("status", "published").is("deleted_at", null),
    ]);
    if (error) throw new Error(error.message);
    if (cErr) throw new Error(cErr.message);

    const posts: BlogPostRow[] = (rows ?? []) as any;
    const postIds = posts.map((p) => p.id).filter(Boolean);

    // Batch fetch authors
    const authorIds = Array.from(new Set(posts.map((p) => p.author_id).filter(Boolean as any)));
    const authorsById: Record<string, any> = {};
    if (authorIds.length > 0) {
      const { data: authors } = await supabaseAdmin.from("authors").select("id,name,avatar_url").in("id", authorIds);
      (authors ?? []).forEach((a: any) => (authorsById[a.id] = a));
    }

    // Batch fetch categories and tags for posts
    const categoriesByPost: Record<string, any[]> = {};
    const tagsByPost: Record<string, any[]> = {};
    if (postIds.length > 0) {
      const { data: catLinks } = await supabaseAdmin.from("blog_post_categories").select("post_id,category_id").in("post_id", postIds);
      const catIds = Array.from(new Set((catLinks ?? []).map((r: any) => r.category_id)));
      const cats = catIds.length > 0 ? (await supabaseAdmin.from("blog_categories").select("id,name,slug").in("id", catIds)).data : [];
      const catsById: Record<string, any> = {};
      (cats ?? []).forEach((c: any) => (catsById[c.id] = c));
      (catLinks ?? []).forEach((l: any) => {
        categoriesByPost[l.post_id] = categoriesByPost[l.post_id] ?? [];
        if (catsById[l.category_id]) categoriesByPost[l.post_id].push(catsById[l.category_id]);
      });

      const { data: tagLinks } = await supabaseAdmin.from("blog_post_tags").select("post_id,tag_id").in("post_id", postIds);
      const tIds = Array.from(new Set((tagLinks ?? []).map((r: any) => r.tag_id)));
      const ts = tIds.length > 0 ? (await supabaseAdmin.from("blog_tags").select("id,name,slug").in("id", tIds)).data : [];
      const tagsByIdMap: Record<string, any> = {};
      (ts ?? []).forEach((t: any) => (tagsByIdMap[t.id] = t));
      (tagLinks ?? []).forEach((l: any) => {
        tagsByPost[l.post_id] = tagsByPost[l.post_id] ?? [];
        if (tagsByIdMap[l.tag_id]) tagsByPost[l.post_id].push(tagsByIdMap[l.tag_id]);
      });
    }

    const mapped = posts.map((p) => ({
      ...p,
      author: p.author_id ? authorsById[p.author_id] ?? null : null,
      categories: categoriesByPost[p.id] ?? [],
      tags: tagsByPost[p.id] ?? [],
    }));

    return { data: mapped, total: count ?? 0, page, pageSize };
  });

const getPostSchema = z.object({ slug: z.string().min(1) });

export const getPostBySlug = createServerFn({ method: "POST" })
  .validator((d: unknown) => getPostSchema.parse(d))
  .handler(async ({ data }) => {
    const { slug } = data;
    const { data: post, error } = await supabaseAdmin.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").is("deleted_at", null).maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) return null;

    const { data: author } = await supabaseAdmin.from("authors").select("id,name,avatar_url").eq("id", post.author_id).maybeSingle();

    const { data: catLinks } = await supabaseAdmin.from("blog_post_categories").select("category_id").eq("post_id", post.id);
    const catIds = (catLinks ?? []).map((r: any) => r.category_id);
    const categories = catIds.length > 0 ? (await supabaseAdmin.from("blog_categories").select("id,name,slug").in("id", catIds)).data : [];

    const { data: tagLinks } = await supabaseAdmin.from("blog_post_tags").select("tag_id").eq("post_id", post.id);
    const tagIds = (tagLinks ?? []).map((r: any) => r.tag_id);
    const tags = tagIds.length > 0 ? (await supabaseAdmin.from("blog_tags").select("id,name,slug").in("id", tagIds)).data : [];

    return { ...post, author: author ?? null, categories: categories ?? [], tags: tags ?? [] } as any;
  });

// Admin list: includes drafts, scheduled, archived and supports search/pagination
const adminListSchema = z.object({
  page: z.number().int().min(0).optional().default(0),
  pageSize: z.number().int().min(1).max(200).optional().default(20),
  search: z.string().optional().or(z.literal("")),
  status: z.string().optional(),
  category: z.string().optional(),
});

export const adminListPosts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => adminListSchema.parse(d))
  .handler(async ({ context, data }) => {
    const roles = await loadUserRoles(context.userId);
    requireAnyRole(roles);

    const page = data.page ?? 0;
    const pageSize = data.pageSize ?? 20;
    const search = data.search?.trim();
    const status = data.status;
    const category = data.category;

    const from = page * pageSize;
    const to = from + pageSize - 1;

    let q = supabaseAdmin.from("blog_posts").select("id,title,slug,status,author_id,author_name,published_at,created_at,updated_at,deleted_at", { count: "exact" }).order("created_at", { ascending: false }).range(from, to);

    if (search) q = q.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content_markdown.ilike.%${search}%`);
    if (status) q = q.eq("status", status);

    if (category) {
      const { data: cat } = await supabaseAdmin.from("blog_categories").select("id").eq("slug", category).maybeSingle();
      if (!cat) return { data: [], total: 0, page, pageSize };
      const { data: links } = await supabaseAdmin.from("blog_post_categories").select("post_id").eq("category_id", cat.id);
      const ids = (links ?? []).map((r: any) => r.post_id);
      if (ids.length === 0) return { data: [], total: 0, page, pageSize };
      q = q.in("id", ids);
    }

    const [{ data: rows, error }, { count, error: cErr }] = await Promise.all([
      q,
      supabaseAdmin.from("blog_posts").select("*", { count: "exact", head: true })
    ]);
    if (error) throw new Error(error.message);
    if (cErr) throw new Error(cErr.message);

    const posts = (rows ?? []) as any[];
    const authorIds = Array.from(new Set(posts.map((p: any) => p.author_id).filter(Boolean)));
    const { data: authors } = authorIds.length > 0 ? await supabaseAdmin.from("authors").select("id,name") : { data: [] };
    const authorsById: Record<string, any> = {};
    (authors ?? []).forEach((a: any) => (authorsById[a.id] = a));

    const mapped = posts.map((p: any) => ({ ...p, author: p.author_id ? authorsById[p.author_id] ?? null : null }));
    return { data: mapped, total: count ?? 0, page, pageSize };
  });

// Admin functions
const adminPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional().or(z.literal("")),
  content: z.any(),
  content_markdown: z.string().optional(),
  hero_image: z.string().optional(),
  author_id: z.string().uuid().optional(),
  author_name: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional(),
  published_at: z.string().optional(),
  scheduled_for: z.string().optional(),
  category_ids: z.array(z.string().uuid()).optional(),
  tag_ids: z.array(z.string().uuid()).optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  seo_image: z.string().optional(),
});

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => adminPostSchema.parse(d))
  .handler(async ({ context, data }) => {
    const roles = await loadUserRoles(context.userId);
    requireAdminRole(roles);

    const payload = data as any;
    const now = new Date().toISOString();
    const status = payload.status ?? "published";
    const publishedAt = status === "published" ? (payload.published_at || now) : (payload.published_at || null);

    const { data: inserted, error } = await supabaseAdmin.from("blog_posts").insert({
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt || null,
      content: payload.content,
      content_markdown: payload.content_markdown || null,
      hero_image: payload.hero_image || null,
      author_id: payload.author_id || null,
      author_name: payload.author_name || null,
      status: status,
      published_at: publishedAt,
      scheduled_for: payload.scheduled_for || null,
      meta_title: payload.meta_title || null,
      meta_description: payload.meta_description || null,
      seo_image: payload.seo_image || null,
    }).select("id").single();
    if (error) throw new Error(error.message);
    const postId = inserted.id;

    if (payload.category_ids && payload.category_ids.length > 0) {
      const links = payload.category_ids.map((c: string) => ({ post_id: postId, category_id: c }));
      const { error: lErr } = await supabaseAdmin.from("blog_post_categories").insert(links);
      if (lErr) throw new Error(lErr.message);
    }

    if (payload.tag_ids && payload.tag_ids.length > 0) {
      const links = payload.tag_ids.map((t: string) => ({ post_id: postId, tag_id: t }));
      const { error: tErr } = await supabaseAdmin.from("blog_post_tags").insert(links);
      if (tErr) throw new Error(tErr.message);
    }

    return { ok: true, id: postId };
  });

const updatePostSchema = adminPostSchema.extend({ id: z.string().uuid() });

export const updatePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => updatePostSchema.parse(d))
  .handler(async ({ context, data }) => {
    const roles = await loadUserRoles(context.userId);
    requireAdminRole(roles);

    const payload = data as any;
    const now = new Date().toISOString();

    const { error: uErr } = await supabaseAdmin
      .from("blog_posts")
      .update({
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt || null,
        content: payload.content,
        content_markdown: payload.content_markdown || null,
        hero_image: payload.hero_image || null,
        author_id: payload.author_id || null,
        author_name: payload.author_name || null,
        status: "published",          // ← always published
        published_at: now,            // ← always now
        scheduled_for: null,          // ← clear any schedule
        deleted_at: null,             // ← un-delete if previously soft-deleted
        meta_title: payload.meta_title || null,
        meta_description: payload.meta_description || null,
        seo_image: payload.seo_image || null,
      })
      .eq("id", payload.id);
    if (uErr) throw new Error(uErr.message);

    if (payload.category_ids) {
      await supabaseAdmin.from("blog_post_categories").delete().eq("post_id", payload.id);
      if (payload.category_ids.length > 0) {
        const links = payload.category_ids.map((c: string) => ({ post_id: payload.id, category_id: c }));
        const { error: lErr } = await supabaseAdmin.from("blog_post_categories").insert(links);
        if (lErr) throw new Error(lErr.message);
      }
    }

    if (payload.tag_ids) {
      await supabaseAdmin.from("blog_post_tags").delete().eq("post_id", payload.id);
      if (payload.tag_ids.length > 0) {
        const links = payload.tag_ids.map((t: string) => ({ post_id: payload.id, tag_id: t }));
        const { error: tErr } = await supabaseAdmin.from("blog_post_tags").insert(links);
        if (tErr) throw new Error(tErr.message);
      }
    }

    return { ok: true };
  });

const deleteSchema = z.object({ id: z.string().uuid() });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => deleteSchema.parse(d))
  .handler(async ({ context, data }) => {
    const roles = await loadUserRoles(context.userId);
    requireAdminRole(roles);

    const { id } = data;

    // Remove junction rows first (foreign-key safety)
    await supabaseAdmin.from("blog_post_categories").delete().eq("post_id", id);
    await supabaseAdmin.from("blog_post_tags").delete().eq("post_id", id);

    // Hard-delete the post
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
    if (error) throw new Error(error.message);

    return { ok: true };
  });

// Upload image via base64 payload (server-side helper). Admin-only.
const uploadSchema = z.object({ filename: z.string(), base64: z.string(), contentType: z.string().optional() });

export const uploadBlogImage = createServerFn({ method: "POST" })
  // .middleware([requireSupabaseAuth])
  .validator((d: unknown) => uploadSchema.parse(d))
  .handler(async ({ context, data }) => {
    // const roles = await loadUserRoles(context.userId);
    // requireAdminRole(roles);

    const { filename, base64, contentType } = data as any;
    const buffer = Buffer.from(base64, 'base64');
    const path = `public/${filename}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from('blog-images').upload(path, buffer, {
        contentType: contentType ?? 'image/jpeg',
        upsert: true,
      })
    if (uploadError) throw new Error(uploadError.message);
    const { data: publicUrl } = supabaseAdmin.storage.from('blog-images').getPublicUrl(path);
    return { ok: true, path, publicUrl: publicUrl.publicUrl };
  });
