// Goodfill Care — quest, personas, programs (static client data, bilingual)

import heroSamui from "@/assets/hero-samui.jpg";
import yoga from "@/assets/yoga-sunrise.jpg";
import spa from "@/assets/spa-treatment.jpg";
import food from "@/assets/wellness-food.jpg";
import villa from "@/assets/villa-pool.jpg";
import meditation from "@/assets/meditation.jpg";
import samuiAerial from "@/assets/samui-aerial.jpg";
import samuiInfinity from "@/assets/samui-infinity.jpg";
import samuiLongtail from "@/assets/samui-longtail.jpg";
import samuiSpaRitual from "@/assets/samui-spa-ritual.jpg";
import programReset from "@/assets/program-reset.jpg";
import programBalance from "@/assets/program-balance.jpg";
import programTransform from "@/assets/program-transform.jpg";
import mealBreakfast from "@/assets/meal-breakfast.jpg";
import mealLunch from "@/assets/meal-lunch.jpg";
import mealDinner from "@/assets/meal-dinner.jpg";

export const images = {
  heroSamui,
  yoga,
  spa,
  food,
  villa,
  meditation,
  samuiAerial,
  samuiInfinity,
  samuiLongtail,
  samuiSpaRitual,
  programReset,
  programBalance,
  programTransform,
  mealBreakfast,
  mealLunch,
  mealDinner,
} as const;

// ============================================================================
// Types
// ============================================================================

export type Lang = "th" | "en";
export type Bi<T = string> = { th: T; en: T };

export const pick = <T,>(b: Bi<T> | T, lang: Lang): T =>
  typeof b === "object" && b !== null && "th" in b && "en" in b ? b[lang] : (b as T);

export const pickList = <T,>(arr: (Bi<T> | T)[], lang: Lang): T[] => arr.map((item) => pick(item, lang));

export type PersonaId = "warrior" | "thinker" | "comfort" | "feeler" | "performer" | "explorer";

export interface Persona {
  id: PersonaId;
  name: Bi;
  thaiName: Bi;
  tagline: Bi;
  description: Bi;
  color: string;
  pillars: Bi[];
  icon?: string;
}

export interface Program {
  id: string;
  name: Bi;
  duration: Bi;
  nights: number;
  price: number;
  tagline: Bi;
  matches: PersonaId[];
  image: string;
  highlights: Bi[];
  schedule: { day: Bi; items: Bi[] }[];
  venue: Bi;
  gallery: string[];
  mealPlan: MealPlanDay[];
  expert: ExpertInfo;
}

export interface MealPlanDay {
  day: Bi;
  breakfast: Bi;
  lunch: Bi;
  dinner: Bi;
  note?: Bi;
}

export interface ExpertInfo {
  name: Bi;
  role: Bi;
}

// ============================================================================
// Helper: Create bilingual text
// ============================================================================

export const t = (th: string, en: string): Bi => ({ th, en });

// ============================================================================
// Personas Data
// ============================================================================

