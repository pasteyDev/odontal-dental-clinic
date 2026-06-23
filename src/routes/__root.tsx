import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { useEffect, type ReactNode } from 'react'
import appCss from '../styles.css?url'
import { reportOdontalError } from '../lib/odontal-error-reporting'
import { CLINIC } from '@/lib/clinic'

const SITE_URL = import.meta.env.VITE_PUBLIC_SITE_URL || ''

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error)
  const router = useRouter()
  useEffect(() => {
    reportOdontalError(error, { boundary: 'tanstack_root_error_component' })
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate()
              reset()
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: 'Odontal Dental Clinic' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#ffffff' },
        {
          name: 'description',
          content: 'Odontal Dental Clinic - Best Dental Clinic in Lagos',
        },
        { name: 'author', content: 'Odontal Dental Clinic' },
        { property: 'og:title', content: 'Odontal Dental Clinic' },
        {
          property: 'og:description',
          content: 'Odontal Dental Clinic - Best Dental Clinic in Lagos',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: CLINIC.name },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: '@OdontalDental' },
        { name: 'instagram:card', content: 'summary' },
        { name: 'instagram:site', content: '@odontaldentalclinicng' },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss,
        },
        //  { rel: "icon", href: "/favicon.ico" },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon.png',
        },
        // Canonical at root; route-level components can override per-page canonical links when needed.
        { rel: 'canonical', href: import.meta.env.VITE_PUBLIC_SITE_URL || '/' },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
)

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Structured data for LocalBusiness / Dentist */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'LocalBusiness',
                  '@id': SITE_URL,
                  url: SITE_URL,
                  name: CLINIC.name,
                  telephone: CLINIC.phoneIntl,
                  email: CLINIC.email,
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: CLINIC.address,
                    addressLocality: CLINIC.area,
                    addressCountry: 'NG',
                  },
                  openingHoursSpecification: CLINIC.hours.map((h) => ({
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: h.day,
                    opens: h.open.split('–')[0].trim(),
                    closes: h.open.split('–')[1]?.trim() ?? h.open,
                  })),
                },
                {
                  '@type': 'Dentist',
                  name: CLINIC.name,
                },
              ],
            }).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  )
}
