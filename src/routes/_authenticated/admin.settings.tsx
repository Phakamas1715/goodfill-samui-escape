import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listSettings, upsertSetting } from "@/lib/admin.functions";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Settings,
  Search,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Mail,
  MessageCircle,
  Users,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "System Settings | Goodfill Care Admin" },
      { name: "description", content: "จัดการการตั้งค่าระบบทั้งหมด" },
    ],
  }),
});

const categoryIcons: Record<string, any> = {
  general: Settings,
  notification: Bell,
  line: MessageCircle,
  payment: CreditCard,
  email: Mail,
  security: Shield,
  feature: Sparkles,
  user: Users,
};

const categoryLabels: Record<string, { th: string; en: string }> = {
  general: { th: "ทั่วไป", en: "General" },
  notification: { th: "การแจ้งเตือน", en: "Notifications" },
  line: { th: "LINE Integration", en: "LINE Integration" },
  payment: { th: "การชำระเงิน", en: "Payment" },
  email: { th: "อีเมล", en: "Email" },
  security: { th: "ความปลอดภัย", en: "Security" },
  feature: { th: "ฟีเจอร์", en: "Features" },
  user: { th: "ผู้ใช้", en: "Users" },
};

function getCategory(key: string): string {
  if (key.includes("line")) return "line";
  if (key.includes("email")) return "email";
  if (key.includes("payment") || key.includes("price")) return "payment";
  if (key.includes("notif")) return "notification";
  if (key.includes("security") || key.includes("auth")) return "security";
  if (key.includes("feature") || key.includes("enable")) return "feature";
  if (key.includes("user")) return "user";
  return "general";
}