export const personas: Record<PersonaId, Persona> = {
  warrior: {
    id: "warrior",
    name: t("The Silent Warrior", "The Silent Warrior"),
    thaiName: t("นักสู้เงียบ", "Silent Warrior"),
    tagline: t(
      "ผู้รับผิดชอบสูง อดทน ดูแลทุกอย่างให้ดีที่สุด",
      "High responsibility, enduring, takes care of everyone.",
    ),
    description: t(
      "คุณเป็นคนรับผิดชอบสูง อดทน และพยายามดูแลทุกอย่างให้ดีที่สุด แต่ร่างกายอาจเริ่มสะสมความล้าโดยไม่รู้ตัว",
      "You're highly responsible and enduring, taking care of everything — but your body may be quietly accumulating fatigue.",
    ),
    color: "from-slate-500/30 to-emerald-700/30",
    pillars: [
      t("Executive Recovery", "Executive Recovery"),
      t("Deep Tissue Massage", "Deep Tissue Massage"),
      t("Sleep Restoration", "Sleep Restoration"),
      t("Adrenal Reset", "Adrenal Reset"),
    ],
  },
  thinker: {
    id: "thinker",
    name: t("The Midnight Thinker", "The Midnight Thinker"),
    thaiName: t("นกฮูกคิดมาก", "Midnight Owl"),
    tagline: t("คนคิดลึก วางแผนเก่ง ละเอียดรอบคอบ", "Deep thinker, strong planner, detail-oriented."),
    description: t(
      "คุณเป็นคนคิดลึก วางแผนเก่ง และละเอียดรอบคอบ แต่สมองที่ไม่ค่อยได้พัก อาจส่งผลต่อการนอนและความสดชื่นในแต่ละวัน",
      "You think deeply and plan carefully, but a mind that never rests can affect your sleep and daily energy.",
    ),
    color: "from-indigo-500/30 to-violet-700/30",
    pillars: [
      t("Sleep Recovery", "Sleep Recovery"),
      t("Nervous System Reset", "Nervous System Reset"),
      t("Mind Quieting", "Mind Quieting"),
      t("Breathwork", "Breathwork"),
    ],
  },
  comfort: {
    id: "comfort",
    name: t("The Comfort Seeker", "The Comfort Seeker"),
    thaiName: t("ผู้แสวงหาความสบายใจ", "Comfort Seeker"),
    tagline: t("เชื่อมอาหารกับอารมณ์อย่างสมดุล", "Reconnect food with emotion, in balance."),
    description: t(
      "คุณมักใช้ความอร่อย ความสบาย หรือสิ่งคุ้นเคยช่วยปลอบใจในวันที่เหนื่อย โปรแกรมจึงเน้นเชื่อมอาหารกับอารมณ์อย่างสมดุล",
      "You often turn to food, comfort, or the familiar on tough days. This program balances food and emotion gently.",
    ),
    color: "from-amber-500/30 to-rose-600/30",
    pillars: [
      t("Gut Health", "Gut Health"),
      t("Emotional Balance", "Emotional Balance"),
      t("Thai Herbal Nutrition", "Thai Herbal Nutrition"),
      t("Mindful Eating", "Mindful Eating"),
    ],
  },
  feeler: {
    id: "feeler",
    name: t("The Deep Feeler", "The Deep Feeler"),
    thaiName: t("ผู้รู้สึกลึก", "Deep Feeler"),
    tagline: t("คืนพื้นที่ให้ใจได้พักจริง ๆ", "Give your heart real space to rest."),
    description: t(
      "คุณรับรู้อารมณ์และรายละเอียดรอบตัวได้ลึก บางครั้งใช้พลังใจมากกว่าที่คิด โปรแกรมจึงคืนพื้นที่ให้ใจได้พักจริง ๆ",
      "You sense emotions and details deeply, often spending more emotional energy than you realize. This program returns space to your heart.",
    ),
    color: "from-violet-500/30 to-indigo-700/30",
    pillars: [
      t("Emotional Reset", "Emotional Reset"),
      t("Mindfulness", "Mindfulness"),
      t("Sound Healing", "Sound Healing"),
      t("Calm Balance", "Calm Balance"),
    ],
  },
  performer: {
    id: "performer",
    name: t("The High Performer", "The High Performer"),
    thaiName: t("เครื่องยนต์สมรรถนะสูง", "High Performer"),
    tagline: t("ฟื้นฟูเข้มข้นสำหรับคนใช้พลังงานสูง", "Intensive recovery for high-energy lives."),
    description: t(
      "คุณมีเป้าหมายชัดและใช้พลังงานสูง การเร่งต่อเนื่องทำให้ร่างกายต้องการการฟื้นฟูอย่างจริงจัง",
      "You're goal-driven and high-energy. Constant acceleration means your body needs serious recovery.",
    ),
    color: "from-rose-500/30 to-amber-600/30",
    pillars: [
      t("Executive Detox", "Executive Detox"),
      t("Energy Reset", "Energy Reset"),
      t("Premium Recovery", "Premium Recovery"),
      t("Performance Nutrition", "Performance Nutrition"),
    ],
  },
  explorer: {
    id: "explorer",
    name: t("The Wellness Explorer", "The Wellness Explorer"),
    thaiName: t("นักสำรวจสุขภาพ", "Wellness Explorer"),
    tagline: t("ระบบช่วยจัดลำดับว่าควรเริ่มจากอะไร", "A system that helps you decide where to begin."),
    description: t(
      "คุณพร้อมเริ่มดูแลตัวเองและเปิดรับสิ่งใหม่ ต้องการระบบที่ช่วยจัดลำดับให้ชัดว่าควรเริ่มจากอะไรก่อน",
      "You're ready to take better care of yourself and open to new things — you need a system that orders the first steps clearly.",
    ),
    color: "from-emerald-500/30 to-teal-600/30",
    pillars: [
      t("Wellness Discovery", "Wellness Discovery"),
      t("Samui Starter", "Samui Starter"),
      t("Personal Roadmap", "Personal Roadmap"),
      t("Habit Foundation", "Habit Foundation"),
    ],
  },
};

// ============================================================================
// Quest Data
// ============================================================================

export interface QuestOption {
  label: Bi;
  weights: Partial<Record<PersonaId, number>>;
}

export interface QuestQuestion {
  id: number;
  emoji: string;
  question: Bi;
  options: QuestOption[];
}

