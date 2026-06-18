import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { buildHead } from "@/lib/seo";
import { CLINIC } from "@/lib/clinic";

const EFFECTIVE_DATE = "13 June 2026";

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildHead({
      title: `${CLINIC.name} — Privacy & Cookies`,
      description: `Privacy policy and cookie usage for ${CLINIC.name}`,
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-serif text-3xl font-semibold">Privacy & Cookies</h1>
        <p className="mt-2 text-sm text-muted-foreground">Effective date: {EFFECTIVE_DATE}</p>

        <section className="mt-6 space-y-6">
          <div>
            <h2 className="font-medium">1. Introduction</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {CLINIC.name} ("we", "us" or "our") is committed to protecting your privacy. This policy explains how we collect,
              use and disclose personal information when you use our website, make bookings, submit reviews or otherwise interact
              with our services. If you have questions about this policy, please contact us at <a href={`mailto:${CLINIC.email}`} className="underline">{CLINIC.email}</a>.
            </p>
          </div>

          <div>
            <h2 className="font-medium">2. Information we collect</h2>
            <p className="text-sm text-muted-foreground mt-2">We collect information that you provide directly and information automatically collected about your visit.</p>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              <li>
                <strong>Information you provide:</strong> name, phone, email, appointment details, medical history and other information
                you include in contact forms, booking requests, messages or reviews.
              </li>
              <li>
                <strong>Payments:</strong> We do not process online payments through this website. All payments for services are taken in person at the clinic. We do not collect or store full payment card details on the website. We may retain records of completed transactions or receipts for accounting and clinical record purposes.
              </li>
              <li>
                <strong>Automatically collected information:</strong> device and browser information, IP address, pages visited and
                analytics data collected using cookies and similar technologies.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-medium">3. How we use your information</h2>
            <p className="text-sm text-muted-foreground mt-2">We use your information for purposes including:</p>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              <li>Providing and managing bookings, appointments and clinical care.</li>
              <li>Communicating with you about appointments, reminders and responses to enquiries.</li>
              <li>Maintaining medical and billing records and meeting regulatory and professional obligations.</li>
              <li>Improving our website, services and security through aggregated analytics (with your consent for non-essential cookies).</li>
              <li>Complying with legal obligations and protecting our legal rights.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-medium">4. Lawful basis for processing</h2>
            <p className="text-sm text-muted-foreground mt-2">We rely on one or more lawful bases to process personal information, including:</p>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              <li>Performance of a contract (e.g., providing treatment and appointments).</li>
              <li>Compliance with legal and regulatory obligations.</li>
              <li>Consent where required (for optional marketing or analytics cookies).</li>
              <li>Legitimate interests (for example, improving services, fraud prevention and ensuring clinic safety).</li>
            </ul>
          </div>

          <div>
            <h2 className="font-medium">5. Sharing and data processors</h2>
            <p className="text-sm text-muted-foreground mt-2">We may share personal information with trusted third-party service providers who perform services on our behalf, such as appointment and record management, email delivery, analytics and IT hosting. We require these providers to implement appropriate security measures and to process data only on our instructions.</p>
          </div>

          <div>
            <h2 className="font-medium">6. Security</h2>
            <p className="text-sm text-muted-foreground mt-2">We implement administrative, technical and physical safeguards to protect personal information, including access controls, encryption in transit, secure backups and staff training. While we strive to protect your data, no system is completely secure — if you believe your information has been compromised, contact us immediately at <a href={`mailto:${CLINIC.email}`} className="underline">{CLINIC.email}</a>.</p>
          </div>

          <div>
            <h2 className="font-medium">7. Data retention</h2>
            <p className="text-sm text-muted-foreground mt-2">We retain personal and clinical records for periods required by law and professional guidance. For adults, medical and dental records are typically retained for a minimum of seven years; for children, records are retained until a period after they reach adulthood as required by local rules. Operational logs, backups and anonymised datasets are retained in line with our operational needs.</p>
          </div>

          <div>
            <h2 className="font-medium">8. Your rights and choices</h2>
            <p className="text-sm text-muted-foreground mt-2">Subject to local law, you may have rights to access, correct, object to or request deletion of your personal information. You can also withdraw consent for marketing or analytics cookies at any time via the cookie banner or by contacting us at <a href={`mailto:${CLINIC.email}`} className="underline">{CLINIC.email}</a>. We may require proof of identity before fulfilling certain requests.</p>
          </div>

          <div>
            <h2 className="font-medium">9. Cookies</h2>
            <p className="text-sm text-muted-foreground mt-2">We use cookies and similar technologies for essential site functionality and, with your consent, for analytics and marketing. You can manage your preferences using the cookie banner. Examples of cookie categories:</p>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              <li><strong>Necessary:</strong> required for the site and booking functionality.</li>
              <li><strong>Analytics:</strong> anonymous data used to improve the site.</li>
              <li><strong>Marketing:</strong> used for personalised messages and offers when you consent.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-medium">10. Children's privacy</h2>
            <p className="text-sm text-muted-foreground mt-2">Our website and services are not intended for children under 16. If you believe a child has provided us with personal information, contact us and we will take steps to remove it.</p>
          </div>

          <div>
            <h2 className="font-medium">11. Automated decision-making and research</h2>
            <p className="text-sm text-muted-foreground mt-2">We do not make medical decisions solely by automated means. We may use anonymised or aggregated data for internal reporting, service improvement and research, with appropriate safeguards.</p>
          </div>

          <div>
            <h2 className="font-medium">12. How to complain</h2>
            <p className="text-sm text-muted-foreground mt-2">If you are unhappy with how we handle your personal information, please contact us at <a href={`mailto:${CLINIC.email}`} className="underline">{CLINIC.email}</a>. You may also have the right to complain to your local data protection authority (for example, in Nigeria you can contact the National Information Technology Development Agency or another relevant regulator).</p>
          </div>

          <div>
            <h2 className="font-medium">13. Changes to this policy</h2>
            <p className="text-sm text-muted-foreground mt-2">We may update this policy. When we do, we will publish the updated policy on this page and revise the effective date above.</p>
          </div>

          <div>
            <h2 className="font-medium">14. Contact</h2>
            <p className="text-sm text-muted-foreground mt-2">If you have questions about this policy or wish to exercise your data rights, contact us at <a href={`mailto:${CLINIC.email}`} className="underline">{CLINIC.email}</a> or by post at {CLINIC.address}.</p>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

// Component intentionally not exported as default to allow route code-splitting
