import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendEmail } from "@/lib/email"

const ADMIN_EMAIL = (process.env.ADMIN_NOTIFICATION_EMAIL ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

const bookingSchema = z.object({
  service_id: z.string().uuid(),
  patient_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferred_time: z.string().min(3).max(20),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export const listServicesPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("id,name,slug,description,price_ngn,duration_min,icon,sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const submitBooking = createServerFn({ method: "POST" })
  .validator((d: unknown) => bookingSchema.parse(d))
  .handler(async ({ data }) => {
    const { data: svc, error: sErr } = await supabaseAdmin
      .from("services")
      .select("id,name,price_ngn")
      .eq("id", data.service_id)
      .eq("active", true)
      .maybeSingle();
    if (sErr) throw new Error(sErr.message);
    if (!svc) throw new Error("Selected service is not available.");

    // Upsert patient by phone
    const { data: existing } = await supabaseAdmin
      .from("patients")
      .select("id,visit_count")
      .eq("phone", data.phone)
      .maybeSingle();

    let patientId: string;
    if (existing) {
      patientId = existing.id;
      await supabaseAdmin
        .from("patients")
        .update({
          name: data.patient_name,
          email: data.email || null,
          visit_count: (existing.visit_count ?? 0) + 1,
        })
        .eq("id", patientId);
    } else {
      const { data: ins, error: pErr } = await supabaseAdmin
        .from("patients")
        .insert({
          name: data.patient_name,
          phone: data.phone,
          email: data.email || null,
          visit_count: 1,
        })
        .select("id")
        .single();
      if (pErr) throw new Error(pErr.message);
      patientId = ins.id;
    }

    const { error: bErr } = await supabaseAdmin.from("bookings").insert({
      service_id: svc.id,
      patient_id: patientId,
      patient_name: data.patient_name,
      phone: data.phone,
      email: data.email || null,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      notes: data.notes || "",
      price_ngn: svc.price_ngn,
      status: "pending",
    });
    if (bErr) throw new Error(bErr.message);

     sendEmail({
      to: ADMIN_EMAIL,
      subject: `New booking - ${data.patient_name} (${data.preferred_date})`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <h2 style="font-size:20px;font-weight:600;margin-bottom:4px;">
            New appointment booked
          </h2>
          <p style="color:#666;font-size:14px;margin-top:0;">
            A new appointment has been submitted and is awaiting confirmation.
          </p>

          <table style="width:100%;border-collapse:collapse;margin-top:24px;font-size:14px;">
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px 0;color:#999;width:140px;">Patient</td>
              <td style="padding:10px 0;font-weight:500;">${data.patient_name}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px 0;color:#999;">Phone</td>
              <td style="padding:10px 0;">${data.phone}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px 0;color:#999;">Email</td>
              <td style="padding:10px 0;">${data.email || "—"}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px 0;color:#999;">Service</td>
              <td style="padding:10px 0;">${svc.name}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px 0;color:#999;">Date</td>
              <td style="padding:10px 0;">${data.preferred_date}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:10px 0;color:#999;">Time</td>
              <td style="padding:10px 0;">${data.preferred_time}</td>
            </tr>
            ${data.notes ? `
            <tr>
              <td style="padding:10px 0;color:#999;">Notes</td>
              <td style="padding:10px 0;">${data.notes}</td>
            </tr>` : ''}
          </table>

          <div style="margin-top:28px;">
            <a
              href="${process.env.VITE_PUBLIC_SITE_URL ?? ''}/admin/bookings"
              style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:500;"
            >
              View in dashboard →
            </a>
          </div>

          <p style="margin-top:32px;font-size:12px;color:#bbb;">
            Odontal Dental Clinic · This is an automated notification.
          </p>
        </div>
      `,
    }).catch((err) => {
      // Log but don't throw — booking already succeeded
      console.error("[Admin notification email failed]", err)
    })

    return { ok: true, service: svc.name };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ email: z.string().trim().email().max(255) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert({ email: data.email.toLowerCase(), active: true }, { onConflict: "email" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const submitContact = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        name: z.string().trim().min(2).max(120),
        email: z.string().trim().email().max(255),
        phone: z.string().trim().max(30).optional().or(z.literal("")),
        message: z.string().trim().min(5).max(2000),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Reviews
export const submitReview = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        rating: z.number().int().min(1).max(5),
        reviewer_name: z.string().trim().min(1).max(120),
        title: z.string().trim().min(1).max(200),
        body: z.string().trim().min(5).max(2000),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("reviews").insert({
      rating: data.rating,
      reviewer_name: data.reviewer_name,
      title: data.title,
      body: data.body,
      created_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return { ok: true, message: "Thanks — your review will appear once approved." };
  });

export const listReviewsPublic = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({ page: z.number().int().min(0).optional().default(0), pageSize: z.number().int().min(1).max(100).optional().default(10) })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const page = data.page ?? 0;
    const pageSize = data.pageSize ?? 10;
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const [{ data: rows, error }, { count, error: cErr }] = await Promise.all([
      supabaseAdmin
        .from("reviews")
        .select("id,rating,reviewer_name,title,body,created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .range(from, to),
      supabaseAdmin.from("reviews").select("*", { count: "exact", head: true }).eq("approved", true),
    ]);
    if (error) throw new Error(error.message);
    if (cErr) throw new Error(cErr.message);
    return { data: rows ?? [], total: count ?? 0, page, pageSize };
  });

export const getDailyRandomReviews = createServerFn({ method: "GET" }).handler(async () => {
  const today = new Date().toISOString().slice(0, 10);
  const { data: existing, error: eErr } = await supabaseAdmin
    .from("daily_review_selection")
    .select("review_ids")
    .eq("day", today)
    .maybeSingle();
  if (eErr) throw new Error(eErr.message);
  let ids: string[] = [];
  if (existing?.review_ids && (existing.review_ids as string[]).length > 0) {
    ids = existing.review_ids as string[];
  } else {
    const { data: idsData, error: rErr } = await supabaseAdmin.rpc("get_random_review_ids", { _limit: 6 });
    if (rErr) throw new Error(rErr.message);
    const idsList = (idsData ?? []).map((r: any) => r.id);
    ids = idsList;
    if (ids.length > 0) {
      const { error: insErr } = await supabaseAdmin.from("daily_review_selection").insert({ day: today, review_ids: ids });
      if (insErr) throw new Error(insErr.message);
    } else {
      return [];
    }
  }
  const { data: reviews, error: revErr } = await supabaseAdmin
    .from("reviews")
    .select("id,rating,reviewer_name,title,body,created_at")
    .in("id", ids);
  if (revErr) throw new Error(revErr.message);
  const byId = new Map((reviews ?? []).map((r: any) => [r.id, r]));
  const ordered = ids.map((i) => byId.get(i)).filter(Boolean);
  return ordered;
});