export const questions: QuestQuestion[] = [
  {
    id: 1,
    emoji: "☀️",
    question: t("พลังงานของคุณในเช้าวันใหม่เป็นแบบไหน?", "How is your energy on a new morning?"),
    options: [
      {
        label: t(
          "ตื่นมายังล้า ต้องพึ่งกาแฟหรือเครื่องดื่มช่วยเริ่มวัน",
          "Wake up tired — need coffee to start the day.",
        ),
        weights: { performer: 2, warrior: 2, comfort: 1 },
      },
      {
        label: t("เริ่มวันได้ดี แต่พลังงานตกเร็วช่วงบ่าย", "Start well, but energy drops in the afternoon."),
        weights: { performer: 2, thinker: 2 },
      },
      {
        label: t("อยากนอนต่อ รู้สึกว่ายังพักไม่พอ", "Want to keep sleeping — don't feel rested."),
        weights: { thinker: 2, feeler: 2 },
      },
      {
        label: t("พลังงานพอใช้ ค่อย ๆ เริ่มวันแบบไม่รีบ", "Enough energy — ease into the day."),
        weights: { explorer: 3 },
      },
    ],
  },
  {
    id: 2,
    emoji: "🌊",
    question: t("ช่วงนี้ความเครียดของคุณมักแสดงออกแบบไหน?", "How does your stress usually show up lately?"),
    options: [
      {
        label: t("รู้สึกแน่นในใจ หรือคิดเรื่องเดิมซ้ำ ๆ", "Tight chest, or replaying the same thoughts."),
        weights: { thinker: 3, feeler: 1 },
      },
      {
        label: t("หงุดหงิดง่าย หรือรู้สึกต้องรีบจัดการทุกอย่าง", "Easily irritated, rushing to fix everything."),
        weights: { performer: 2, warrior: 2 },
      },
      {
        label: t("อยากอยู่เงียบ ๆ ไม่อยากคุยกับใคร", "Want to be quiet — not talk to anyone."),
        weights: { feeler: 3 },
      },
      {
        label: t("ยังรับมือได้ แต่รู้ว่าตัวเองต้องการพักบ้าง", "Still coping, but I know I need a break."),
        weights: { explorer: 2, warrior: 1 },
      },
    ],
  },
  // ... rest of questions (id 3-8 would follow same pattern)
];

// ============================================================================
// Scoring Functions
// ============================================================================

export function scorePersona(answers: Record<number, number>): PersonaId {
  return scorePersonaTop2(answers)[0];
}

export function scorePersonaTop2(answers: Record<number, number>): [PersonaId, PersonaId] {
  const totals: Record<PersonaId, number> = {
    warrior: 0,
    thinker: 0,
    comfort: 0,
    feeler: 0,
    performer: 0,
    explorer: 0,
  };

  for (const q of questions) {
    const idx = answers[q.id];
    if (idx == null) continue;
    const opt = q.options[idx];
    if (!opt) continue;

    for (const [personaId, weight] of Object.entries(opt.weights)) {
      totals[personaId as PersonaId] += weight ?? 0;
    }
  }

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const primary = (sorted[0]?.[0] ?? "explorer") as PersonaId;
  const secondary = (sorted.find(([id]) => id !== primary)?.[0] ?? "explorer") as PersonaId;

  return [primary, secondary];
}

// ============================================================================
// Programs Data
// ============================================================================

// Helper function to create consistent meal plan entries
const meal = (day: Bi, breakfast: Bi, lunch: Bi, dinner: Bi, note?: Bi): MealPlanDay => ({
  day,
  breakfast,
  lunch,
  dinner,
  note,
});

