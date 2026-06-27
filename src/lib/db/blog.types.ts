export interface AuthorRow {
  id: string;
  name: string;
  bio?: string | null;
  avatar_url?: string | null;
  supabase_user_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TagRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: any; // TipTap/ProseMirror JSON or structured content
  content_markdown?: string | null;
  hero_image?: string | null;
  author_id?: string | null;
  author_name?: string | null;
  reading_time?: number | null;
  status: PostStatus;
  published_at?: string | null;
  scheduled_for?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  seo_image?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostInsert {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: any;
  content_markdown?: string | null;
  hero_image?: string | null;
  author_id?: string | null;
  author_name?: string | null;
  status?: PostStatus;
  published_at?: string | null;
  scheduled_for?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  seo_image?: string | null;
}

export interface BlogPostUpdate extends Partial<BlogPostInsert> {
  id: string;
}
