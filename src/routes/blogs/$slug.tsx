import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { SiteLayout } from '@/components/site/SiteLayout'
import { buildHead } from '@/lib/seo'
import { getPostBySlug } from '@/lib/blog.functions'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronRight } from 'lucide-react'

function FadeInSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  const [ref, inView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.6,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

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
    queryFn: () =>
      getFn({
        data: { slug },
      }),
  })

  const post = data ?? null
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    async function convert() {
      if (!post) return
      if (post.content_markdown) {
        // dynamic import of `marked` for markdown -> html
        try {
          const m = await import('marked')
          const parsed = await m.marked.parse(post.content_markdown)
          setHtml(parsed)
        } catch (e) {
          // fallback to plain text
          setHtml(
            `<pre>${(post.content_markdown || '').replace(/</g, '&lt;')}</pre>`,
          )
        }
      } else {
        // If stored as structured JSON, render a basic representation
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
                        <span className="font-medium text-black"> {post.title}</span>
                  </nav>

          <article>
            {post.hero_image ? (
              <img
                src={post.hero_image}
                alt={post.title}
                className="w-full h-72 object-cover rounded"
              />
            ) : null}
            <h1 className="mt-6 text-3xl font-serif font-semibold">
              {post.title}
            </h1>
            <div className="mt-2 text-sm text-muted-foreground">
              {post.author?.name ?? ''} • {post.reading_time ?? '—'} min read
            </div>

            <div
              className="prose mt-6"
              dangerouslySetInnerHTML={{ __html: html ?? '' }}
            />
          </article>
        </div>
      </FadeInSection>
    </SiteLayout>
  )
}
