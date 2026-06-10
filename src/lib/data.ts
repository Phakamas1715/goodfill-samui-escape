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

export const pick = <T>(b: Bi<T> | T, lang: Lang): T =>
  typeof b === "object" && b !== null && "th" in b && "en" in b ? b[lang] : (b as T);

export const pickList = <T>(arr: (Bi<T> | T)[], lang: Lang): T[] =>
  arr.map((item) => pick(item, lang));

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
  gradient?: string;
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
    gradient: "from-slate-500/20 to-emerald-700/20",
    icon: "🛡️",
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
    tagline: t(
      "คนคิดลึก วางแผนเก่ง ละเอียดรอบคอบ",
      "Deep thinker, strong planner, detail-oriented.",
    ),
    description: t(
      "คุณเป็นคนคิดลึก วางแผนเก่ง และละเอียดรอบคอบ แต่สมองที่ไม่ค่อยได้พัก อาจส่งผลต่อการนอนและความสดชื่นในแต่ละวัน",
      "You think deeply and plan carefully, but a mind that never rests can affect your sleep and daily energy.",
    ),
    color: "from-indigo-500/30 to-violet-700/30",
    gradient: "from-indigo-500/20 to-violet-700/20",
    icon: "🦉",
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
    gradient: "from-amber-500/20 to-rose-600/20",
    icon: "🌸",
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
    gradient: "from-violet-500/20 to-indigo-700/20",
    icon: "🌊",
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
    gradient: "from-rose-500/20 to-amber-600/20",
    icon: "⚡",
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
    tagline: t(
      "ระบบช่วยจัดลำดับว่าควรเริ่มจากอะไร",
      "A system that helps you decide where to begin.",
    ),
    description: t(
      "คุณพร้อมเริ่มดูแลตัวเองและเปิดรับสิ่งใหม่ ต้องการระบบที่ช่วยจัดลำดับให้ชัดว่าควรเริ่มจากอะไรก่อน",
      "You're ready to take better care of yourself and open to new things — you need a system that orders the first steps clearly.",
    ),
    color: "from-emerald-500/30 to-teal-600/30",
    gradient: "from-emerald-500/20 to-teal-600/20",
    icon: "🌱",
    pillars: [
      t("Wellness Discovery", "Wellness Discovery"),
      t("Samui Starter", "Samui Starter"),
      t("Personal Roadmap", "Personal Roadmap"),
      t("Habit Foundation", "Habit Foundation"),
    ],
  },
};

