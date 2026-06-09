import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

// ============================================================================
// Types
// ============================================================================

export type AppSettings = Record<string, unknown>;

export interface AppConfigRow {
  key: string;
  value: unknown;
  description?: string | null;
  updated_at?: string;
}

// Known setting keys for type safety
export type SettingKey =
  | "site_name"
  | "site_description"
  | "contact_email"
  | "contact_phone"
  | "line_oa_link"
  | "telegram_bot_link"
  | "facebook_url"
  | "instagram_url"
  | "default_language"
  | "enable_ai_features"
  | "enable_telegram_bot"
  | "enable_line_bot"
  | "maintenance_mode"
  | "maintenance_message"
  | "calm_credits_per_checkin"
  | "calm_credits_per_habit"
  | "max_upload_size_mb"
  | "booking_advance_days"
  | "max_booking_guests";

// Type mapping for settings
export interface SettingTypes {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  line_oa_link: string;
  telegram_bot_link: string;
  facebook_url: string;
  instagram_url: string;
  default_language: "th" | "en";
  enable_ai_features: boolean;
  enable_telegram_bot: boolean;
  enable_line_bot: boolean;
  maintenance_mode: boolean;
  maintenance_message: string;
  calm_credits_per_checkin: number;
  calm_credits_per_habit: number;
  max_upload_size_mb: number;
  booking_advance_days: number;
  max_booking_guests: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

function parseSettingValue<T>(value: unknown, fallback: T): T {
  if (value === undefined || value === null) return fallback;

  // Handle boolean strings
  if (typeof fallback === "boolean") {
    if (value === "true" || value === "1") return true as T;
    if (value === "false" || value === "0") return false as T;
    return Boolean(value) as T;
  }

  // Handle numbers
  if (typeof fallback === "number") {
    const num = Number(value);
    return (isNaN(num) ? fallback : num) as T;
  }

  return value as T;
}

// ============================================================================
// Main Hook
// ============================================================================

interface UseAppSettingsOptions extends Omit<UseQueryOptions<AppSettings>, "queryKey" | "queryFn"> {
  enableRealtime?: boolean;
}

export function useAppSettings(options: UseAppSettingsOptions = {}) {
  const { enableRealtime = true, ...queryOptions } = options;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["app_config"],
    queryFn: async (): Promise<AppSettings> => {
      const { data, error } = await supabase.from("app_config").select("key, value").order("key");

      if (error) {
        console.error("[useAppSettings] Failed to fetch settings:", error);
        return {};
      }

      const map: AppSettings = {};
      (data ?? []).forEach((row: AppConfigRow) => {
        map[row.key] = row.value;
      });

      return map;
    },
    staleTime: 60_000, // 1 minute
    gcTime: 300_000, // 5 minutes
    ...queryOptions,
  });

  // Set up real-time subscription for settings changes
  useEffect(() => {
    if (!enableRealtime) return;

    const channel = supabase
      .channel("app_config_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "app_config",
        },
        () => {
          // Refetch settings when any change occurs
          queryClient.invalidateQueries({ queryKey: ["app_config"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enableRealtime, queryClient]);

  return query;
}

// ============================================================================
// Type-Safe Getters
// ============================================================================

export function getSetting<T extends SettingKey>(
  settings: AppSettings | undefined,
  key: T,
  fallback: SettingTypes[T],
): SettingTypes[T] {
  if (!settings || !(key in settings)) {
    return fallback;
  }
  const value = settings[key];
  return parseSettingValue(value, fallback) as SettingTypes[T];
}

// Convenience getters with sensible defaults
export function getSiteName(settings: AppSettings | undefined): string {
  return getSetting(settings, "site_name", "Goodfill Care");
}

export function getSiteDescription(settings: AppSettings | undefined): string {
  return getSetting(settings, "site_description", "Wellness Journey on Koh Samui");
}

export function getContactEmail(settings: AppSettings | undefined): string {
  return getSetting(settings, "contact_email", "admin@goodfillcare-samui.com");
}

export function getContactPhone(settings: AppSettings | undefined): string {
  return getSetting(settings, "contact_phone", "094-595-8741");
}

export function getLineOALink(settings: AppSettings | undefined): string {
  return getSetting(settings, "line_oa_link", "https://line.me/R/ti/p/@goodfillcare");
}

export function getTelegramBotLink(settings: AppSettings | undefined): string {
  return getSetting(settings, "telegram_bot_link", "https://t.me/goodfillcare_bot");
}

export function getDefaultLanguage(settings: AppSettings | undefined): "th" | "en" {
  return getSetting(settings, "default_language", "th");
}

export function isAiEnabled(settings: AppSettings | undefined): boolean {
  return getSetting(settings, "enable_ai_features", true);
}

export function isTelegramBotEnabled(settings: AppSettings | undefined): boolean {
  return getSetting(settings, "enable_telegram_bot", true);
}

export function isLineBotEnabled(settings: AppSettings | undefined): boolean {
  return getSetting(settings, "enable_line_bot", true);
}

export function isMaintenanceMode(settings: AppSettings | undefined): boolean {
  return getSetting(settings, "maintenance_mode", false);
}

export function getMaintenanceMessage(settings: AppSettings | undefined): string {
  return getSetting(settings, "maintenance_message", "ระบบกำลังปรับปรุง กรุณากลับมาใหม่อีกครั้ง");
}

export function getCalmCreditsPerCheckin(settings: AppSettings | undefined): number {
  return getSetting(settings, "calm_credits_per_checkin", 20);
}

export function getCalmCreditsPerHabit(settings: AppSettings | undefined): number {
  return getSetting(settings, "calm_credits_per_habit", 5);
}

export function getMaxUploadSizeMB(settings: AppSettings | undefined): number {
  return getSetting(settings, "max_upload_size_mb", 5);
}

export function getBookingAdvanceDays(settings: AppSettings | undefined): number {
  return getSetting(settings, "booking_advance_days", 7);
}

export function getMaxBookingGuests(settings: AppSettings | undefined): number {
  return getSetting(settings, "max_booking_guests", 8);
}

// ============================================================================
// Hook with typed settings
// ============================================================================

export function useTypedAppSettings() {
  const { data: settings, isLoading, error, refetch } = useAppSettings();

  return {
    settings,
    isLoading,
    error,
    refetch,
    // Typed getters
    siteName: getSiteName(settings),
    siteDescription: getSiteDescription(settings),
    contactEmail: getContactEmail(settings),
    contactPhone: getContactPhone(settings),
    lineOALink: getLineOALink(settings),
    telegramBotLink: getTelegramBotLink(settings),
    facebookUrl: getSetting(settings, "facebook_url", ""),
    instagramUrl: getSetting(settings, "instagram_url", ""),
    defaultLanguage: getDefaultLanguage(settings),
    enableAiFeatures: isAiEnabled(settings),
    enableTelegramBot: isTelegramBotEnabled(settings),
    enableLineBot: isLineBotEnabled(settings),
    maintenanceMode: isMaintenanceMode(settings),
    maintenanceMessage: getMaintenanceMessage(settings),
    calmCreditsPerCheckin: getCalmCreditsPerCheckin(settings),
    calmCreditsPerHabit: getCalmCreditsPerHabit(settings),
    maxUploadSizeMB: getMaxUploadSizeMB(settings),
    bookingAdvanceDays: getBookingAdvanceDays(settings),
    maxBookingGuests: getMaxBookingGuests(settings),
  };
}

// ============================================================================
// Helper Components
// ============================================================================

interface SettingGuardProps {
  setting: SettingKey;
  fallback?: unknown;
  children: React.ReactNode;
}

export function SettingGuard({ setting, fallback, children }: SettingGuardProps) {
  const { data: settings } = useAppSettings();
  const value = getSetting(settings, setting, fallback);

  if (!value) return null;
  return <>{children}</>;
}

interface FeatureFlagProps {
  feature: "ai" | "telegram" | "line";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureFlag({ feature, children, fallback = null }: FeatureFlagProps) {
  const { data: settings } = useAppSettings();

  const isEnabled = (() => {
    switch (feature) {
      case "ai":
        return isAiEnabled(settings);
      case "telegram":
        return isTelegramBotEnabled(settings);
      case "line":
        return isLineBotEnabled(settings);
      default:
        return false;
    }
  })();

  return isEnabled ? <>{children}</> : <>{fallback}</>;
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  useAppSettings,
  useTypedAppSettings,
  getSetting,
  SettingGuard,
  FeatureFlag,
  // Convenience getters
  getSiteName,
  getSiteDescription,
  getContactEmail,
  getContactPhone,
  getLineOALink,
  getTelegramBotLink,
  getDefaultLanguage,
  isAiEnabled,
  isTelegramBotEnabled,
  isLineBotEnabled,
  isMaintenanceMode,
  getCalmCreditsPerCheckin,
  getCalmCreditsPerHabit,
  getMaxUploadSizeMB,
  getBookingAdvanceDays,
  getMaxBookingGuests,
};
