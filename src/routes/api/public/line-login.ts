import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/public/line-login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const startTime = Date.now();

        // Parse request body
        let body: { id_token?: string; channel_id?: string };
        try {
          body = await request.json();
        } catch (err) {
          console.error("[line-login] Invalid JSON:", err);
          return new Response("Invalid JSON", { status: 400 });
        }

        const { id_token, channel_id } = body;

        // Validate required fields
        if (!id_token || !channel_id) {
          console.warn("[line-login] Missing required fields");
          return new Response("Missing id_token or channel_id", { status: 400 });
        }

        // SECURITY: derive channel server-side from channel_id against an allowlist
        const customerChannelId = process.env.LINE_CUSTOMER_CHANNEL_ID;
        const partnerChannelId = process.env.LINE_PARTNER_CHANNEL_ID;

        let channel: "customer" | "partner";
        if (partnerChannelId && channel_id === partnerChannelId) {
          channel = "partner";
        } else if (customerChannelId && channel_id === customerChannelId) {
          channel = "customer";
        } else {
          console.error("[line-login] Unknown channel_id:", { channel_id });
          return new Response("Authentication failed", { status: 401 });
        }

        // Verify ID token with LINE
        const form = new URLSearchParams({ id_token, client_id: channel_id });

        let verifyRes: Response;
        try {
          verifyRes = await fetch("https://api.line.me/oauth2/v2.1/verify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: form.toString(),
          });
        } catch (err) {
          console.error("[line-login] LINE verification request failed:", err);
          return new Response("LINE service unavailable", { status: 503 });
        }

        if (!verifyRes.ok) {
          const text = await verifyRes.text().catch(() => "");
          console.error("[line-login] LINE verification failed:", verifyRes.status, text.slice(0, 500));
          return new Response("Authentication failed", { status: 401 });
        }

        let claims: { sub: string; name?: string; picture?: string; email?: string };
        try {
          claims = await verifyRes.json();
        } catch (err) {
          console.error("[line-login] Failed to parse LINE response:", err);
          return new Response("Invalid LINE response", { status: 500 });
        }

        const lineUserId = claims.sub;
        if (!lineUserId) {
          console.error("[line-login] No user ID in LINE claims");
          return new Response("Authentication failed", { status: 401 });
        }

        // Validate environment variables
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.SUPABASE_URL;
        const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY;

        if (!serviceKey || !supabaseUrl || !anonKey) {
          console.error("[line-login] Missing Supabase configuration");
          return new Response("Server configuration error", { status: 500 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Generate deterministic password for this LINE user
        const password = createHash("sha256").update(`${serviceKey}:line:${channel}:${lineUserId}`).digest("hex");

        // Clean LINE user ID for email
        const cleanId = lineUserId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const email = `line-${channel}-${cleanId}@goodfill.local`;

        // Check if user already exists
        let userId: string | undefined;

        try {
          const { data: existing, error: findError } = await supabaseAdmin
            .from("line_identities")
            .select("user_id")
            .eq("line_user_id", lineUserId)
            .eq("channel", channel)
            .maybeSingle();

          if (findError) {
            console.error("[line-login] Database query error:", findError);
            return new Response("Database error", { status: 500 });
          }

          userId = existing?.user_id as string | undefined;
        } catch (err) {
          console.error("[line-login] Database error:", err);
          return new Response("Database error", { status: 500 });
        }

        // Create or update user
        try {
          if (!userId) {
            const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
              email,
              password,
              email_confirm: true,
              user_metadata: {
                line_user_id: lineUserId,
                channel,
                name: claims.name,
                picture: claims.picture,
                login_method: "line",
                created_at: new Date().toISOString(),
              },
            });

            if (createErr || !created?.user) {
              console.error("[line-login] User creation failed:", createErr);
              return new Response("Failed to create user", { status: 500 });
            }

            userId = created.user.id;

            const { error: insertError } = await supabaseAdmin.from("line_identities").insert({
              user_id: userId,
              line_user_id: lineUserId,
              channel,
              display_name: claims.name ?? null,
              picture_url: claims.picture ?? null,
              email: claims.email ?? null,
              last_login_at: new Date().toISOString(),
            });

            if (insertError) {
              console.error("[line-login] Failed to insert identity:", insertError);
              // Continue anyway - user already created
            }

            console.log(`[line-login] New user created: ${userId} (${channel})`);
          } else {
            // Update existing user's last login
            const { error: updateError } = await supabaseAdmin
              .from("line_identities")
              .update({
                display_name: claims.name ?? null,
                picture_url: claims.picture ?? null,
                last_login_at: new Date().toISOString(),
              })
              .eq("user_id", userId)
              .eq("channel", channel);

            if (updateError) {
              console.error("[line-login] Failed to update identity:", updateError);
              // Non-critical, continue
            }

            console.log(`[line-login] Existing user logged in: ${userId} (${channel})`);
          }
        } catch (err) {
          console.error("[line-login] User operation error:", err);
          return new Response("User operation failed", { status: 500 });
        }

        // Create Supabase session
        let session;
        try {
          const sb = createClient(supabaseUrl, anonKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          });

          const { data: signed, error: signErr } = await sb.auth.signInWithPassword({
            email,
            password,
          });

          if (signErr || !signed.session) {
            console.error("[line-login] Session creation failed:", signErr);
            return new Response("Authentication failed", { status: 500 });
          }

          session = signed.session;
        } catch (err) {
          console.error("[line-login] Session error:", err);
          return new Response("Session creation failed", { status: 500 });
        }

        const duration = Date.now() - startTime;
        console.log(`[line-login] Success for ${channel} user ${lineUserId} (${duration}ms)`);

        return Response.json({
          success: true,
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          userId,
          channel,
          lineUserId,
          name: claims.name,
          picture: claims.picture,
          expires_at: session.expires_at,
        });
      },
    },
  },
});
