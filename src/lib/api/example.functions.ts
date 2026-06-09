import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServerConfig } from "../config.server";

// ============================================================================
// Example 1: Simple greeting function
// ============================================================================
export const getGreeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(1).max(100) }))
  .handler(async ({ data }) => {
    try {
      const config = getServerConfig();
      return {
        success: true,
        greeting: `Hello, ${data.name}!`,
        mode: config.nodeEnv ?? "unknown",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[getGreeting] Error:", error);
      return {
        success: false,
        greeting: "Unable to process request",
        mode: "error",
        timestamp: new Date().toISOString(),
      };
    }
  });

// ============================================================================
// Example 2: Multi-language greeting
// ============================================================================
export const getLocalizedGreeting = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      lang: z.enum(["th", "en"]).default("th"),
    }),
  )
  .handler(async ({ data }) => {
    const messages = {
      th: {
        greeting: `สวัสดี, ${data.name}!`,
        welcome: "ยินดีต้อนรับสู่ Goodfill Care",
        note: "เราพร้อมดูแลสุขภาพคุณ",
      },
      en: {
        greeting: `Hello, ${data.name}!`,
        welcome: "Welcome to Goodfill Care",
        note: "We're here for your wellness journey",
      },
    };

    const t = messages[data.lang];

    return {
      success: true,
      greeting: t.greeting,
      welcome: t.welcome,
      note: t.note,
      timestamp: new Date().toISOString(),
    };
  });

// ============================================================================
// Example 3: User profile validation (server-side)
// ============================================================================
const profileSchema = z.object({
  userId: z.string().uuid(),
  displayName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]+$/)
    .optional(),
  preferences: z
    .object({
      language: z.enum(["th", "en"]).default("th"),
      notifications: z.boolean().default(true),
      timezone: z.string().default("Asia/Bangkok"),
    })
    .optional(),
});

export const validateAndUpdateProfile = createServerFn({ method: "POST" })
  .inputValidator(profileSchema)
  .handler(async ({ data }) => {
    // This runs only on the server
    // You can access Supabase, databases, etc. here

    console.log(`[validateAndUpdateProfile] Updating profile for user: ${data.userId}`);

    // Simulate database update
    // const { error } = await supabaseAdmin
    //   .from("profiles")
    //   .update({ ...data })
    //   .eq("id", data.userId);

    // if (error) throw new Error(error.message);

    return {
      success: true,
      userId: data.userId,
      updatedAt: new Date().toISOString(),
      message: "Profile updated successfully",
    };
  });

// ============================================================================
// Example 4: Booking validation with error handling
// ============================================================================
const bookingSchema = z.object({
  programId: z.string().uuid(),
  customerId: z.string().uuid(),
  startDate: z.string().datetime(),
  duration: z.number().int().min(1).max(30),
  guests: z.number().int().min(1).max(10),
  specialRequests: z.string().optional(),
});

export const validateBooking = createServerFn({ method: "POST" })
  .inputValidator(bookingSchema)
  .handler(async ({ data }) => {
    const errors: string[] = [];

    // Server-side validation rules
    const startDate = new Date(data.startDate);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7); // Require at least 7 days advance

    if (startDate < minDate) {
      errors.push("Booking must be made at least 7 days in advance");
    }

    if (data.guests > 8) {
      errors.push("Maximum 8 guests per booking");
    }

    // Check program availability (simulated)
    const isAvailable = await checkAvailability(data.programId, data.startDate);
    if (!isAvailable) {
      errors.push("Program is not available for selected dates");
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
        message: "Booking validation failed",
      };
    }

    return {
      success: true,
      message: "Booking is valid",
      estimatedPrice: calculatePrice(data.programId, data.duration, data.guests),
    };
  });

// Helper functions (server-only)
async function checkAvailability(programId: string, startDate: Date): Promise<boolean> {
  // This would query your database
  console.log(`[checkAvailability] Checking availability for ${programId}`);
  return true; // Simulated
}

function calculatePrice(programId: string, duration: number, guests: number): number {
  // This would look up program pricing
  const basePrice = 15000;
  const durationMultiplier = duration / 3;
  return Math.round(basePrice * durationMultiplier * guests);
}

// ============================================================================
// Example 5: Paginated data fetching
// ============================================================================
const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["created_at", "name", "price"]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filter: z
    .object({
      status: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
    })
    .optional(),
});

export const fetchBookingsPaginated = createServerFn({ method: "POST" })
  .inputValidator(paginationSchema)
  .handler(async ({ data }) => {
    const offset = (data.page - 1) * data.limit;

    console.log(`[fetchBookingsPaginated] Page ${data.page}, Limit ${data.limit}`);

    // This would query your database with pagination
    // const { data: bookings, count } = await supabaseAdmin
    //   .from("bookings")
    //   .select("*", { count: "exact" })
    //   .order(data.sortBy, { ascending: data.sortOrder === "asc" })
    //   .range(offset, offset + data.limit - 1);

    // Simulated response
    const totalCount = 150;
    const totalPages = Math.ceil(totalCount / data.limit);

    return {
      success: true,
      data: [], // Would be actual booking data
      pagination: {
        page: data.page,
        limit: data.limit,
        totalCount,
        totalPages,
        hasNextPage: data.page < totalPages,
        hasPrevPage: data.page > 1,
      },
    };
  });

// ============================================================================
// Example 6: File upload handler (server-only)
// ============================================================================
const fileUploadSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().regex(/^image\/(jpeg|png|webp)$/),
  size: z
    .number()
    .int()
    .max(5 * 1024 * 1024), // 5MB max
  userId: z.string().uuid(),
});

export const validateFileUpload = createServerFn({ method: "POST" })
  .inputValidator(fileUploadSchema)
  .handler(async ({ data }) => {
    // Generate unique filename
    const timestamp = Date.now();
    const safeFilename = data.filename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .slice(0, 100);
    const uniqueFilename = `${timestamp}-${safeFilename}`;

    // Generate upload URL (e.g., to Supabase Storage)
    const uploadPath = `users/${data.userId}/images/${uniqueFilename}`;

    return {
      success: true,
      uploadUrl: `/api/upload/${uploadPath}`,
      fileKey: uploadPath,
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      message: "File validation successful, ready to upload",
    };
  });

// ============================================================================
// Example 7: Health check with system status
// ============================================================================
export const healthCheck = createServerFn({ method: "GET" }).handler(async () => {
  const config = getServerConfig();
  const startTime = Date.now();

  // Check database connectivity
  let dbStatus = "unknown";
  try {
    // await supabaseAdmin.from("_health").select("1").limit(1);
    dbStatus = "healthy";
  } catch {
    dbStatus = "unhealthy";
  }

  const responseTime = Date.now() - startTime;

  return {
    success: true,
    status: "operational",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    checks: {
      database: dbStatus,
      api: "healthy",
      storage: "healthy",
    },
    responseTimeMs: responseTime,
    version: "1.0.0",
  };
});
