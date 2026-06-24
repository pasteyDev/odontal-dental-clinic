import { createFileRoute, Link } from '@tanstack/react-router'
import { SiteLayout } from '@/components/site/SiteLayout'
import { buildHead } from '@/lib/seo'
import { CLINIC } from '@/lib/clinic'
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

const EFFECTIVE_DATE = '13 June 2026'

export const Route = createFileRoute('/terms')({
  head: () =>
    buildHead({
      title: `${CLINIC.name} — Terms of Use`,
      description: `Terms of use for ${CLINIC.name}`,
      path: '/terms',
    }),
  component: TermsPage,
})

function TermsPage() {
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

            <span className="font-medium text-black"> Terms of Use</span>
          </nav>
          <h1 className="font-serif text-3xl font-semibold">Terms of Use</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective date: {EFFECTIVE_DATE}
          </p>

          <section className="mt-6 space-y-6 text-sm text-muted-foreground">
            <div>
              <h2 className="font-medium">1. Acceptance</h2>
              <p className="mt-2">
                By using this website and our services you agree to these Terms
                of Use. If you do not agree, please do not use the site.
              </p>
            </div>

            <div>
              <h2 className="font-medium">2. Use of the website</h2>
              <p className="mt-2">
                The content on this site is provided for general information and
                booking purposes. It is not medical advice. For personalised
                medical advice, consult a qualified clinician. We make
                reasonable efforts to keep information accurate but do not
                guarantee completeness or accuracy.
              </p>
            </div>

            <div>
              <h2 className="font-medium">
                3. Bookings, appointments and payments
              </h2>
              <p className="mt-2">
                Booking via the website constitutes a request for an
                appointment. Appointments are confirmed only when you receive a
                confirmation from us by phone or email. All payments for
                services are taken in person at the clinic when you attend your
                appointment — we do not accept online payments via this website.
                Any references to payments or receipts refer to payments made
                in-clinic.
              </p>
              <p className="mt-2">
                Cancellation and rescheduling: please provide at least 24 hours'
                notice to cancel or reschedule. Late cancellations and no-shows
                may incur a cancellation fee or a portion of the service cost;
                we will communicate applicable fees at the time of booking.
              </p>
              <p className="mt-2">
                Refunds: where a refund is appropriate (for example, in rare
                cases of overpayment), refunds will be handled in accordance
                with our clinic policies and may require proof of payment and
                identity. Because payments are processed in person, refunds
                cannot be processed automatically online.
              </p>
            </div>

            <div>
              <h2 className="font-medium">4. User content and reviews</h2>
              <p className="mt-2">
                If you submit reviews, messages or other content, you must only
                post content you have the right to use and that is lawful. By
                submitting content you grant {CLINIC.name} a non-exclusive,
                royalty-free, worldwide license to use, reproduce and display
                the content on the site. We reserve the right to remove or
                refuse content that violates these terms or is unlawful.
              </p>
            </div>

            <div>
              <h2 className="font-medium">5. Intellectual property</h2>
              <p className="mt-2">
                All content on this website, including text, images and logos,
                is owned or licensed by {CLINIC.name} unless otherwise stated.
                You may not reproduce or exploit site content without our
                permission.
              </p>
            </div>

            <div>
              <h2 className="font-medium">
                6. Disclaimers and limitation of liability
              </h2>
              <p className="mt-2">
                To the maximum extent permitted by law, {CLINIC.name} disclaims
                all warranties and is not liable for indirect, incidental or
                consequential damages arising from use of the site or reliance
                on its content. Nothing in these Terms limits liability that
                cannot be excluded by law.
              </p>
            </div>

            <div>
              <h2 className="font-medium">7. Patient responsibilities</h2>
              <p className="mt-2">
                Patients are responsible for providing accurate information when
                booking and attending appointments, including medical history
                and contact details. Please follow any pre-appointment
                instructions and post-treatment care advice provided by
                clinicians. Failure to follow instructions may affect treatment
                outcomes.
              </p>
            </div>

            <div>
              <h2 className="font-medium">8. Consent to treatment</h2>
              <p className="mt-2">
                By attending appointments you may be asked to provide informed
                consent for procedures. Clinicians will explain risks, benefits
                and alternatives. If you do not consent to a proposed treatment,
                please inform the clinician so that alternative options can be
                discussed.
              </p>
            </div>

            <div>
              <h2 className="font-medium">9. Medical records and access</h2>
              <p className="mt-2">
                We maintain clinical records in accordance with professional
                guidelines. You may request access to your records by contacting
                the clinic; we may require proof of identity and will handle
                requests in accordance with applicable law. We retain records
                for periods required by law and professional guidance.
              </p>
            </div>

            <div>
              <h2 className="font-medium">10. No-shows and late arrival</h2>
              <p className="mt-2">
                Please arrive on time. Excessively late arrival may result in an
                appointment being rescheduled. Repeated no-shows may result in
                restrictions on future bookings.
              </p>
            </div>

            <div>
              <h2 className="font-medium">11. Telehealth and online advice</h2>
              <p className="mt-2">
                The website may be used to request advice or follow-up, but it
                is not a substitute for in-person clinical assessment. Where
                telehealth or remote advice is provided, clinicians will
                indicate any limitations; urgent clinical issues should be
                directed to emergency services or in-person consultation.
              </p>
            </div>

            <div>
              <h2 className="font-medium">12. Governing law</h2>
              <p className="mt-2">
                These terms are governed by the laws of the jurisdiction where{' '}
                {CLINIC.name} operates (Nigeria). For enquiries contact us at{' '}
                <a href={`mailto:${CLINIC.email}`} className="underline">
                  {CLINIC.email}
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-medium">7. External links</h2>
              <p className="mt-2">
                The site may contain links to third-party websites. We do not
                endorse and are not responsible for the content or practices of
                those sites.
              </p>
            </div>

            <div>
              <h2 className="font-medium">8. Changes to these terms</h2>
              <p className="mt-2">
                We may update these Terms of Use from time to time. The
                effective date at the top of this page will indicate when
                changes take effect. Continued use of the site after changes
                indicates acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="font-medium">9. Governing law</h2>
              <p className="mt-2">
                These terms are governed by the laws of the jurisdiction where{' '}
                {CLINIC.name} operates. For enquiries contact us at{' '}
                <a href={`mailto:${CLINIC.email}`} className="underline">
                  {CLINIC.email}
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="font-medium">10. Contact</h2>
              <p className="mt-2">
                If you have questions about these Terms, please contact us at{' '}
                <a href={`mailto:${CLINIC.email}`} className="underline">
                  {CLINIC.email}
                </a>{' '}
                or at {CLINIC.address}.
              </p>
            </div>
          </section>
        </div>
      </FadeInSection>
    </SiteLayout>
  )
}

// Component intentionally not exported as default to allow route code-splitting
