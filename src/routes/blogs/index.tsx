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
  const pageSize = 12
  const { data } = useQuery({
    queryKey: ['blogs', page, search],
    queryFn: () => listFn({ data: { page, pageSize, search } }),
  })
  const posts = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <SiteLayout>
      <FadeInSection>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <nav
              aria-label="Breadcrumb"
              className="mb-8 mt-[-4] flex items-center gap-2 text-sm text-black/80"
            >
              <Link to="/" className="transition hover:text-black">
                Home
              </Link>

              <ChevronRight className="h-4 w-4" />

              <span className="font-medium text-black"> Blogs</span>
        </nav>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-serif text-3xl font-semibold">
              Articles & Resources
            </h1>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles"
            />
            <Button onClick={() => setPage(0)}>Search</Button>
          </div>

          <BlogList posts={posts} />

          <div className="mt-8 flex items-center justify-between">
            <div>
              <Button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="mr-2"
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                Next
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Page {page + 1} / {totalPages}
            </div>
          </div>
        </div>
      </FadeInSection>
    </SiteLayout>
  )
}
