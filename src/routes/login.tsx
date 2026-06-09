import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

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
        const target = search.redirect && search.redirect.startsWith("/") ? search.redirect : fallback;
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-cream">
      <div className="card-cream rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <div className="text-[11px] tracking-[0.2em] uppercase text-emerald mb-2">Goodfill Care</div>
        <h1 className="font-display text-3xl text-navy mb-4">เข้าสู่ระบบด้วย LINE</h1>
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Channel</div>
        <div className="text-sm text-emerald font-medium mb-4">
          {channel === "partner" ? "Partner OA" : "Customer OA"}
        </div>
        <p className="text-sm text-muted-foreground min-h-[2.5rem]">
          {state === "init" && "กำลังเริ่มต้น LIFF…"}
          {state === "login" && "กำลังเปิดหน้า LINE Login…"}
          {state === "signing" && "กำลังตรวจสอบตัวตน…"}
          {state === "done" && "สำเร็จ! กำลังพาไปหน้า Admin…"}
          {state === "error" && `ผิดพลาด: ${msg}`}
        </p>
        {state === "error" && (
          <div className="mt-4 space-y-2">
            <button
              onClick={() => location.reload()}
              className="btn-gold rounded-full px-5 py-2 text-sm"
            >
              ลองใหม่
            </button>
            <p className="text-[11px] text-muted-foreground">
              💡 หน้านี้ใช้งานได้ในแอป LINE เท่านั้น (สแกน QR หรือเปิดผ่าน Rich Menu)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}