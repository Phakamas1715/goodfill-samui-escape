import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ============================================================================
// Types & Constants
// ============================================================================

const ROLES = ["admin", "staff", "expert", "partner", "user"] as const;
type Role = (typeof ROLES)[number];

const BOOKING_STATUSES = ["pending", "accepted", "rejected", "completed", "redeemed", "cancelled"] as const;
type BookingStatus = (typeof BOOKING_STATUSES)[number];

const STATUS_LABELS: Record<BookingStatus, { th: string; en: string }> = {
  pending: { th: "รอดำเนินการ", en: "Pending" },
  accepted: { th: "ยอมรับแล้ว", en: "Accepted" },
  rejected: { th: "ปฏิเสธแล้ว", en: "Rejected" },
  completed: { th: "เสร็จสิ้น", en: "Completed" },
  redeemed: { th: "ใช้แล้ว", en: "Redeemed" },
  cancelled: { th: "ยกเลิกแล้ว", en: "Cancelled" },
};

// ============================================================================
// Helper Functions
// ============================================================================

async function assertAdminOrStaff(supabase: any, userId: string, options?: { requireAdmin?: boolean }) {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);

  if (error) {
    console.error("[assertAdminOrStaff] Database error:", error);
    throw new Error("Unable to verify user permissions");
  }

  const roles = (data ?? []).map((r: any) => r.role as string);

  if (options?.requireAdmin && !roles.includes("admin")) {
    throw new Error("forbidden: admin role required");
  }

  if (!roles.includes("admin") && !roles.includes("staff")) {
    throw new Error("forbidden: admin or staff role required");
  }

  return roles;
}

function logAction(action: string, userId: string, details?: any) {
  console.log(`[${new Date().toISOString()}] ${action} - User: ${userId}`, details || "");
}

// ============================================================================
// User Roles Functions
// ============================================================================

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);

      const roles = (data ?? []).map((r: any) => r.role as string);
      logAction("getMyRoles", context.userId, { roles });
      return roles;
    } catch (error) {
      console.error("[getMyRoles] Error:", error);
      return [];
    }
  });

