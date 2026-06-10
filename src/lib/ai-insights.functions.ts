import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ============================================================================
// Types & Schemas
// ============================================================================

const PersonaInsightInput = z.object({
  personaId: z.string().min(1),
  personaName: z.string().min(1),
  answers: z.record(z.string(), z.number()),
  lang: z.enum(["th", "en"]).default("th"),
});

const MealPlanInput = z.object({
  personaId: z.string().min(1),
  personaName: z.string().min(1),
  days: z.number().int().min(1).max(14).default(3),
  dietaryNotes: z.string().max(500).optional(),
  restrictions: z
    .array(z.enum(["vegetarian", "vegan", "pescatarian", "gluten-free", "dairy-free"]))
    .optional(),
  allergies: z.array(z.enum(["nuts", "seafood", "dairy", "eggs", "soy", "wheat"])).optional(),
  lang: z.enum(["th", "en"]).default("th"),
});

const WellnessTipInput = z.object({
  personaId: z.string().min(1),
  personaName: z.string().min(1),
  count: z.number().int().min(1).max(10).default(5),
  lang: z.enum(["th", "en"]).default("th"),
});

const ActivityPlanInput = z.object({
  personaId: z.string().min(1),
  personaName: z.string().min(1),
  days: z.number().int().min(1).max(7).default(3),
  energyLevel: z.enum(["low", "medium", "high"]).default("medium"),
  lang: z.enum(["th", "en"]).default("th"),
});

// Response validation schemas
const PersonaInsightResponse = z.object({
  summary: z.string().min(1).max(500),
  strengths: z.array(z.string().max(100)).min(1).max(5),
  focusAreas: z.array(z.string().max(100)).min(1).max(5),
  dailyRitual: z.array(z.string().max(100)).min(1).max(5),
  avoid: z.array(z.string().max(100)).min(1).max(5),
});

const MealPlanResponse = z.object({
  days: z
    .array(
      z.object({
        day: z.number().int(),
        breakfast: z.string().min(1).max(200),
        lunch: z.string().min(1).max(200),
        dinner: z.string().min(1).max(200),
        snack: z.string().max(200).optional(),
        hydration: z.string().max(200).optional(),
      }),
    )
    .min(1)
    .max(14),
  notes: z.string().max(500).optional(),
  nutritionalNotes: z.string().max(500).optional(),
});

// ============================================================================
// Helper Functions
// ============================================================================

function logAICall(action: string, input: any, durationMs?: number) {
  console.log(`[AI:${action}]`, {
    input: JSON.stringify(input).slice(0, 200),
    durationMs,
    timestamp: new Date().toISOString(),
  });
}

function logAIError(action: string, error: any, input: any) {
  console.error(`[AI:${action}] Error:`, {
    message: error.message,
    input: JSON.stringify(input).slice(0, 200),
    timestamp: new Date().toISOString(),
  });
}

async function callZAI(
  messages: Array<{ role: string; content: string }>,
  options?: { json?: boolean; model?: string; temperature?: number },
) {
  const startTime = Date.now();
  const key = process.env.Z_AI_API_KEY;

  if (!key) {
    throw new Error("Z_AI_API_KEY not configured in environment");
  }

  const model = options?.model || "glm-4.5-flash";
  const temperature = options?.temperature ?? 0.7;
  const json = options?.json ?? true;

  const res = await fetch("https://api.z.ai/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages,
      ...(json ? { response_format: { type: "json_object" } } : {}),
      temperature,
    }),
  });

  const duration = Date.now() - startTime;

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Z.AI API error (${res.status}): ${txt.slice(0, 200)}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content ?? "";

  if (!json) return { text: content, duration };

  try {
    const parsed = JSON.parse(content);
    return { data: parsed, duration };
  } catch (parseError) {
    throw new Error(`Failed to parse AI response as JSON: ${content.slice(0, 100)}`);
  }
}

function formatAnswersForPrompt(answers: Record<string, number>): string {
  return Object.entries(answers)
    .map(([qId, optionIdx]) => `Q${qId}:${optionIdx}`)
    .join(", ");
}

function formatDietaryNotes(notes?: string, restrictions?: string[], allergies?: string[]): string {
  const parts: string[] = [];
  if (notes) parts.push(`Notes: ${notes}`);
  if (restrictions?.length) parts.push(`Dietary restrictions: ${restrictions.join(", ")}`);
  if (allergies?.length) parts.push(`Allergies: ${allergies.join(", ")}`);
  return parts.length ? parts.join(" · ") : "None";
}

