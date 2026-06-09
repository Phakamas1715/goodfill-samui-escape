// routeTree.gen.ts - This file is auto-generated. Do not edit manually.
// Import this file to get type-safe routing helpers.

import { rootRoute } from "./routes/__root";
import { routeTree as generatedRouteTree } from "./routeTree.gen";

// ============================================================================
// Type-safe Route Path Builder
// ============================================================================

export type RoutePath =
  | "/"
  | "/booking-success"
  | "/care"
  | "/channel"
  | "/consent"
  | "/detox"
  | "/expert"
  | "/journey"
  | "/login"
  | "/login/customer"
  | "/login/partner"
  | "/partner"
  | "/partners"
  | "/persona"
  | "/quest"
  | "/report"
  | "/sitemap.xml"
  | "/admin"
  | "/admin/bookings"
  | "/admin/line"
  | "/admin/programs"
  | "/admin/reviews"
  | "/admin/settings"
  | "/admin/users"
  | "/meals/$id"
  | "/programs/$id"
  | "/programs"
  | "/api/public/line-login"
  | "/api/public/line/customer-webhook"
  | "/api/public/line/partner-webhook"
  | "/api/public/telegram/webhook";

// ============================================================================
// Route Parameter Types
// ============================================================================

export interface RouteParams {
  "/meals/$id": { id: string };
  "/programs/$id": { id: string };
}

// ============================================================================
// Build Route Path with Parameters
// ============================================================================

export function buildRoutePath<T extends keyof RouteParams>(route: T, params: RouteParams[T]): string;
export function buildRoutePath(route: Exclude<RoutePath, keyof RouteParams>): string;
export function buildRoutePath(route: RoutePath, params?: Record<string, string>): string {
  if (!params) return route;

  let path = route;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`$${key}`, value);
  }
  return path;
}

// ============================================================================
// Type-safe Navigation Helpers
// ============================================================================

export const routes = {
  home: () => "/" as const,
  bookingSuccess: () => "/booking-success" as const,
  care: () => "/care" as const,
  channel: () => "/channel" as const,
  consent: () => "/consent" as const,
  detox: () => "/detox" as const,
  expert: () => "/expert" as const,
  journey: () => "/journey" as const,
  login: () => "/login" as const,
  loginCustomer: () => "/login/customer" as const,
  loginPartner: () => "/login/partner" as const,
  partner: () => "/partner" as const,
  partners: () => "/partners" as const,
  persona: () => "/persona" as const,
  quest: () => "/quest" as const,
  report: () => "/report" as const,
  sitemap: () => "/sitemap.xml" as const,
  admin: {
    index: () => "/admin" as const,
    bookings: () => "/admin/bookings" as const,
    line: () => "/admin/line" as const,
    programs: () => "/admin/programs" as const,
    reviews: () => "/admin/reviews" as const,
    settings: () => "/admin/settings" as const,
    users: () => "/admin/users" as const,
  },
  meals: {
    detail: (id: string) => buildRoutePath("/meals/$id", { id }) as const,
  },
  programs: {
    index: () => "/programs" as const,
    detail: (id: string) => buildRoutePath("/programs/$id", { id }) as const,
  },
  api: {
    lineLogin: () => "/api/public/line-login" as const,
    lineCustomerWebhook: () => "/api/public/line/customer-webhook" as const,
    linePartnerWebhook: () => "/api/public/line/partner-webhook" as const,
    telegramWebhook: () => "/api/public/telegram/webhook" as const,
  },
};

// ============================================================================
// Route Group Definitions
// ============================================================================

export const routeGroups = {
  public: [
    "/",
    "/booking-success",
    "/care",
    "/channel",
    "/consent",
    "/detox",
    "/expert",
    "/journey",
    "/login",
    "/login/customer",
    "/login/partner",
    "/partner",
    "/partners",
    "/persona",
    "/quest",
    "/report",
    "/sitemap.xml",
    "/meals/$id",
    "/programs/$id",
    "/programs",
  ],
  admin: [
    "/admin",
    "/admin/bookings",
    "/admin/line",
    "/admin/programs",
    "/admin/reviews",
    "/admin/settings",
    "/admin/users",
  ],
  api: [
    "/api/public/line-login",
    "/api/public/line/customer-webhook",
    "/api/public/line/partner-webhook",
    "/api/public/telegram/webhook",
  ],
} as const;