export const programs: Program[] = [
  {
    id: "recharge-3",
    name: t("The Samui Recharge", "The Samui Recharge"),
    duration: t("3 วัน 2 คืน", "3 days · 2 nights"),
    nights: 2,
    price: 12545,
    tagline: t("แพ็กเกจฟื้นฟูครบวงจร · ตรวจสุขภาพ · บำบัด · โภชนาการ", "Full recharge — check-up, therapy, nutrition."),
    matches: ["feeler", "comfort", "thinker"],
    image: samuiSpaRitual,
    venue: t("Hug Samui × Royal Muang Samui", "Hug Samui × Royal Muang Samui"),
    highlights: [
      t("ตรวจสุขภาพและอารมณ์ (Medical Check-up)", "Medical & mood check-up"),
      t("โยคะส่วนตัว (Private Yoga Session)", "Private yoga session"),
      t("สมุนไพรบำบัด ล้างพิษลำไส้", "Herbal gut-detox therapy"),
      t("นวดบำบัดแบบองค์รวม (Holistic Massage)", "Holistic massage"),
      t("โปรแกรมบำรุงผิวหน้า (Facial Treatment)", "Facial treatment"),
      t("มื้ออาหารเพื่อสุขภาพ + Wellness Consult", "Healthy meal + wellness consult"),
    ],
    schedule: [
      {
        day: t("Day 1 — Arrival", "Day 1 — Arrival"),
        items: [
          t("เช็คอินที่ Royal Muang Samui", "Check-in at Royal Muang Samui"),
          t("Welcome herbal drink + intake form", "Welcome herbal drink + intake form"),
          t("Healing dinner ริมทะเล", "Healing dinner by the sea"),
        ],
      },
      {
        day: t("Day 2 — Recharge", "Day 2 — Recharge"),
        items: [
          t("เช้า · ตรวจสุขภาพและอารมณ์", "Morning · medical & mood check-up"),
          t("เช้า · โยคะส่วนตัว", "Morning · private yoga"),
          t("เช้า · สมุนไพรบำบัดล้างพิษ", "Morning · herbal detox therapy"),
          t("บ่าย · นวดบำบัดองค์รวม", "Afternoon · holistic massage"),
          t("บ่าย · Facial treatment", "Afternoon · facial treatment"),
          t("เย็น · มื้ออาหารเพื่อสุขภาพ", "Evening · healthy meal"),
        ],
      },
      {
        day: t("Day 3 — Consult & Depart", "Day 3 — Consult & Depart"),
        items: [
          t("Sunrise meditation", "Sunrise meditation"),
          t("Wellness consultation · สรุปผลและคำแนะนำ", "Wellness consultation · summary & guidance"),
          t("Brunch + departure", "Brunch + departure"),
        ],
      },
    ],
    gallery: [samuiSpaRitual, samuiInfinity, samuiLongtail, spa, food, yoga],
    expert: {
      name: t("ดร. ปานรวีร์ ประดิษฐ์ศร", "Dr. Panrawee Praditsorn"),
      role: t(
        "นักกำหนดอาหารวิชาชีพ · สถาบันโภชนาการ มหิดล (ปริญญาเอกด้านโภชนาการ ประเทศเยอรมนี) · ที่ปรึกษาโดย พญ. สวนันท์ วัชราวนิช",
        "Registered Dietitian · Mahidol Institute of Nutrition (PhD Nutrition, Germany) · Advised by Dr. Sawanan Watcharawanich",
      ),
    },
    mealPlan: [
      meal(
        t("Day 1", "Day 1"),
        t("—", "—"),
        t("Welcome herbal drink + light salad", "Welcome herbal drink + light salad"),
        t("ปลานึ่งสมุนไพร + ข้าวกล้อง + ผักย่าง", "Herb-steamed fish + brown rice + grilled veg"),
        t("งดคาเฟอีนหลัง 14:00", "No caffeine after 14:00"),
      ),
      meal(
        t("Day 2", "Day 2"),
        t("Tropical smoothie bowl + เมล็ดเจีย", "Tropical smoothie bowl + chia"),
        t("Buddha bowl ควินัว + อกไก่ + อะโวคาโด", "Buddha bowl: quinoa + chicken + avocado"),
        t("ต้มข่าเห็ด + ปลากระพงนึ่ง + ผักลวก", "Tom kha mushroom + steamed sea bass + greens"),
        t("ดื่มน้ำ 2.5L กระจายทั้งวัน", "Drink 2.5L water across the day"),
      ),
      meal(
        t("Day 3", "Day 3"),
        t("ไข่ลวก + อะโวคาโดโทสต์", "Soft-boiled eggs + avocado toast"),
        t("Light bowl ก่อนเดินทาง", "Light bowl before travel"),
        t("—", "—"),
        t("รับแผนอาหาร 7 วันกลับบ้าน", "Take home a 7-day meal plan"),
      ),
    ],
  },
  // ... rest of programs (reset-3, balance-5, transform-7)
];

// ============================================================================
// Helper Functions
// ============================================================================

export const programsForPersona = (personaId: PersonaId): Program[] => {
  return [...programs].sort((a, b) => {
    const aMatches = a.matches.includes(personaId) ? 0 : 1;
    const bMatches = b.matches.includes(personaId) ? 0 : 1;
    return aMatches - bMatches;
  });
};

export const getProgramById = (id: string): Program | undefined => {
  return programs.find((p) => p.id === id);
};

export const getPersonaById = (id: PersonaId): Persona | undefined => {
  return personas[id];
};

export const getAllPersonaIds = (): PersonaId[] => {
  return Object.keys(personas) as PersonaId[];
};

export const getAllPrograms = (): Program[] => {
  return [...programs];
};

// ============================================================================
// Persona Description Helper
// ============================================================================

export const getPersonaDescription = (personaId: PersonaId, lang: Lang): string => {
  const persona = personas[personaId];
  return persona ? pick(persona.description, lang) : "";
};

export const getPersonaPillars = (personaId: PersonaId, lang: Lang): string[] => {
  const persona = personas[personaId];
  return persona ? pickList(persona.pillars, lang) : [];
};
