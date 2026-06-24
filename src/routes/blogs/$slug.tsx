// src/routes/blogs.$slug.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { SiteLayout } from '@/components/site/SiteLayout'
import { buildHead } from '@/lib/seo'
import { getPostBySlug } from '@/lib/blog.functions'
import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronRight, Link2, Check } from 'lucide-react'

const SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL || ''

function FadeInSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?url=${encoded.url}&text=${encoded.title}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded.url}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      label: 'Share on WhatsApp',
      href: `https://wa.me/?text=${encoded.title}%20${encoded.url}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
    <div className="mt-10 flex items-center gap-3 border-t pt-8">
      <span className="text-sm text-muted-foreground">Share</span>

      {links.map(({ label, href, icon }) => (
  <a
    key={label}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-foreground hover:text-foreground"
  >
    {icon}
  </a>
))}

      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-foreground hover:text-foreground"
      >
        {copied ? <Check size={16} className="text-green-600" /> : <Link2 size={16} />}
      </button>
    </div>
  )
}

// ── Route ────────────────────────────────────────────────────────────────────
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
  const getFn = useServerFn(getPostBySlug)

  const { data, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getFn({ data: { slug } }),
  })

  const post = data ?? null
  const [html, setHtml] = useState<string | null>(null)

  // Build the canonical share URL on the client
  const shareUrl = `${SITE_URL}/blogs/${slug}`

  useEffect(() => {
    async function convert() {
      if (!post) return
      if (post.content_markdown) {
        try {
          const m = await import('marked')
          const parsed = await m.marked.parse(post.content_markdown)
          setHtml(parsed)
        } catch {
          setHtml(
            `<pre>${(post.content_markdown || '').replace(/</g, '&lt;')}</pre>`,
          )
        }
      } else {
        setHtml(`<pre>${JSON.stringify(post.content, null, 2)}</pre>`)
      }
    }
    convert()
  }, [post])

  if (isLoading)
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-16">Loading...</div>
      </SiteLayout>
    )

  if (!post)
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-16">Article not found.</div>
      </SiteLayout>
    )

  return (
    <SiteLayout>
      <FadeInSection>
        <div className="mx-auto max-w-4xl px-4 py-16">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 mt-[-4] flex items-center gap-2 text-sm text-black/80"
          >
            <Link to="/" className="transition hover:text-black">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/blogs" className="font-medium hover:text-black">
              Blogs
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-black">{post.title}</span>
          </nav>

          <article>
            {post.hero_image ? (
              <img
                src={post.hero_image}
                alt={post.title}
                className="h-72 w-full rounded object-cover"
              />
            ) : null}

            <h1 className="mt-6 font-serif text-3xl font-semibold">
              {post.title}
            </h1>

            <div className="mt-2 text-sm text-muted-foreground">
              {post.author?.name ?? ''} • {post.reading_time ?? '—'} min read
            </div>

            <div
              className="prose mt-6"
              dangerouslySetInnerHTML={{ __html: html ?? '' }}
            />

            <ShareBar title={post.title} url={shareUrl} />
          </article>
        </div>
      </FadeInSection>
    </SiteLayout>
  )
}