// ============================================================================
// Quest Data - ครบ 8 ข้อ
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
  // ข้อ 1
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
        label: t(
          "เริ่มวันได้ดี แต่พลังงานตกเร็วช่วงบ่าย",
          "Start well, but energy drops in the afternoon.",
        ),
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
  // ข้อ 2
  {
    id: 2,
    emoji: "🌊",
    question: t(
      "ช่วงนี้ความเครียดของคุณมักแสดงออกแบบไหน?",
      "How does your stress usually show up lately?",
    ),
    options: [
      {
        label: t(
          "รู้สึกแน่นในใจ หรือคิดเรื่องเดิมซ้ำ ๆ",
          "Tight chest, or replaying the same thoughts.",
        ),
        weights: { thinker: 3, feeler: 1 },
      },
      {
        label: t(
          "หงุดหงิดง่าย หรือรู้สึกต้องรีบจัดการทุกอย่าง",
          "Easily irritated, rushing to fix everything.",
        ),
        weights: { performer: 2, warrior: 2 },
      },
      {
        label: t("อยากอยู่เงียบ ๆ ไม่อยากคุยกับใคร", "Want to be quiet — not talk to anyone."),
        weights: { feeler: 3 },
      },
      {
        label: t(
          "ยังรับมือได้ แต่รู้ว่าตัวเองต้องการพักบ้าง",
          "Still coping, but I know I need a break.",
        ),
        weights: { explorer: 2, warrior: 1 },
      },
    ],
  },
  // ข้อ 3
  {
    id: 3,
    emoji: "🌙",
    question: t(
      "การนอนของคุณในช่วง 2 สัปดาห์ที่ผ่านมาเป็นอย่างไร?",
      "How has your sleep been the last two weeks?",
    ),
    options: [
      {
        label: t(
          "หลับยาก เพราะสมองยังคิดเรื่องงานหรือชีวิต",
          "Hard to fall asleep — mind still on work or life.",
        ),
        weights: { thinker: 3 },
      },
      {
        label: t(
          "หลับได้ แต่ตื่นกลางดึก หรือตื่นมาไม่สดชื่น",
          "Sleep, but wake at night or wake unrefreshed.",
        ),
        weights: { warrior: 2, thinker: 1 },
      },
      {
        label: t("นอนน้อย เพราะเวลาชีวิตไม่เป็นระบบ", "Sleep too little — schedule is irregular."),
        weights: { performer: 2, comfort: 1 },
      },
      {
        label: t("นอนได้พอสมควร แต่อยากให้หลับลึกกว่านี้", "Sleep is OK, but I want deeper rest."),
        weights: { explorer: 2, feeler: 1 },
      },
    ],
  },
  // ข้อ 4
  {
    id: 4,
    emoji: "🍵",
    question: t(
      "เวลาเหนื่อยหรือเครียด คุณมักดูแลตัวเองอย่างไร?",
      "When tired or stressed, how do you take care of yourself?",
    ),
    options: [
      {
        label: t(
          "หาอาหาร ของหวาน หรือเครื่องดื่มที่ทำให้รู้สึกดีขึ้น",
          "Find food, sweets, or drinks that make me feel better.",
        ),
        weights: { comfort: 3 },
      },
      {
        label: t(
          "เลื่อนมือถือ ดูคลิป หาสิ่งเบี่ยงเบนความคิด",
          "Scroll the phone, watch clips, distract myself.",
        ),
        weights: { comfort: 1, thinker: 2 },
      },
      {
        label: t("ออกไปเดิน ขยับร่างกาย หรือหาอากาศหายใจ", "Go walk, move my body, get fresh air."),
        weights: { explorer: 2, performer: 1 },
      },
      {
        label: t("เก็บไว้คนเดียว แล้วพยายามผ่านไปให้ได้", "Keep it to myself and push through."),
        weights: { feeler: 2, warrior: 2 },
      },
    ],
  },
  // ข้อ 5
  {
    id: 5,
    emoji: "🥗",
    question: t(
      "อาหารในชีวิตประจำวันของคุณใกล้เคียงข้อไหนที่สุด?",
      "Which best describes your daily eating?",
    ),
    options: [
      {
        label: t(
          "กินไม่เป็นเวลา บางมื้อข้าม บางมื้อกินหนัก",
          "Eat irregularly — skip meals, then eat heavy.",
        ),
        weights: { warrior: 2, performer: 2 },
      },
      {
        label: t("กินตามสะดวก อะไรง่ายก็เลือกอันนั้น", "Eat what's convenient — whatever is easy."),
        weights: { comfort: 3 },
      },
      {
        label: t(
          "พยายามเลือกอาหารดีขึ้น แต่ยังทำต่อเนื่องยาก",
          "Trying to eat better, but hard to stay consistent.",
        ),
        weights: { explorer: 2, comfort: 1 },
      },
      {
        label: t(
          "ค่อนข้างใส่ใจอาหาร แต่อยากได้แผนเฉพาะตัว",
          "Quite mindful, but I want a personal plan.",
        ),
        weights: { explorer: 2, performer: 2 },
      },
    ],
  },
  // ข้อ 6
  {
    id: 6,
    emoji: "💆",
    question: t("ร่างกายของคุณส่งสัญญาณอะไรบ่อยที่สุด?", "What does your body signal most often?"),
    options: [
      {
        label: t(
          "ปวดคอ บ่า ไหล่ หรือหลังจากการนั่งนาน",
          "Neck, shoulder, or back pain from sitting.",
        ),
        weights: { warrior: 2, performer: 2 },
      },
      {
        label: t("ปวดหัว เหนื่อยง่าย พลังงานไม่คงที่", "Headache, easy fatigue, unstable energy."),
        weights: { thinker: 2, performer: 1 },
      },
      {
        label: t(
          "ท้องอืด แน่นท้อง ระบบย่อยไม่ค่อยสบาย",
          "Bloating, heavy stomach, digestion issues.",
        ),
        weights: { comfort: 3 },
      },
      {
        label: t(
          "ไม่มีอาการชัด แต่ไม่สดชื่นเหมือนเดิม",
          "No clear symptoms — just not as fresh as before.",
        ),
        weights: { explorer: 2, feeler: 1 },
      },
    ],
  },
  // ข้อ 7
  {
    id: 7,
    emoji: "🏝️",
    question: t(
      "ถ้าได้ไปพักที่สมุย 3 วัน คุณอยากให้ทริปนี้ช่วยอะไรมากที่สุด?",
      "If you had 3 days on Samui, what would you want most?",
    ),
    options: [
      {
        label: t(
          "ได้พักจริง ๆ ปิดเสียงรบกวน นอนให้เต็มอิ่ม",
          "Real rest — silence, deep sleep, full reset.",
        ),
        weights: { warrior: 2, thinker: 2 },
      },
      {
        label: t(
          "ให้ร่างกายฟื้นจากความล้าและอาการปวดเมื่อย",
          "Body recovery from fatigue and aches.",
        ),
        weights: { warrior: 2, performer: 2 },
      },
      {
        label: t(
          "ให้ใจสงบ ลดความคิดมาก และรู้สึกเบาขึ้น",
          "A calm mind, less overthinking, lighter feeling.",
        ),
        weights: { feeler: 2, thinker: 1 },
      },
      {
        label: t(
          "กลับไปพร้อมพลังงานใหม่และแรงบันดาลใจ",
          "Return with fresh energy and inspiration.",
        ),
        weights: { performer: 2, explorer: 1 },
      },
    ],
  },
  // ข้อ 8
  {
    id: 8,
    emoji: "✨",
    question: t(
      "ถ้า Goodfill ออกแบบโปรแกรมให้ 1 อย่าง คุณอยากให้เน้นเรื่องใดมากที่สุด?",
      "If Goodfill designed one program for you, what should it focus on?",
    ),
    options: [
      {
        label: t(
          "Sleep Recovery — นอนหลับดีขึ้นและฟื้นตัวลึกขึ้น",
          "Sleep Recovery — better sleep, deeper restoration.",
        ),
        weights: { thinker: 3, warrior: 1 },
      },
      {
        label: t(
          "Stress Reset — ลดความเครียดและคืนความสงบให้ใจ",
          "Stress Reset — lower stress, restore calm.",
        ),
        weights: { feeler: 3 },
      },
      {
        label: t(
          "Body Balance — ลดปวดเมื่อยและดูแลร่างกายให้สมดุล",
          "Body Balance — relieve aches, restore balance.",
        ),
        weights: { warrior: 2, comfort: 1 },
      },
      {
        label: t(
          "Energy Restore — เพิ่มพลังงานและความสดชื่น",
          "Energy Restore — boost energy and freshness.",
        ),
        weights: { performer: 3, explorer: 1 },
      },
    ],
  },
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
    tagline: t(
      "แพ็กเกจฟื้นฟูครบวงจร · ตรวจสุขภาพ · บำบัด · โภชนาการ",
      "Full recharge — check-up, therapy, nutrition.",
    ),
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
          t(
            "Wellness consultation · สรุปผลและคำแนะนำ",
            "Wellness consultation · summary & guidance",
          ),
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
  {
    id: "reset-3",
    name: t("The Samui Reset", "The Samui Reset"),
    duration: t("3 วัน 2 คืน", "3 days · 2 nights"),
    nights: 2,
    price: 38000,
    tagline: t("Short escape สำหรับคน timeline แน่น", "Short escape for tight schedules."),
    matches: ["feeler", "thinker", "explorer"],
    image: programReset,
    venue: t("Bo Phut Beach Villa", "Bo Phut Beach Villa"),
    highlights: [
      t("Welcome Sound Bath ริมหาด", "Beachside Welcome Sound Bath"),
      t("Signature Thai Massage 90 นาที", "Signature Thai Massage · 90 min"),
      t("Sunrise Yoga 2 เช้า", "Sunrise Yoga · 2 mornings"),
      t("Wellness Chef Dinner", "Wellness Chef Dinner"),
    ],
    schedule: [
      {
        day: t("Day 1 — Arrival", "Day 1 — Arrival"),
        items: [
          t("เช็คอินวิลล่า", "Villa check-in"),
          t("Welcome herbal mocktail", "Welcome herbal mocktail"),
          t("Sunset breathwork ริมหาด", "Beachside sunset breathwork"),
          t("Healing dinner", "Healing dinner"),
        ],
      },
      {
        day: t("Day 2 — Restore", "Day 2 — Restore"),
        items: [
          t("Sunrise yoga", "Sunrise yoga"),
          t("Body composition scan", "Body composition scan"),
          t("Signature massage 90'", "Signature massage 90'"),
          t("Sound healing", "Sound healing"),
        ],
      },
      {
        day: t("Day 3 — Carry On", "Day 3 — Carry On"),
        items: [
          t("Sunrise meditation", "Sunrise meditation"),
          t("Wellness brunch", "Wellness brunch"),
          t("Personal report consult", "Personal report consult"),
          t("Departure transfer", "Departure transfer"),
        ],
      },
    ],
    gallery: [programReset, villa, spa, food, meditation, yoga],
    expert: {
      name: t("ดร. ภัทรา วงศ์สุข", "Dr. Pattara Wongsuk"),
      role: t("Wellness Physician & Sleep Specialist", "Wellness Physician & Sleep Specialist"),
    },
    mealPlan: [
      meal(
        t("Day 1", "Day 1"),
        t("—", "—"),
        t("Welcome herbal mocktail + light salad", "Welcome herbal mocktail + light salad"),
        t(
          "ปลานึ่งมะนาว + ข้าวกล้อง + ผักย่าง",
          "Healing dinner: steamed lime fish + brown rice + grilled veg",
        ),
        t(
          "งดคาเฟอีนหลัง 14:00 เพื่อเตรียม sleep cycle",
          "No caffeine after 14:00 to prep your sleep cycle",
        ),
      ),
      meal(
        t("Day 2", "Day 2"),
        t(
          "Tropical smoothie bowl + chia + coconut yoghurt",
          "Tropical smoothie bowl + chia + coconut yoghurt",
        ),
        t(
          "Buddha bowl ควินัว + อกไก่ + อะโวคาโด",
          "Buddha bowl: quinoa + chicken breast + avocado",
        ),
        t(
          "ต้มข่าเห็ด + ปลากระพงนึ่ง + ผักลวก",
          "Tom kha mushroom + steamed sea bass + blanched greens",
        ),
        t("ดื่มน้ำ 2.5L กระจายทั้งวัน", "Drink 2.5L water spread across the day"),
      ),
      meal(
        t("Day 3", "Day 3"),
        t(
          "Wellness brunch: ไข่ลวก + อะโวคาโดโทสต์",
          "Wellness brunch: soft-boiled eggs + avocado toast",
        ),
        t("Light bowl ก่อนเดินทาง", "Light bowl before travel"),
        t("—", "—"),
        t("เตรียมรายการอาหารกลับบ้าน 7 วัน", "Prep a 7-day home meal list"),
      ),
    ],
  },
  {
    id: "balance-5",
    name: t("Mindful Balance", "Mindful Balance"),
    duration: t("5 วัน 4 คืน", "5 days · 4 nights"),
    nights: 4,
    price: 72000,
    tagline: t("Sweet spot — เห็นผลจริง ไม่หักโหม", "Sweet spot — real results, no overload."),
    matches: ["warrior", "thinker", "feeler"],
    image: programBalance,
    venue: t("Chaweng Noi Wellness Resort", "Chaweng Noi Wellness Resort"),
    highlights: [
      t("1:1 Wellness Coach ทุกวัน", "1:1 Wellness Coach every day"),
      t("5 Treatments แบบ tailor-made", "5 tailor-made treatments"),
      t("Detox Juice Day", "Detox Juice Day"),
      t("Sunrise yoga + Sunset breathwork", "Sunrise yoga + sunset breathwork"),
    ],
    schedule: [
      {
        day: t("Day 1", "Day 1"),
        items: [
          t("Check-in + intake", "Check-in + intake"),
          t("Welcome ritual", "Welcome ritual"),
          t("Light dinner", "Light dinner"),
        ],
      },
      {
        day: t("Day 2", "Day 2"),
        items: [
          t("Yoga", "Yoga"),
          t("Lymphatic massage", "Lymphatic massage"),
          t("Coaching session", "Coaching session"),
          t("Sound bath", "Sound bath"),
        ],
      },
      {
        day: t("Day 3", "Day 3"),
        items: [
          t("Juice cleanse day", "Juice cleanse day"),
          t("Forest bathing", "Forest bathing"),
          t("Meditation", "Meditation"),
        ],
      },
      {
        day: t("Day 4", "Day 4"),
        items: [
          t("Active flow yoga", "Active flow yoga"),
          t("Signature treatment", "Signature treatment"),
          t("Sunset breathwork", "Sunset breathwork"),
        ],
      },
      {
        day: t("Day 5", "Day 5"),
        items: [
          t("Final report", "Final report"),
          t("Brunch", "Brunch"),
          t("Departure", "Departure"),
        ],
      },
    ],
    gallery: [programBalance, meditation, yoga, spa, food, villa],
    expert: {
      name: t("นพ. กฤษฎา ศิริชัย", "Dr. Krisada Sirichai"),
      role: t("Functional Medicine Doctor", "Functional Medicine Doctor"),
    },
    mealPlan: [
      meal(
        t("Day 1", "Day 1"),
        t("—", "—"),
        t("Welcome bowl: ปลาทูน่า + ผักสด", "Welcome bowl: tuna + fresh greens"),
        t(
          "Light dinner: ต้มยำกุ้ง clear soup + ข้าวกล้อง",
          "Light dinner: clear tom yum kung + brown rice",
        ),
      ),
      meal(
        t("Day 2", "Day 2"),
        t("Acai bowl + เมล็ดแฟลกซ์", "Acai bowl + flax seeds"),
        t("Quinoa & roasted veggie bowl + ทาฮีนี", "Quinoa & roasted veggie bowl + tahini"),
        t("ปลาย่างสมุนไพร + สลัดผักไทย", "Herb-grilled fish + Thai garden salad"),
        t("เริ่ม intermittent 12:12", "Start 12:12 intermittent fasting"),
      ),
      meal(
        t("Day 3 — Juice Cleanse", "Day 3 — Juice Cleanse"),
        t("Green juice (cucumber + apple + ginger)", "Green juice (cucumber + apple + ginger)"),
        t("Beet & carrot juice + almond milk", "Beet & carrot juice + almond milk"),
        t("Bone broth + steamed greens", "Bone broth + steamed greens"),
        t("วันล้างพิษ ดื่มน้ำเปล่า 3L", "Cleanse day — drink 3L water"),
      ),
      meal(
        t("Day 4", "Day 4"),
        t("Coconut yoghurt + berries + granola", "Coconut yoghurt + berries + granola"),
        t("Salmon poke bowl + edamame", "Salmon poke bowl + edamame"),
        t("อกไก่ย่าง + ผักรวมย่าง + quinoa", "Grilled chicken + roasted veg + quinoa"),
      ),
      meal(
        t("Day 5", "Day 5"),
        t(
          "Farewell brunch: omelette + อะโวคาโด + เห็ด",
          "Farewell brunch: omelette + avocado + mushroom",
        ),
        t("—", "—"),
        t("—", "—"),
      ),
    ],
  },
  {
    id: "transform-7",
    name: t("Full Transformation", "Full Transformation"),
    duration: t("7 วัน 6 คืน", "7 days · 6 nights"),
    nights: 6,
    price: 128000,
    tagline: t("Deep work — เปลี่ยนนิสัย เปลี่ยนชีวิต", "Deep work — change habits, change life."),
    matches: ["performer", "warrior", "comfort"],
    image: programTransform,
    venue: t("Lamai Hilltop Sanctuary", "Lamai Hilltop Sanctuary"),
    highlights: [
      t("ตรวจสุขภาพละเอียด + Metabolic test", "Detailed health check + metabolic test"),
      t("Detox protocol 7 วัน", "7-day detox protocol"),
      t("Personal trainer + nutrition coach", "Personal trainer + nutrition coach"),
      t("Habit blueprint สำหรับ 90 วันถัดไป", "Habit blueprint for the next 90 days"),
    ],
    schedule: [
      {
        day: t("Day 1", "Day 1"),
        items: [
          t("Intake + full assessment", "Intake + full assessment"),
          t("Welcome dinner", "Welcome dinner"),
        ],
      },
      {
        day: t("Day 2-3", "Day 2-3"),
        items: [
          t("Detox start", "Detox start"),
          t("Daily yoga", "Daily yoga"),
          t("Lymphatic + sauna ritual", "Lymphatic + sauna ritual"),
        ],
      },
      {
        day: t("Day 4-5", "Day 4-5"),
        items: [
          t("Active training", "Active training"),
          t("Cold plunge", "Cold plunge"),
          t("Sound healing", "Sound healing"),
        ],
      },
      {
        day: t("Day 6", "Day 6"),
        items: [t("Integration day", "Integration day"), t("1:1 coaching", "1:1 coaching")],
      },
      {
        day: t("Day 7", "Day 7"),
        items: [
          t("Final report + 90-day plan", "Final report + 90-day plan"),
          t("Departure", "Departure"),
        ],
      },
    ],
    gallery: [programTransform, yoga, spa, villa, food, meditation],
    expert: {
      name: t("ดร. ปริญญ์ ตั้งจิตร", "Dr. Parin Tangchitr"),
      role: t("Performance Physician & Nutrition Coach", "Performance Physician & Nutrition Coach"),
    },
    mealPlan: [
      meal(
        t("Day 1", "Day 1"),
        t("—", "—"),
        t("Intake — light bowl ปลานึ่ง + ผักสด", "Intake — light bowl: steamed fish + greens"),
        t("Welcome dinner: salmon + roasted root veg", "Welcome dinner: salmon + roasted root veg"),
      ),
      meal(
        t("Day 2", "Day 2"),
        t("Detox green smoothie + chia", "Detox green smoothie + chia"),
        t("Buddha bowl ควินัว + อกไก่ย่าง", "Buddha bowl: quinoa + grilled chicken"),
        t("Bone broth + steamed fish + ผักลวก", "Bone broth + steamed fish + blanched greens"),
        t("เริ่ม detox protocol", "Start detox protocol"),
      ),
      meal(
        t("Day 3", "Day 3"),
        t("Coconut yoghurt + berries", "Coconut yoghurt + berries"),
        t("Light fish ceviche + avocado", "Light fish ceviche + avocado"),
        t("Veggie miso soup + tofu", "Veggie miso soup + tofu"),
      ),
      meal(
        t("Day 4", "Day 4"),
        t("Tropical smoothie bowl", "Tropical smoothie bowl"),
        t("Grilled salmon + quinoa + salad", "Grilled salmon + quinoa + salad"),
        t("อกไก่อบสมุนไพร + sweet potato", "Herb-roasted chicken + sweet potato"),
      ),
      meal(
        t("Day 5", "Day 5"),
        t("Egg white omelette + avocado", "Egg white omelette + avocado"),
        t("Steak salad (grass-fed) + greens", "Steak salad (grass-fed) + greens"),
        t("Light Thai clear soup + ปลาย่าง", "Light Thai clear soup + grilled fish"),
      ),
      meal(
        t("Day 6", "Day 6"),
        t("Overnight oats + almond butter", "Overnight oats + almond butter"),
        t("Poke bowl + edamame", "Poke bowl + edamame"),
        t(
          "Integration dinner: chef tasting menu (clean)",
          "Integration dinner: chef tasting menu (clean)",
        ),
      ),
      meal(
        t("Day 7", "Day 7"),
        t("Farewell brunch", "Farewell brunch"),
        t("—", "—"),
        t("—", "—"),
        t("รับ 90-day meal blueprint กลับบ้าน", "Take home your 90-day meal blueprint"),
      ),
    ],
  },
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

// ============================================================================
// Additional Utilities
// ============================================================================

export const personaIcons: Record<PersonaId, string> = {
  warrior: "🛡️",
  thinker: "🦉",
  comfort: "🌸",
  feeler: "🌊",
  performer: "⚡",
  explorer: "🌱",
};

export const personaGradients: Record<PersonaId, string> = {
  warrior: "from-slate-500/20 to-emerald-700/20",
  thinker: "from-indigo-500/20 to-violet-700/20",
  comfort: "from-amber-500/20 to-rose-600/20",
  feeler: "from-violet-500/20 to-indigo-700/20",
  performer: "from-rose-500/20 to-amber-600/20",
  explorer: "from-emerald-500/20 to-teal-600/20",
};
