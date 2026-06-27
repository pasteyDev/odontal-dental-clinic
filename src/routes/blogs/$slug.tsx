import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { SiteLayout } from '@/components/site/SiteLayout'
import { buildHead } from '@/lib/seo'
import { getPostBySlug, listPostsPublic } from '@/lib/blog.functions'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  ChevronRight, Link2, Check,
  Clock, User, ArrowRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL || ''

function FadeInSection({
  children, delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// ── Share bar ─────────────────────────────────────────────────────────────────
function ShareBar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const encoded = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
  }

  const links = [
    {
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded.url}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?url=${encoded.url}&text=${encoded.title}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      label: 'Share on WhatsApp',
      href: `https://wa.me/?text=${encoded.title}%20${encoded.url}`,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.528 5.845L.057 23.5l5.797-1.52A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.002-1.371l-.359-.214-3.719.975.993-3.63-.234-.373A9.818 9.818 0 1 1 12 21.818z" />
        </svg>
      ),
    },
  ]

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Share
      </span>
      <div className="flex items-center gap-2">
        {links.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {icon}
          </a>
        ))}
        <button
          onClick={copyLink}
          aria-label="Copy link"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          {copied
            ? <Check size={14} className="text-green-600" />
            : <Link2 size={14} />}
        </button>
      </div>
      {copied && (
        <span className="text-xs text-green-600">Link copied!</span>
      )}
    </div>
  )
}

// ── Related post card ─────────────────────────────────────────────────────────
function RelatedCard({ post }: { post: any }) {
  return (
    <Link to="/blogs/$slug" params={{ slug: post.slug }} className="group block">
      <Card className="h-full overflow-hidden rounded-2xl border-border/60 transition-shadow duration-200 group-hover:shadow-lg">
        {post.hero_image ? (
          <div className="overflow-hidden">
            <img
              src={post.hero_image}
              alt={post.title}
              className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex h-44 items-center justify-center bg-muted/40">
            <span className="text-3xl">🦷</span>
          </div>
        )}
        <CardContent className="p-5">
          <p className="line-clamp-2 font-serif text-base font-semibold leading-snug">
            {post.title}
          </p>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            {post.author_name && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" /> {post.author_name}
              </span>
            )}
            {post.reading_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {post.reading_time} min
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute('/blogs/$slug')({
  head: ({ params }) =>
    buildHead({
      title: `${params.slug} — Odontal Dental Clinic`,
      description: undefined,
      path: `/blogs/${params.slug}`,
    }),
  component: BlogPage,
})

function BlogPage() {
  const { slug } = Route.useParams()
  const getFn    = useServerFn(getPostBySlug)
  const listFn   = useServerFn(listPostsPublic)

  const { data, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getFn({ data: { slug } }),
  })

  // Fetch a pool of posts then pick 3 random ones that aren't this post
  const { data: allData } = useQuery({
    queryKey: ['blogs-related-pool'],
    queryFn: () => listFn({ data: { page: 0, pageSize: 20 } }),
  })

  const related = (allData?.data ?? [])
    .filter((p: any) => p.slug !== slug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  const post     = data ?? null
  const shareUrl = `${SITE_URL}/blogs/${slug}`
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    async function convert() {
      if (!post) return
      if (post.content_markdown) {
        try {
          const m = await import('marked')
          setHtml(await m.marked.parse(post.content_markdown))
        } catch {
          setHtml(`<pre>${(post.content_markdown || '').replace(/</g, '&lt;')}</pre>`)
        }
      } else {
        setHtml(`<pre>${JSON.stringify(post.content, null, 2)}</pre>`)
      }
    }
    convert()
  }, [post])

  // ── Loading ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <div className="space-y-4">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-64 w-full animate-pulse rounded-2xl bg-muted" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
            <div className="space-y-2.5 pt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${85 + (i % 3) * 5}%` }} />
              ))}
            </div>
          </div>
        </div>
      </SiteLayout>
    )
  }

  // ── Not found ─────────────────────────────────────────────
  if (!post) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
          <p className="font-serif text-3xl font-bold">Article not found</p>
          <p className="mt-3 text-muted-foreground">
            This article may have been moved or removed.
          </p>
          <Button asChild className="mt-8 rounded-full">
            <Link to="/blogs">Browse all articles</Link>
          </Button>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>

      {/* ── Hero image (full-bleed above content) ─────────── */}
      {post.hero_image && (
        <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96">
          <img
            src={post.hero_image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
      )}

      {/* ── Article ───────────────────────────────────────── */}
      <FadeInSection>
        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            <Link to="/" className="transition hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/blogs" className="transition hover:text-foreground">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground line-clamp-1 max-w-[200px] sm:max-w-none">
              {post.title}
            </span>
          </nav>

          <article>
            {/* Title */}
            <h1 className="font-serif text-3xl font-bold leading-[1.2] sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {post.author_name && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 shrink-0" />
                  {post.author_name}
                </span>
              )}
              {post.reading_time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 shrink-0" />
                  {post.reading_time} min read
                </span>
              )}
              {post.published_at && (
                <span>
                  {new Date(post.published_at).toLocaleDateString('en-NG', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mt-6 border-l-2 border-primary pl-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {post.excerpt}
              </p>
            )}

            {/* Body */}
            <div
              className="prose prose-neutral mt-8 max-w-none
                prose-headings:font-serif prose-headings:font-bold
                prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-base prose-p:leading-[1.8]
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-2xl prose-img:shadow-md
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-sm"
              dangerouslySetInnerHTML={{ __html: html ?? '' }}
            />

            <ShareBar title={post.title} url={shareUrl} />

            {/* Back to blog */}
            <div className="mt-8">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back to all articles
              </Link>
            </div>
          </article>
        </div>
      </FadeInSection>

      {/* ── Related articles ──────────────────────────────── */}
      {related.length > 0 && (
        <FadeInSection>
          <section className="border-t border-border bg-[color:var(--cream)]">
            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Keep Reading
                  </span>
                  <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                    Related Articles
                  </h2>
                </div>
                <Button asChild variant="outline" className="shrink-0 rounded-full">
                  <Link to="/blogs">
                    View all
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r: any, i: number) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.08 }}
                  >
                    <RelatedCard post={r} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>
      )}

    </SiteLayout>
  )
}