// ============================================================================
// Main AI Functions
// ============================================================================

export const getPersonaInsight = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => PersonaInsightInput.parse(d))
  .handler(async ({ data }) => {
    const startTime = Date.now();
    const langLabel = data.lang === "th" ? "ภาษาไทย" : "English";
    const formattedAnswers = formatAnswersForPrompt(data.answers);

    const systemPrompt = `You are a Goodfill Care wellness expert at Koh Samui, Thailand. 
Reply in ${langLabel} as compact JSON with these exact keys:
- summary: 1-2 sentences explaining the user's current state (max 200 chars)
- strengths: array of 3 short strings highlighting their wellness strengths (max 80 chars each)
- focusAreas: array of 3 short strings for key areas to improve (max 80 chars each)
- dailyRitual: array of 3 short strings for daily wellness rituals (max 80 chars each)
- avoid: array of 2-3 short strings of things to avoid (max 80 chars each)

Be compassionate, specific, and actionable. Use Thai-inspired wellness context.`;

    const userPrompt = `Persona: ${data.personaName} (ID: ${data.personaId})
Quest answers (questionId:optionIndex): ${formattedAnswers}

Provide a personalised wellness insight for an expert to fine-tune their care plan.`;

    try {
      const result = await callZAI([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      // Validate response structure
      const validated = PersonaInsightResponse.parse(result.data);
      logAICall(
        "getPersonaInsight",
        { personaId: data.personaId, lang: data.lang },
        Date.now() - startTime,
      );

      return validated;
    } catch (error) {
      logAIError("getPersonaInsight", error, { personaId: data.personaId });

      // Return fallback response
      const fallback =
        data.lang === "th"
          ? {
              summary: "คุณมีพื้นฐาน wellness ที่ดี แต่อาจต้องปรับจังหวะชีวิตให้สมดุลขึ้น",
              strengths: ["มีความตั้งใจดี", "เปิดรับการเปลี่ยนแปลง", "ใส่ใจสุขภาพ"],
              focusAreas: ["การนอนหลับ", "การจัดการความเครียด", "โภชนาการ"],
              dailyRitual: ["ดื่มน้ำอุ่นตอนเช้า", "เดินเล่น 15 นาที", "ฝึกหายใจลึกก่อนนอน"],
              avoid: ["อาหารแปรรูป", "นอนดึก", "เครียดสะสม"],
            }
          : {
              summary:
                "You have a good wellness foundation but may need more balance in daily life",
              strengths: ["Good intention", "Open to change", "Health conscious"],
              focusAreas: ["Sleep quality", "Stress management", "Nutrition"],
              dailyRitual: ["Warm water in morning", "15 min walk", "Deep breathing before bed"],
              avoid: ["Processed foods", "Late nights", "Accumulated stress"],
            };

      return fallback;
    }
  });

export const getMealPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => MealPlanInput.parse(d))
  .handler(async ({ data }) => {
    const startTime = Date.now();
    const langLabel = data.lang === "th" ? "ภาษาไทย" : "English";
    const dietaryInfo = formatDietaryNotes(data.dietaryNotes, data.restrictions, data.allergies);

    const systemPrompt = `You are a Goodfill Care nutritionist on Koh Samui, specializing in tropical wellness cuisine.
Reply in ${langLabel} as compact JSON with this structure:
{
  "days": [
    {
      "day": number,
      "breakfast": "string (max 100 chars)",
      "lunch": "string (max 100 chars)",
      "dinner": "string (max 100 chars)",
      "snack": "string (max 80 chars, optional)",
      "hydration": "string (max 80 chars, optional)"
    }
  ],
  "notes": "string (max 300 chars, optional)",
  "nutritionalNotes": "string (max 300 chars, optional)"
}

Use Thai-inspired clean tropical wellness food: fresh fruits, vegetables, lean proteins, herbs, and local superfoods.
Avoid overly restrictive diets unless specified. Keep meals balanced and enjoyable.`;

    const userPrompt = `Persona: ${data.personaName} (ID: ${data.personaId})
Number of days: ${data.days}
${dietaryInfo ? `Dietary information: ${dietaryInfo}` : ""}

Create a ${data.days}-day meal plan that supports this person's wellness journey.`;

    try {
      const result = await callZAI([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      const validated = MealPlanResponse.parse(result.data);
      logAICall(
        "getMealPlan",
        { personaId: data.personaId, days: data.days, lang: data.lang },
        Date.now() - startTime,
      );

      return validated;
    } catch (error) {
      logAIError("getMealPlan", error, { personaId: data.personaId, days: data.days });

      // Return fallback meal plan
      const fallbackDays = Array.from({ length: data.days }, (_, i) => ({
        day: i + 1,
        breakfast: data.lang === "th" ? "สมูทตี้ผลไม้ + ข้าวโอ๊ต" : "Fruit smoothie + oatmeal",
        lunch:
          data.lang === "th"
            ? "สลัดผัก + ปลาย่าง + ข้าวกล้อง"
            : "Garden salad + grilled fish + brown rice",
        dinner:
          data.lang === "th" ? "ซุปผัก + ไก่ย่างสมุนไพร" : "Vegetable soup + herb-grilled chicken",
        snack: data.lang === "th" ? "ผลไม้สด" : "Fresh fruits",
        hydration: data.lang === "th" ? "น้ำมะพร้าว + ชาสมุนไพร" : "Coconut water + herbal tea",
      }));

      return {
        days: fallbackDays,
        notes:
          data.lang === "th"
            ? "ดื่มน้ำ 2-3 ลิตรต่อวัน หลีกเลี่ยงน้ำตาลและอาหารแปรรูป"
            : "Drink 2-3 liters of water daily. Avoid sugar and processed foods.",
        nutritionalNotes:
          data.lang === "th"
            ? "ปริมาณแคลอรี่ประมาณ 1,500-1,800 ต่อวัน เหมาะสำหรับการฟื้นฟูร่างกาย"
            : "Approximately 1,500-1,800 calories per day, suitable for body recovery",
      };
    }
  });

export const getWellnessTips = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => WellnessTipInput.parse(d))
  .handler(async ({ data }) => {
    const langLabel = data.lang === "th" ? "ภาษาไทย" : "English";

    const systemPrompt = `You are a Goodfill Care wellness coach. Reply in ${langLabel} as JSON: { "tips": ["tip1", "tip2", ...] }.
Each tip should be actionable, specific to ${data.personaName} persona, and max 120 chars.`;

    const userPrompt = `Persona: ${data.personaName} (ID: ${data.personaId})
Provide ${data.count} daily wellness tips for someone with this persona.`;

    try {
      const result = await callZAI([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      return { tips: result.data.tips || [], count: result.data.tips?.length || 0 };
    } catch (error) {
      logAIError("getWellnessTips", error, { personaId: data.personaId });

      const fallbackTips =
        data.lang === "th"
          ? ["ดื่มน้ำทันทีที่ตื่นนอน", "ยืดเส้นยืดสายทุกชั่วโมง", "หายใจลึก 5 ครั้งก่อนนอน"]
          : [
              "Drink water immediately upon waking",
              "Stretch every hour",
              "Take 5 deep breaths before sleep",
            ];

      return {
        tips: fallbackTips.slice(0, data.count),
        count: Math.min(fallbackTips.length, data.count),
      };
    }
  });

export const getActivityPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ActivityPlanInput.parse(d))
  .handler(async ({ data }) => {
    const langLabel = data.lang === "th" ? "ภาษาไทย" : "English";
    const energyLabel =
      data.energyLevel === "low"
        ? "low energy / gentle"
        : data.energyLevel === "high"
          ? "high energy / active"
          : "moderate energy / balanced";

    const systemPrompt = `You are a Goodfill Care wellness activity planner. Reply in ${langLabel} as JSON:
{ "days": [ { "day": number, "activities": ["activity1", "activity2", ...] } ], "notes": "string" }
Each activity max 60 chars. Use Koh Samui context (yoga, meditation, beach walks, spa, etc.).`;

    const userPrompt = `Persona: ${data.personaName} (ID: ${data.personaId})
Energy level: ${energyLabel}
Number of days: ${data.days}
Create a ${data.days}-day activity plan combining rest and wellness activities.`;

    try {
      const result = await callZAI([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      return result.data;
    } catch (error) {
      logAIError("getActivityPlan", error, { personaId: data.personaId });

      const fallbackDays = Array.from({ length: data.days }, (_, i) => ({
        day: i + 1,
        activities:
          data.lang === "th"
            ? ["โยคะตอนเช้า", "เดินเล่นชายหาด", "นั่งสมาธิ 15 นาที", "สปาเบาๆ"]
            : ["Morning yoga", "Beach walk", "15 min meditation", "Light spa"],
      }));

      return {
        days: fallbackDays,
        notes:
          data.lang === "th"
            ? "ปรับตามพลังงานของคุณในแต่ละวัน"
            : "Adjust based on your daily energy",
      };
    }
  });
