import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ── Check if any admin user exists ───────────────────────────────────────────
export const setupStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    // List all auth users — if none exist, setup is needed
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw new Error(error.message);
    const needsSetup = data.users.length === 0;
    return { needsSetup };
  });

// ── Create the first admin user ───────────────────────────────────────────────
export const setupFirstAdmin = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    }).parse(d)
  )
  .handler(async ({ data }) => {
    // Guard: only allow this if no users exist yet
    const { data: existing, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw new Error(listError.message);
    if (existing.users.length > 0) {
      throw new Error("Setup already complete.");
    }

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // skip email confirmation for the bootstrap user
    });

    if (error) throw new Error(error.message);
    const userId = created.user?.id;
    if (!userId) throw new Error("Failed to create admin user.");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });

    if (roleError) {
      const isDuplicateRole =
        roleError.code === "23505" || roleError.message.toLowerCase().includes("duplicate");
      if (!isDuplicateRole) {
        await supabaseAdmin.auth.admin.deleteUser(userId);
        throw new Error(roleError.message);
      }
    }

    return { ok: true };
  });
