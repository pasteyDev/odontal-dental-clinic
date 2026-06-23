
# Odontal Dental Clinic — Website + Admin CRM

## Design direction
- Palette: Soft Blush Smile — cream/blush + sky blue, coral accent. Warm, family-friendly, gentle medical feel.
- Tokens defined in `src/styles.css` (oklch). Generous whitespace, rounded-2xl cards, soft shadows, subtle motion.
- Typography: warm serif headings + clean sans body.

## Public marketing site (routes)
- `/` Home — hero (clinic photo + tagline + "Book Appointment"), trust strip (5★ Google), services preview, why-choose, testimonials carousel from real reviews, location/hours, FAQ, newsletter CTA.
- `/about` — story, team approach, environment, location context.
- `/services` — full services + pricing cards (Checkup, Scaling & Polishing, Tooth Filling, Extraction, Teeth Whitening, Restorative, Implant Consultation, Children's Dentistry). Placeholder NGN prices used since none provided — clearly editable from admin.
- `/book` — multi-step form: service → preferred date/time → patient details (name, phone, email, notes) → confirm. Shows pricing as guide. Creates a booking request (status: pending).
- `/contact` — address, phone (0807 105 6340), hours, embedded Google Map, contact form.
- `/faq` — expanded FAQ.

Per-route SEO `head()` with unique title/description/og. JSON-LD `Dentist` schema on home.

## Newsletter
- Footer + dedicated section form (email). Stored in `newsletter_subscribers`. Double-opt-in not needed for v1; simple confirmation toast.

## Backend (Supabase Cloud)
Tables:
- `services` (id, name, description, price_ngn, duration_min, active, sort_order)
- `bookings` (id, service_id, patient_name, phone, email, preferred_date, preferred_time, notes, status [pending/confirmed/completed/cancelled], created_at, assigned_to)
- `patients` (id, name, phone, email unique, first_seen, notes) — auto-upserted from bookings by email/phone
- `newsletter_subscribers` (id, email unique, subscribed_at, active)
- `contact_messages` (id, name, email, phone, message, created_at, handled)
- `app_role` enum: `admin`, `staff`, `receptionist`
- `user_roles` (user_id, role) with `has_role()` SECURITY DEFINER function

RLS: public can INSERT bookings/newsletter/contact; only authenticated staff can SELECT/UPDATE. Services SELECT public; INSERT/UPDATE admin only.

Auth: email/password via Supabase. Login at `/admin/login`. First admin seeded via SQL.

## Admin panel (`/admin/*`, protected by `_authenticated` layout + role check)
- `/admin` Dashboard — KPI cards (bookings today, pending, this week, newsletter subscribers, completion rate), recent bookings table, mini charts (bookings/day last 30d, by service, by status) using Recharts.
- `/admin/bookings` — sortable/filterable table, status updates, assign to staff, detail drawer.
- `/admin/patients` — searchable list, history per patient.
- `/admin/services` — CRUD pricing and services (admin role only).
- `/admin/newsletter` — subscriber list, CSV export, compose section (copy-to-clipboard email body for v1; no sending).
- `/admin/messages` — contact form submissions inbox.
- `/admin/staff` — admin-only, manage user roles.
- `/admin/analytics` — deeper charts: funnel (visit→book→confirm→complete), service revenue (using listed prices), busiest days/hours.

Roles:
- `admin`: full access incl. services/staff/analytics
- `staff` (dentist): bookings, patients, messages
- `receptionist`: bookings, newsletter, messages (no patient clinical notes edit)

## Technical notes
- TanStack Start file-based routes; `_authenticated/` layout for admin gate, child `beforeLoad` hydrates Supabase session before loaders.
- Server fns (`createServerFn` + `requireSupabaseAuth`) for all admin reads/writes. Public booking/newsletter submit via server fns using `supabaseAdmin` with Zod validation + simple in-memory rate limit per IP.
- `attachSupabaseAuth` middleware in `src/start.ts`.
- Charts: Recharts. Tables: shadcn `table` + tanstack-table for sorting/filtering.
- Images: generated hero (clinic-like, on-brand blush/sky), service icons, about photo.
- WhatsApp/phone click-to-call links throughout.

## Out of scope (v1)
- Online payments (request-only flow confirmed)
- Automated email sending (no provider configured; admin sees requests and calls/emails patients manually). Can add Resend later.
- SMS reminders

## What I'll use as placeholder pricing (editable in admin)
Checkup ₦10,000 · Scaling & Polishing ₦25,000 · Tooth Filling ₦20,000 · Extraction ₦15,000 · Whitening ₦60,000 · Restorative (from) ₦35,000 · Implant Consultation ₦15,000 · Children's Checkup ₦8,000.