function SettingsPage() {
  const fetchFn = useServerFn(listSettings);
  const saveFn = useServerFn(upsertSetting);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => fetchFn(),
    refetchInterval: 30000,
  });

  const save = useMutation({
    mutationFn: (input: { key: string; value: unknown; description?: string }) =>
      saveFn({ data: input }),
    onSuccess: (_, variables) => {
      toast.success(`บันทึก "${variables.key}" สำเร็จ`);
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["app_config"] });
    },
    onError: (e: any) => toast.error(e.message ?? "บันทึกไม่สำเร็จ"),
  });

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initial: Record<string, string> = {};
    (q.data ?? []).forEach((s: any) => {
      initial[s.key] = typeof s.value === "string" ? s.value : JSON.stringify(s.value, null, 2);
    });
    setDrafts(initial);
  }, [q.data]);

  function commit(key: string, original: any) {
    const raw = drafts[key] ?? "";
    let value: unknown = raw;
    if (typeof original !== "string") {
      try {
        value = JSON.parse(raw);
      } catch {
        toast.error("รูปแบบ JSON ไม่ถูกต้อง");
        return;
      }
    }
    save.mutate({ key, value });
    setSavedKeys((prev) => new Set(prev).add(key));
    setTimeout(() => {
      setSavedKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 2000);
  }

  function resetToOriginal(key: string, original: any) {
    const originalStr = typeof original === "string" ? original : JSON.stringify(original, null, 2);
    setDrafts({ ...drafts, [key]: originalStr });
    toast.info(`รีเซ็ต "${key}" แล้ว`);
  }

  // Filter settings by search query
  const filteredSettings = useMemo(() => {
    const settings = q.data ?? [];
    if (!searchQuery.trim()) return settings;
    const query = searchQuery.toLowerCase();
    return settings.filter(
      (s: any) =>
        s.key.toLowerCase().includes(query) ||
        (s.description && s.description.toLowerCase().includes(query)),
    );
  }, [q.data, searchQuery]);

  // Group settings by category
  const groupedSettings = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredSettings.forEach((s: any) => {
      const category = getCategory(s.key);
      if (!groups[category]) groups[category] = [];
      groups[category].push(s);
    });
    return groups;
  }, [filteredSettings]);

  const isLoading = q.isLoading;
  const isError = q.isError;
  const settingsCount = q.data?.length || 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-navy">ตั้งค่าระบบ</h1>
          <p className="text-sm text-muted-foreground mt-1">
            จัดการการตั้งค่าทั้งหมด มีผลทันทีหลังบันทึก
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-cream/50 rounded-xl px-3 py-1.5 text-center">
            <div className="text-xs text-muted-foreground">จำนวนตั้งค่า</div>
            <div className="text-sm font-semibold text-navy">{settingsCount} รายการ</div>
          </div>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ["admin", "settings"] })}
            className="p-2 rounded-full hover:bg-cream transition"
            title="รีเฟรช"
          >
            <RefreshCw size={18} className={q.isFetching ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="ค้นหาการตั้งค่า..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-mint/40 bg-white focus:outline-none focus:ring-2 focus:ring-emerald/40 text-sm"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <RefreshCw size={20} className="animate-spin" />
            กำลังโหลดการตั้งค่า...
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <div>
            <p className="text-sm font-medium text-red-700">เกิดข้อผิดพลาด</p>
            <p className="text-xs text-red-600">ไม่สามารถโหลดการตั้งค่าได้</p>
          </div>
        </div>
      )}

      {/* Settings by Category */}
      {!isLoading && !isError && Object.keys(groupedSettings).length === 0 && (
        <div className="text-center py-12 bg-cream/30 rounded-2xl">
          <Settings size={48} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">ไม่พบการตั้งค่าที่ค้นหา</p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-sm text-emerald hover:underline"
            >
              ล้างการค้นหา
            </button>
          )}
        </div>
      )}

      {!isLoading &&
        !isError &&
        Object.keys(groupedSettings).map((category) => {
          const Icon = categoryIcons[category] || Settings;
          const label = categoryLabels[category]?.th || category;
          const settings = groupedSettings[category];

          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-emerald/10 flex items-center justify-center">
                  <Icon size={14} className="text-emerald" />
                </div>
                <h2 className="font-semibold text-navy text-lg">{label}</h2>
                <span className="text-[10px] text-muted-foreground">{settings.length} รายการ</span>
              </div>

              <div className="space-y-3">
                {settings.map((s: any) => {
                  const isString = typeof s.value === "string";
                  const draftValue = drafts[s.key] ?? "";
                  const isModified =
                    draftValue !==
                    (typeof s.value === "string" ? s.value : JSON.stringify(s.value, null, 2));
                  const isJustSaved = savedKeys.has(s.key);

                  return (
                    <div
                      key={s.key}
                      className={`card-cream rounded-xl p-4 transition-all ${isModified ? "border-gold/50 bg-gold/5" : "border-mint/30"}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-mono text-[11px] font-semibold text-emerald bg-emerald/10 px-2 py-0.5 rounded">
                              {s.key}
                            </div>
                            {isJustSaved && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald">
                                <CheckCircle size={10} /> บันทึกแล้ว
                              </span>
                            )}
                            {isModified && !isJustSaved && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-gold">
                                <AlertCircle size={10} /> ยังไม่บันทึก
                              </span>
                            )}
                          </div>
                          {s.description && (
                            <div className="text-[11px] text-muted-foreground mt-1">
                              {s.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-muted-foreground bg-cream/50 px-1.5 py-0.5 rounded">
                            {isString ? "text" : "json"}
                          </span>
                        </div>
                      </div>

                      {isString ? (
                        <input
                          value={draftValue}
                          onChange={(e) => setDrafts({ ...drafts, [s.key]: e.target.value })}
                          className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-mint/30 focus:outline-none focus:ring-2 focus:ring-emerald/40"
                        />
                      ) : (
                        <textarea
                          value={draftValue}
                          onChange={(e) => setDrafts({ ...drafts, [s.key]: e.target.value })}
                          rows={4}
                          className="w-full bg-white rounded-lg px-3 py-2 text-xs font-mono border border-mint/30 focus:outline-none focus:ring-2 focus:ring-emerald/40"
                        />
                      )}

                      <div className="flex justify-end gap-2 mt-3">
                        {isModified && (
                          <button
                            onClick={() => resetToOriginal(s.key, s.value)}
                            className="rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-red-500 transition"
                          >
                            ยกเลิก
                          </button>
                        )}
                        <button
                          onClick={() => commit(s.key, s.value)}
                          disabled={save.isPending}
                          className="btn-emerald rounded-full px-4 py-1.5 text-xs inline-flex items-center gap-1 disabled:opacity-50"
                        >
                          <Save size={12} />
                          {save.isPending ? "กำลังบันทึก..." : "บันทึก"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* Footer Info */}
      <div className="text-center text-[10px] text-muted-foreground pt-4">
        การตั้งค่าทั้งหมดมีผลทันทีหลังบันทึก • ระบบจะอัปเดตอัตโนมัติ
      </div>
    </div>
  );
}
