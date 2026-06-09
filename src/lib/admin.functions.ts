import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdminOrStaff(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: any) => r.role as string);
  if (!roles.includes("admin") && !roles.includes("staff")) {
    throw new Error("forbidden: admin or staff role required");
  }
  return roles;
}

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    return (data ?? []).map((r: any) => r.role as string);
  });

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "accepted", "rejected", "completed", "redeemed", "cancelled"]),
        notes: z.string().max(1000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    const update: any = { status: data.status };
    if (data.notes !== undefined) update.partner_notes = data.notes;
    const { error } = await context.supabase.from("bookings").update(update).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listPrograms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("programs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const ProgramInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  tagline: z.string().max(300).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  duration: z.string().min(1).max(100),
  price: z.number().min(0).max(10_000_000),
  currency: z.string().max(8).default("THB"),
  image_url: z.string().max(2000).nullable().optional(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

export const upsertProgram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ProgramInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    if (data.id) {
      const { id, ...rest } = data;
      const { error } = await context.supabase.from("programs").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true, id };
    }
    const { id: _omit, ...rest } = data;
    const { data: ins, error } = await context.supabase
      .from("programs")
      .insert(rest)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: ins.id as string };
  });

export const deleteProgram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    const { error } = await context.supabase.from("programs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("app_config")
      .select("key,value,description,updated_at")
      .order("key");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        key: z.string().min(1).max(100),
        value: z.unknown(),
        description: z.string().max(500).nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    const { error } = await context.supabase.from("app_config").upsert({
      key: data.key,
      value: data.value as any,
      description: data.description ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listUsersWithRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id,role");
    const { data: lines } = await supabaseAdmin
      .from("line_identities")
      .select("user_id,line_user_id,channel,display_name");
    return (users?.users ?? []).map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      roles: (roles ?? []).filter((r: any) => r.user_id === u.id).map((r: any) => r.role as string),
      line: (lines ?? []).filter((l: any) => l.user_id === u.id),
    }));
  });

export const assignRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["admin", "staff", "user", "expert", "partner"]),
        grant: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role as any }, { onConflict: "user_id,role" });
    } else {
      await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role as any);
    }
    return { ok: true };
  });