import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";

const searchSchema = z.object({
  redirect: z.string().optional(),
  channel: z.enum(["customer", "partner"]).optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: (s) => searchSchema.parse(s),
  ssr: false,
  component: LoginPage,
  head: () => ({ meta: [{ title: "เข้าสู่ระบบ — Goodfill Care" }] }),
});

function LoginPage() {
  const nav = useNavigate();
  const search = useSearch({ from: "/login" });
  const channel = search.channel ?? "customer";
  const liffId =
    channel === "partner"
      ? (import.meta.env.VITE_PARTNER_LIFF_ID as string)
      : (import.meta.env.VITE_LIFF_ID as string);
  const channelId = liffId?.split("-")[0];

  const [state, setState] = useState<"init" | "login" | "signing" | "done" | "error">("init");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!liffId) throw new Error("LIFF ID not configured");
        await liff.init({ liffId });
        if (cancelled) return;
        if (!liff.isLoggedIn()) {
          setState("login");
          liff.login({ redirectUri: window.location.href });
          return;
        }
        setState("signing");
        const idToken = liff.getIDToken();
        if (!idToken) throw new Error("ไม่พบ ID Token จาก LINE");
        const res = await fetch("/api/public/line-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken, channel_id: channelId, channel }),
        });
        if (!res.ok) throw new Error(await res.text());
        const { access_token, refresh_token } = (await res.json()) as {
          access_token: string;
          refresh_token: string;
        };
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error) throw error;
        if (cancelled) return;
        setState("done");
        const fallback = channel === "partner" ? "/admin" : "/";
        const target =
          search.redirect && search.redirect.startsWith("/") ? search.redirect : fallback;
        nav({ to: target });
      } catch (e) {
        if (cancelled) return;
        setState("error");
        setMsg(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [liffId, channelId, channel, nav, search.redirect]);

  // Helper to render status content
  const renderStatus = () => {
    switch (state) {
      case "init":
        return (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-gold" />
            <span className="text-base md:text-lg text-navy/80">กำลังเริ่มต้น LIFF…</span>
          </div>
        );
      case "login":
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 md:size-14 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="size-3 md:size-4 rounded-full bg-green-500 animate-pulse" />
            </div>
            <span className="text-base md:text-lg text-navy/80">กำลังเปิดหน้า LINE Login…</span>
          </div>
        );
      case "signing":
        return (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-gold" />
            <span className="text-base md:text-lg text-navy/80">กำลังตรวจสอบตัวตน…</span>
          </div>
        );
      case "done":
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 md:size-14 rounded-full bg-emerald/20 flex items-center justify-center">
              <Sparkles size={24} className="text-emerald" />
            </div>
            <span className="text-base md:text-lg text-emerald font-medium">
              สำเร็จ! กำลังนำทาง…
            </span>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="size-12 md:size-14 rounded-full bg-coral/20 flex items-center justify-center">
              <span className="text-2xl text-coral">⚠️</span>
            </div>
            <span className="text-sm md:text-base text-coral text-center">{msg}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 md:p-8 bg-gradient-to-br from-cream via-white to-cream">
      <div className="card-cream rounded-2xl md:rounded-3xl p-6 md:p-10 max-w-md w-full shadow-xl border border-white/50">
        {/* Logo / Brand */}
        <div className="flex justify-center mb-4">
          <div className="size-16 md:size-20 rounded-2xl bg-gradient-to-br from-emerald to-gold flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl md:text-3xl font-display font-bold">GC</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gold font-semibold mb-2">
            Goodfill Care
          </div>
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-navy mb-2 leading-tight">
            เข้าสู่ระบบด้วย LINE
          </h1>

          {/* Channel Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 mt-2 mb-5">
            <span className="text-[10px] md:text-[11px] uppercase tracking-wider text-gold font-semibold">
              {channel === "partner" ? "Partner OA" : "Customer OA"}
            </span>
          </div>

          {/* Status Area — larger and clearer */}
          <div className="min-h-[120px] md:min-h-[140px] flex items-center justify-center">
            {renderStatus()}
          </div>

          {/* Error Action */}
          {state === "error" && (
            <div className="mt-6 space-y-3">
              <button
                onClick={() => location.reload()}
                className="btn-gold rounded-full px-6 py-3 text-sm md:text-base font-semibold inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles size={16} />
                ลองใหม่
              </button>
              <div className="p-4 bg-coral/5 rounded-xl border border-coral/20 mt-4">
                <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
                  💡 หน้านี้ใช้งานได้ในแอป LINE เท่านั้น
                  <br />
                  (สแกน QR หรือเปิดผ่าน Rich Menu)
                </p>
              </div>
            </div>
          )}

          {/* Loading hint for non-error states */}
          {state !== "error" && state !== "done" && (
            <div className="mt-6 pt-4 border-t border-mint/30">
              <p className="text-[10px] md:text-[11px] text-muted-foreground">
                กำลังเชื่อมต่อกับ LINE OA{channel === "partner" ? " (Partner)" : ""}…
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