// ============================================================================
// Bookings Functions
// ============================================================================

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    logAction("listBookings", context.userId);

    const { data, error } = await context.supabase
      .from("bookings")
      .select(
        `
        *,
        programs:program_id (
          name,
          duration,
          price
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("[listBookings] Database error:", error);
      throw new Error(error.message);
    }

    return data ?? [];
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(BOOKING_STATUSES),
        notes: z.string().max(1000).optional(),
        notifyCustomer: z.boolean().default(true),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    logAction("updateBookingStatus", context.userId, { bookingId: data.id, status: data.status });

    const update: any = {
      status: data.status,
      updated_at: new Date().toISOString(),
    };
    if (data.notes !== undefined) update.partner_notes = data.notes;

    const { error } = await context.supabase.from("bookings").update(update).eq("id", data.id);

    if (error) {
      console.error("[updateBookingStatus] Database error:", error);
      throw new Error(error.message);
    }

    // TODO: Send notification to customer if notifyCustomer is true
    if (data.notifyCustomer) {
      // await sendBookingStatusNotification(data.id, data.status);
    }

    return {
      ok: true,
      status: data.status,
      statusLabel: STATUS_LABELS[data.status]?.th || data.status,
    };
  });

// ============================================================================
// Programs Functions
// ============================================================================

const ProgramImageSchema = z.object({
  path: z.string().min(1).max(500),
  url: z.string().min(1).max(2000),
  alt: z.string().max(300).optional().nullable(),
});

const ProgramInput = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(200),
  name_en: z.string().max(200).optional(),
  name_th: z.string().max(200).optional(),
  tagline: z.string().max(300).nullable().optional(),
  tagline_en: z.string().max(300).nullable().optional(),
  tagline_th: z.string().max(300).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  description_en: z.string().max(5000).nullable().optional(),
  description_th: z.string().max(5000).nullable().optional(),
  duration: z.string().min(1).max(100),
  price: z.number().min(0).max(10_000_000),
  currency: z.string().max(8).default("THB"),
  image_url: z.string().max(2000).nullable().optional(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
  images: z.array(ProgramImageSchema).max(20).optional(),
});

export const listPrograms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    logAction("listPrograms", context.userId);

    const { data, error } = await context.supabase
      .from("programs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[listPrograms] Database error:", error);
      throw new Error(error.message);
    }

    return data ?? [];
  });

export const upsertProgram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ProgramInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    logAction("upsertProgram", context.userId, { slug: data.slug, id: data.id });

    if (data.id) {
      const { id, ...rest } = data;
      const { error } = await context.supabase.from("programs").update(rest as never).eq("id", id);

      if (error) {
        console.error("[upsertProgram] Update error:", error);
        throw new Error(error.message);
      }
      return { ok: true, id };
    }

    const { id: _omit, ...rest } = data;
    const { data: ins, error } = await context.supabase.from("programs").insert(rest as never).select("id").single();

    if (error) {
      console.error("[upsertProgram] Insert error:", error);
      throw new Error(error.message);
    }

    return { ok: true, id: ins.id as string };
  });

export const deleteProgram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    logAction("deleteProgram", context.userId, { programId: data.id });

    const { error } = await context.supabase.from("programs").delete().eq("id", data.id);

    if (error) {
      console.error("[deleteProgram] Database error:", error);
      throw new Error(error.message);
    }

    return { ok: true };
  });

// ============================================================================
// Settings Functions
// ============================================================================

export const listSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);

    const { data, error } = await context.supabase
      .from("app_config")
      .select("key, value, description, updated_at")
      .order("key");

    if (error) {
      console.error("[listSettings] Database error:", error);
      throw new Error(error.message);
    }

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
    logAction("upsertSetting", context.userId, { key: data.key });

    const { error } = await context.supabase.from("app_config").upsert({
      key: data.key,
      value: data.value as any,
      description: data.description ?? null,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[upsertSetting] Database error:", error);
      throw new Error(error.message);
    }

    return { ok: true };
  });

// ============================================================================
// Users & Roles Functions
// ============================================================================

export const listUsersWithRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);
    logAction("listUsersWithRoles", context.userId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [usersResult, rolesResult, linesResult] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 200 }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("line_identities").select("user_id, line_user_id, channel, display_name"),
    ]);

    const users = usersResult.data?.users ?? [];
    const roles = rolesResult.data ?? [];
    const lines = linesResult.data ?? [];

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      updated_at: u.updated_at,
      roles: roles.filter((r: any) => r.user_id === u.id).map((r: any) => r.role as string),
      line: lines.filter((l: any) => l.user_id === u.id),
    }));
  });

export const assignRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(ROLES),
        grant: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const callerRoles = await assertAdminOrStaff(context.supabase, context.userId);

    // Only admins can grant or revoke the admin role
    if (data.role === "admin" && !callerRoles.includes("admin")) {
      throw new Error("forbidden: only admins can manage the admin role");
    }

    logAction("assignRole", context.userId, {
      targetUserId: data.userId,
      role: data.role,
      grant: data.grant,
    });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });

      if (error) {
        console.error("[assignRole] Grant error:", error);
        throw new Error(error.message);
      }
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);

      if (error) {
        console.error("[assignRole] Revoke error:", error);
        throw new Error(error.message);
      }
    }

    return { ok: true };
  });

// ============================================================================
// Dashboard Stats Functions
// ============================================================================

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdminOrStaff(context.supabase, context.userId);

    const { data: bookings } = await context.supabase.from("bookings").select("status, program_price, created_at");

    const today = new Date().toISOString().slice(0, 10);
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());

    const todayBookings = (bookings ?? []).filter((b: any) => b.created_at?.slice(0, 10) === today);

    const thisWeekBookings = (bookings ?? []).filter(
      (b: any) => b.created_at?.slice(0, 10) >= thisWeekStart.toISOString().slice(0, 10),
    );

    const revenue = (bookings ?? []).reduce((sum: number, b: any) => sum + (b.program_price || 0), 0);
    const thisWeekRevenue = thisWeekBookings.reduce((sum: number, b: any) => sum + (b.program_price || 0), 0);

    return {
      totalBookings: bookings?.length || 0,
      todayBookings: todayBookings.length,
      thisWeekBookings: thisWeekBookings.length,
      pendingBookings: (bookings ?? []).filter((b: any) => b.status === "pending").length,
      totalRevenue: revenue,
      thisWeekRevenue,
      statusDistribution: (bookings ?? []).reduce((acc: Record<string, number>, b: any) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      }, {}),
    };
  });
