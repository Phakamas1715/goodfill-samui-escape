import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

export const Route = createFileRoute("/api/public/line-login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { id_token?: string; channel_id?: string; channel?: "customer" | "partner" };
        try {
          body = await request.json();
        } catch {
          return new Response("invalid json", { status: 400 });
        }
        const { id_token, channel_id, channel = "customer" } = body;
        if (!id_token || !channel_id) return new Response("missing id_token/channel_id", { status: 400 });
        if (channel !== "customer" && channel !== "partner") return new Response("bad channel", { status: 400 });

        const form = new URLSearchParams({ id_token, client_id: channel_id });
        const verifyRes = await fetch("https://api.line.me/oauth2/v2.1/verify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: form.toString(),
        });
        if (!verifyRes.ok) {
          const text = await verifyRes.text().catch(() => "");
          return new Response(`line verify failed: ${text.slice(0, 200)}`, { status: 401 });
        }
        const claims = (await verifyRes.json()) as { sub: string; name?: string; picture?: string };
        const lineUserId = claims.sub;
        if (!lineUserId) return new Response("no sub in token", { status: 401 });

        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceKey) return new Response("server misconfigured", { status: 500 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const password = createHash("sha256").update(`${serviceKey}:line:${channel}:${lineUserId}`).digest("hex");
        const cleanId = lineUserId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const email = `line-${channel}-${cleanId}@goodfill.local`;

        const { data: existing } = await supabaseAdmin
          .from("line_identities")
          .select("user_id")
          .eq("line_user_id", lineUserId)
          .eq("channel", channel)
          .maybeSingle();

        let userId = existing?.user_id as string | undefined;
        if (!userId) {
          const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { line_user_id: lineUserId, channel, name: claims.name, picture: claims.picture },
          });
          if (createErr || !created?.user) {
            return new Response(`create user failed: ${createErr?.message ?? "unknown"}`, { status: 500 });
          }
          userId = created.user.id;
          await supabaseAdmin.from("line_identities").insert({
            user_id: userId,
            line_user_id: lineUserId,
            channel,
            display_name: claims.name ?? null,
            picture_url: claims.picture ?? null,
          });
        } else {
          await supabaseAdmin
            .from("line_identities")
            .update({ display_name: claims.name ?? null, picture_url: claims.picture ?? null })
            .eq("user_id", userId)
            .eq("channel", channel);
        }

        return Response.json({ email, password, userId, channel, lineUserId, name: claims.name });
      },
    },
  },
});