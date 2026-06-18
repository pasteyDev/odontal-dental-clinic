import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function loadRoles(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.role as "admin" | "staff" | "receptionist");
}

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => loadRoles(context.userId));

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await loadRoles(context.userId);
    if (roles.length === 0) throw new Error("Forbidden: not staff");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const [{ data: all }, { count: subs }, { data: recent }] = await Promise.all([
      supabaseAdmin
        .from("bookings")
        .select("id,status,created_at,price_ngn,service_id,services(name)")
        .gte("created_at", monthAgo.toISOString())
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("bookings")
        .select("id,patient_name,phone,status,preferred_date,preferred_time,created_at,services(name)")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    const list = all ?? [];
    const todayCount = list.filter((b) => new Date(b.created_at) >= today).length;
    const weekCount = list.filter((b) => new Date(b.created_at) >= weekAgo).length;
    const pendingCount = list.filter((b) => b.status === "pending").length;
    const completedCount = list.filter((b) => b.status === "completed").length;
    const revenue = list
      .filter((b) => b.status === "completed")
      .reduce((s, b) => s + (b.price_ngn ?? 0), 0);

    // Bookings per day last 30
    const days: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        date: key.slice(5),
        count: list.filter((b) => b.created_at.slice(0, 10) === key).length,
      });
    }

    // By service
    const byService = new Map<string, number>();
    for (const b of list) {
      const name = (b as { services?: { name?: string } | null }).services?.name ?? "Unknown";
      byService.set(name, (byService.get(name) ?? 0) + 1);
    }
    const serviceData = Array.from(byService.entries()).map(([name, value]) => ({ name, value }));

    // By status
    const statusMap = new Map<string, number>();
    for (const b of list) statusMap.set(b.status, (statusMap.get(b.status) ?? 0) + 1);
    const statusData = Array.from(statusMap.entries()).map(([name, value]) => ({ name, value }));

    return {
      kpis: {
        todayCount,
        weekCount,
        pendingCount,
        completedCount,
        subscribers: subs ?? 0,
        revenue,
        total: list.length,
      },
      perDay: days,
      byService: serviceData,
      byStatus: statusData,
      recent: recent ?? [],
      roles,
    };
  });

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await loadRoles(context.userId);
    if (roles.length === 0) throw new Error("Forbidden");
    const { data, error } = await supabaseAdmin
      .from("bookings")
      .select("*,services(name,price_ngn)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    if (roles.length === 0) throw new Error("Forbidden");
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listPatients = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await loadRoles(context.userId);
    if (roles.length === 0) throw new Error("Forbidden");
    const { data, error } = await supabaseAdmin
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listSubscribers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await loadRoles(context.userId);
    if (roles.length === 0) throw new Error("Forbidden");
    const { data, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await loadRoles(context.userId);
    if (roles.length === 0) throw new Error("Forbidden");
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// Reviews moderation
export const listReviewsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await loadRoles(context.userId);
    if (roles.length === 0) throw new Error("Forbidden");
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const approveReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    if (!roles.includes("admin")) throw new Error("Admin only");
    const { error } = await supabaseAdmin
      .from("reviews")
      .update({ approved: true, approved_by: context.userId, approved_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const rejectReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    if (!roles.includes("admin")) throw new Error("Admin only");
    const { error } = await supabaseAdmin.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toggleMessageHandled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ id: z.string().uuid(), handled: z.boolean() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    if (roles.length === 0) throw new Error("Forbidden");
    const { error } = await supabaseAdmin
      .from("contact_messages")
      .update({ handled: data.handled })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAllServices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await loadRoles(context.userId);
    if (roles.length === 0) throw new Error("Forbidden");
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .order("sort_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string().min(2).max(120),
        slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
        description: z.string().max(800),
        price_ngn: z.number().int().min(0).max(10_000_000),
        duration_min: z.number().int().min(5).max(480),
        icon: z.string().max(40),
        active: z.boolean(),
        sort_order: z.number().int().min(0).max(999),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    if (!roles.includes("admin")) throw new Error("Admin only");
    const payload = { ...data, updated_at: new Date().toISOString() };
    if (data.id) {
      const { error } = await supabaseAdmin.from("services").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("services").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    if (!roles.includes("admin")) throw new Error("Admin only");
    const { error } = await supabaseAdmin.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await loadRoles(context.userId);
    if (!roles.includes("admin")) throw new Error("Admin only");
    const { data: ur, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id,role,created_at");
    if (error) throw new Error(error.message);
    const ids = Array.from(new Set((ur ?? []).map((r) => r.user_id)));
    const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    const byId = new Map(users.users.map((u) => [u.id, u.email]));
    const grouped = new Map<string, { email: string | undefined; roles: string[] }>();
    for (const id of ids) grouped.set(id, { email: byId.get(id) ?? undefined, roles: [] });
    for (const r of ur ?? []) grouped.get(r.user_id)?.roles.push(r.role);
    return Array.from(grouped.entries()).map(([user_id, v]) => ({ user_id, ...v }));
  });

export const inviteStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().min(8).max(72),
        role: z.enum(["admin", "staff", "receptionist"]),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    if (!roles.includes("admin")) throw new Error("Admin only");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    const userId = created.user?.id;
    if (!userId) throw new Error("Failed to create user");
    const { error: rErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: data.role });
    if (rErr) throw new Error(rErr.message);
    return { ok: true };
  });

export const updateStaffRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        user_id: z.string().uuid(),
        role: z.enum(["admin", "staff", "receptionist"]),
        add: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    if (!roles.includes("admin")) throw new Error("Admin only");
    if (data.add) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: data.user_id, role: data.role });
      if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.user_id)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const removeStaff = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ user_id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const roles = await loadRoles(context.userId);
    if (!roles.includes("admin")) throw new Error("Admin only");
    if (data.user_id === context.userId) throw new Error("You cannot remove yourself");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
    await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    return { ok: true };
  });
