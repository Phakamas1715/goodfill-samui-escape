import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppSettings = Record<string, unknown>;

export function useAppSettings() {
  return useQuery({
    queryKey: ["app_config"],
    queryFn: async (): Promise<AppSettings> => {
      const { data, error } = await supabase.from("app_config").select("key,value");
      if (error) return {};
      const map: AppSettings = {};
      (data ?? []).forEach((r: any) => {
        map[r.key] = r.value;
      });
      return map;
    },
    staleTime: 60_000,
  });
}

export function getSetting<T = unknown>(settings: AppSettings | undefined, key: string, fallback: T): T {
  if (!settings || !(key in settings)) return fallback;
  const v = settings[key];
  return (v ?? fallback) as T;
}