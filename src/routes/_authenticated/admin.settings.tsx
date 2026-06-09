import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listSettings, upsertSetting } from "@/lib/admin.functions";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const fetchFn = useServerFn(listSettings);
  const saveFn = useServerFn(upsertSetting);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "settings"], queryFn: () => fetchFn() });

  const save = useMutation({
    mutationFn: (input: { key: string; value: unknown; description?: string }) => saveFn({ data: input }),
    onSuccess: () => {
      toast.success("บันทึกแล้ว");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["app_config"] });
    },
    onError: (e: any) => toast.error(e.message ?? "ผิดพลาด"),
  });

  const [drafts, setDrafts] = useState<Record<string, string>>({});
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
      try { value = JSON.parse(raw); } catch { toast.error("JSON ไม่ถูกต้อง"); return; }
    }
    save.mutate({ key, value });
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-3xl text-navy">Settings</h1>
        <p className="text-sm text-muted-foreground">ตั้งค่าระบบ — มีผลทันทีหลังกดบันทึก</p>
      </header>
      <div className="space-y-3">
        {(q.data ?? []).map((s: any) => {
          const isString = typeof s.value === "string";
          return (
            <div key={s.key} className="card-cream rounded-2xl p-4">
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <div>
                  <div className="font-mono text-xs text-emerald">{s.key}</div>
                  <div className="text-xs text-muted-foreground">{s.description ?? ""}</div>
                </div>
                <span className="text-[10px] text-muted-foreground">{isString ? "text" : "json"}</span>
              </div>
              {isString ? (
                <input
                  value={drafts[s.key] ?? ""}
                  onChange={(e) => setDrafts({ ...drafts, [s.key]: e.target.value })}
                  className="w-full bg-ivory rounded-lg px-3 py-2 text-sm border border-mint/30"
                />
              ) : (
                <textarea
                  value={drafts[s.key] ?? ""}
                  onChange={(e) => setDrafts({ ...drafts, [s.key]: e.target.value })}
                  rows={4}
                  className="w-full bg-ivory rounded-lg px-3 py-2 text-xs font-mono border border-mint/30"
                />
              )}
              <div className="flex justify-end mt-2">
                <button onClick={() => commit(s.key, s.value)} className="btn-gold rounded-full px-4 py-1.5 text-xs">บันทึก</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}