// ============================================================================
// Route Validation
// ============================================================================

export function isValidRoute(path: string): path is RoutePath {
  return (
    (routeGroups.public as readonly string[]).includes(path) ||
    (routeGroups.admin as readonly string[]).includes(path) ||
    (routeGroups.api as readonly string[]).includes(path)
  );
}

export function isAdminRoute(path: string): boolean {
  return routeGroups.admin.includes(path as any);
}

export function isApiRoute(path: string): boolean {
  return routeGroups.api.includes(path as any);
}

// ============================================================================
// Route Title Helper
// ============================================================================

export function getRouteTitle(path: RoutePath, lang: "th" | "en" = "th"): string {
  const titles: Record<RoutePath, { th: string; en: string }> = {
    "/": { th: "หน้าแรก", en: "Home" },
    "/booking-success": { th: "ยืนยันการจอง", en: "Booking Confirmed" },
    "/care": { th: "แผนดูแลต่อเนื่อง", en: "Care Plan" },
    "/channel": { th: "เลือกช่องทาง", en: "Select Channel" },
    "/consent": { th: "ความยินยอม", en: "Consent" },
    "/detox": { th: "ดีท็อกซ์", en: "Detox" },
    "/expert": { th: "ผู้เชี่ยวชาญ", en: "Expert" },
    "/journey": { th: "การเดินทาง", en: "Journey" },
    "/login": { th: "เข้าสู่ระบบ", en: "Login" },
    "/login/customer": { th: "เข้าสู่ระบบ", en: "Customer Login" },
    "/login/partner": { th: "เข้าสู่ระบบพาร์ทเนอร์", en: "Partner Login" },
    "/partner": { th: "พาร์ทเนอร์", en: "Partner" },
    "/partners": { th: "พันธมิตร", en: "Partners" },
    "/persona": { th: "บุคลิกภาพ", en: "Persona" },
    "/quest": { th: "แบบประเมิน", en: "Quest" },
    "/report": { th: "รายงาน", en: "Report" },
    "/sitemap.xml": { th: "Sitemap", en: "Sitemap" },
    "/admin": { th: "แผงควบคุม", en: "Admin Dashboard" },
    "/admin/bookings": { th: "จัดการการจอง", en: "Manage Bookings" },
    "/admin/line": { th: "LINE Rich Menu", en: "LINE Rich Menu" },
    "/admin/programs": { th: "จัดการโปรแกรม", en: "Manage Programs" },
    "/admin/reviews": { th: "จัดการรีวิว", en: "Manage Reviews" },
    "/admin/settings": { th: "ตั้งค่าระบบ", en: "System Settings" },
    "/admin/users": { th: "จัดการผู้ใช้", en: "Manage Users" },
    "/meals/$id": { th: "แผนอาหาร", en: "Meal Plan" },
    "/programs/$id": { th: "รายละเอียดโปรแกรม", en: "Program Details" },
    "/programs": { th: "โปรแกรมทั้งหมด", en: "All Programs" },
    "/api/public/line-login": { th: "LINE Login API", en: "LINE Login API" },
    "/api/public/line/customer-webhook": { th: "LINE Webhook", en: "LINE Webhook" },
    "/api/public/line/partner-webhook": { th: "LINE Partner Webhook", en: "LINE Partner Webhook" },
    "/api/public/telegram/webhook": { th: "Telegram Webhook", en: "Telegram Webhook" },
  };

  return titles[path]?.[lang] || path;
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  routes,
  routeGroups,
  isValidRoute,
  isAdminRoute,
  isApiRoute,
  getRouteTitle,
  buildRoutePath,
};
