import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { SiteLayout } from '@/components/site/SiteLayout'
import { buildHead } from '@/lib/seo'
import { listPostsPublic } from '@/lib/blog.functions'
import BlogList from '@/components/blog/BlogList'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronRight, ChevronLeft, Search } from 'lucide-react'

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

export const Route = createFileRoute('/blogs/')({
  head: () =>
    buildHead({
      title: 'Blog — Odontal Dental Clinic',
      description:
        'Educational articles and oral health guides from Odontal Dental Clinic.',
      path: '/blogs',
    }),
  component: BlogsPage,
})

function BlogsPage() {
  const listFn = useServerFn(listPostsPublic)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [committed, setCommitted] = useState('')
  const pageSize = 12

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page, committed],
    queryFn: () => listFn({ data: { page, pageSize, search: committed } }),
  })

  const posts      = data?.data ?? []
  const total      = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function handleSearch() {
    setCommitted(search)
    setPage(0)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <SiteLayout>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="border-b bg-[color:var(--cream)]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Link to="/" className="transition hover:text-foreground">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-foreground">Blog</span>
            </nav>

            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Oral Health Resources
              </span>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.15] sm:text-5xl">
                Articles & Resources
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Educational guides and dental health insights from the team at
                Odontal Dental Clinic — helping you make informed decisions
                about your smile.
              </p>
            </div>

            {/* Search */}
            <div className="mt-8 flex max-w-lg gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search articles…"
                  className="pl-9"
                />
              </div>
              <Button onClick={handleSearch} className="rounded-full px-6">
                Search
              </Button>
            </div>

            {/* Result count */}
            {committed && (
              <p className="mt-4 text-sm text-muted-foreground">
                {isLoading
                  ? 'Searching…'
                  : `${total} result${total !== 1 ? 's' : ''} for "${committed}"`}
              </p>
            )}
          </div>
        </section>
      </FadeInSection>

      {/* ── Post list ─────────────────────────────────────────── */}
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">

          {isLoading ? (
            /* Skeleton grid */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl border border-border bg-muted/30 p-6">
                  <div className="h-44 w-full animate-pulse rounded-2xl bg-muted" />
                  <div className="mt-5 space-y-2.5">
                    <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl font-semibold text-foreground">
                {committed ? 'No articles found' : 'No articles yet'}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {committed
                  ? `No results matched "${committed}". Try a different search term.`
                  : 'Check back soon — new content is on the way.'}
              </p>
              {committed && (
                <Button
                  variant="outline"
                  className="mt-6 rounded-full"
                  onClick={() => { setSearch(''); setCommitted(''); setPage(0); }}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <BlogList posts={posts} />
          )}

          {/* Pagination */}
          {!isLoading && posts.length > 0 && (
            <div className="mt-12 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                className="rounded-full"
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>

              <Button
                variant="outline"
                className="rounded-full"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      </FadeInSection>

    </SiteLayout>
  )
}