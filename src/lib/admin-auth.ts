import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AdminRole = "admin" | "staff" | "receptionist";

export const STAFF_ROLES: readonly AdminRole[] = ["admin", "staff", "receptionist"];

function isDuplicateKeyError(error: { code?: string; message?: string }) {
  return error.code === "23505" || error.message?.toLowerCase().includes("duplicate");
}

export async function loadUserRoles(userId: string): Promise<AdminRole[]> {
  const { data, error } = await (supabaseAdmin as any)
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: any) => row.role as AdminRole);
}

export function requireAnyRole(
  roles: readonly AdminRole[],
  allowed: readonly AdminRole[] = STAFF_ROLES,
) {
  if (!roles.some((role) => allowed.includes(role))) throw new Error("Forbidden");
}

export function requireAdminRole(roles: readonly AdminRole[]) {
  requireAnyRole(roles, ["admin"]);
}

export async function ensureBootstrapAdminRole(userId: string): Promise<AdminRole[]> {
  const existingRoles = await loadUserRoles(userId);
  if (existingRoles.length > 0) return existingRoles;

  const { count, error: countError } = await (supabaseAdmin as any)
    .from("user_roles")
    .select("id", { count: "exact", head: true });
  if (countError) throw new Error(countError.message);
  if ((count ?? 0) > 0) return existingRoles;

  const { data: users, error: usersError } =
    await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 2 });
  if (usersError) throw new Error(usersError.message);

  const soleUser = users.users.length === 1 ? users.users[0] : null;
  if (soleUser?.id !== userId) return existingRoles;

  const { error: insertError } = await (supabaseAdmin as any)
    .from("user_roles")
    .insert({ user_id: userId, role: "admin" });

  if (insertError) {
    if (isDuplicateKeyError(insertError)) return loadUserRoles(userId);
    throw new Error(insertError.message);
  }

  return ["admin"];
}