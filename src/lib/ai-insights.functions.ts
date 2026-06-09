import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PersonaInsightInput = z.object({
  personaId: z.string(),
  personaName: z.string(),
  answers: z.record(z.string(), z.number()),
  lang: z.enum(["th", "en"]).default("th"),
});

const MealPlanInput = z.object({
  personaId: z.string(),
  personaName: z.string(),
  days: z.number().int().min(1).max(7).default(3),
  dietaryNotes: z.string().optional(),
  lang: z.enum(["th", "en"]).default("th"),
});

async function callZAI(messages: Array<{ role: string; content: string }>, json = true) {
  const key = process.env.Z_AI_API_KEY;
  if (!key) throw new Error("Z_AI_API_KEY not configured");
  const res = await fetch("https://api.z.ai/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "glm-4.5-flash",
      messages,
      ...(json ? { response_format: { type: "json_object" } } : {}),
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Z.AI ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content ?? "";
  if (!json) return { text: content };
  try {
    return JSON.parse(content);
  } catch {
    return { raw: content };
  }
}

export const getPersonaInsight = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PersonaInsightInput.parse(d))
  .handler(async ({ data }) => {
    const langLabel = data.lang === "th" ? "ภาษาไทย" : "English";
    const sys = `You are a Goodfill Care wellness expert at Koh Samui. Reply in ${langLabel} as compact JSON with keys: summary (1-2 sentences), strengths (array of 3 short strings), focusAreas (array of 3 short strings), dailyRitual (array of 3 short strings), avoid (array of 2-3 short strings). Keep each item under 90 chars.`;
    const usr = `Persona: ${data.personaName} (${data.personaId}). Quest answers (questionId:optionIndex): ${JSON.stringify(data.answers)}. Provide personalised wellness insight for an expert to fine-tune their care plan.`;
    return await callZAI([
      { role: "system", content: sys },
      { role: "user", content: usr },
    ]);
  });

export const getMealPlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => MealPlanInput.parse(d))
  .handler(async ({ data }) => {
    const langLabel = data.lang === "th" ? "ภาษาไทย" : "English";
    const sys = `You are a Goodfill Care nutritionist on Koh Samui. Reply in ${langLabel} as compact JSON: { "days": [ { "day": number, "breakfast": string, "lunch": string, "dinner": string, "snack": string, "hydration": string } ], "notes": string }. Use Thai-inspired clean tropical wellness food. Keep each meal description under 100 chars.`;
    const usr = `Persona: ${data.personaName} (${data.personaId}). Days: ${data.days}. Dietary notes: ${data.dietaryNotes ?? "none"}.`;
    return await callZAI([
      { role: "system", content: sys },
      { role: "user", content: usr },
    ]);
  });