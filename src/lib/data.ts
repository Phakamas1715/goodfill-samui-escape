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
  heroSamui, yoga, spa, food, villa, meditation,
  samuiAerial, samuiInfinity, samuiLongtail, samuiSpaRitual,
  programReset, programBalance, programTransform,
  mealBreakfast, mealLunch, mealDinner,
};

export type Lang = "th" | "en";
export type Bi = { th: string; en: string };
export const pick = (b: Bi | string, lang: Lang): string =>
  typeof b === "string" ? b : b[lang];
export const pickList = (a: (Bi | string)[], lang: Lang): string[] =>
  a.map((x) => pick(x, lang));

export type PersonaId =
  | "warrior" | "thinker" | "comfort" | "feeler" | "performer" | "explorer";

export interface Persona {
  id: PersonaId;
  name: Bi;
  thaiName: Bi;
  tagline: Bi;
  description: Bi;
  color: string;
  pillars: Bi[];
}

export const personas: Record<PersonaId, Persona> = {
  warrior: {
    id: "warrior",
    name: { th: "The Silent Warrior", en: "The Silent Warrior" },
    thaiName: { th: "นักสู้เงียบ", en: "Silent Warrior" },
    tagline: {
      th: "ผู้รับผิดชอบสูง อดทน ดูแลทุกอย่างให้ดีที่สุด",
      en: "High responsibility, enduring, takes care of everyone.",
    },
    description: {
      th: "คุณเป็นคนรับผิดชอบสูง อดทน และพยายามดูแลทุกอย่างให้ดีที่สุด แต่ร่างกายอาจเริ่มสะสมความล้าโดยไม่รู้ตัว",
      en: "You're highly responsible and enduring, taking care of everything — but your body may be quietly accumulating fatigue.",
    },
    color: "from-slate-500/30 to-emerald-700/30",
    pillars: [
      { th: "Executive Recovery", en: "Executive Recovery" },
      { th: "Deep Tissue Massage", en: "Deep Tissue Massage" },
      { th: "Sleep Restoration", en: "Sleep Restoration" },
      { th: "Adrenal Reset", en: "Adrenal Reset" },
    ],
  },
  thinker: {
    id: "thinker",
    name: { th: "The Midnight Thinker", en: "The Midnight Thinker" },
    thaiName: { th: "นกฮูกคิดมาก", en: "Midnight Owl" },
    tagline: {
      th: "คนคิดลึก วางแผนเก่ง ละเอียดรอบคอบ",
      en: "Deep thinker, strong planner, detail-oriented.",
    },
    description: {
      th: "คุณเป็นคนคิดลึก วางแผนเก่ง และละเอียดรอบคอบ แต่สมองที่ไม่ค่อยได้พัก อาจส่งผลต่อการนอนและความสดชื่นในแต่ละวัน",
      en: "You think deeply and plan carefully, but a mind that never rests can affect your sleep and daily energy.",
    },
    color: "from-indigo-500/30 to-violet-700/30",
    pillars: [
      { th: "Sleep Recovery", en: "Sleep Recovery" },
      { th: "Nervous System Reset", en: "Nervous System Reset" },
      { th: "Mind Quieting", en: "Mind Quieting" },
      { th: "Breathwork", en: "Breathwork" },
    ],
  },
  comfort: {
    id: "comfort",
    name: { th: "The Comfort Seeker", en: "The Comfort Seeker" },
    thaiName: { th: "ผู้แสวงหาความสบายใจ", en: "Comfort Seeker" },
    tagline: {
      th: "เชื่อมอาหารกับอารมณ์อย่างสมดุล",
      en: "Reconnect food with emotion, in balance.",
    },
    description: {
      th: "คุณมักใช้ความอร่อย ความสบาย หรือสิ่งคุ้นเคยช่วยปลอบใจในวันที่เหนื่อย โปรแกรมจึงเน้นเชื่อมอาหารกับอารมณ์อย่างสมดุล",
      en: "You often turn to food, comfort, or the familiar on tough days. This program balances food and emotion gently.",
    },
    color: "from-amber-500/30 to-rose-600/30",
    pillars: [
      { th: "Gut Health", en: "Gut Health" },
      { th: "Emotional Balance", en: "Emotional Balance" },
      { th: "Thai Herbal Nutrition", en: "Thai Herbal Nutrition" },
      { th: "Mindful Eating", en: "Mindful Eating" },
    ],
  },
  feeler: {
    id: "feeler",
    name: { th: "The Deep Feeler", en: "The Deep Feeler" },
    thaiName: { th: "ผู้รู้สึกลึก", en: "Deep Feeler" },
    tagline: {
      th: "คืนพื้นที่ให้ใจได้พักจริง ๆ",
      en: "Give your heart real space to rest.",
    },
    description: {
      th: "คุณรับรู้อารมณ์และรายละเอียดรอบตัวได้ลึก บางครั้งใช้พลังใจมากกว่าที่คิด โปรแกรมจึงคืนพื้นที่ให้ใจได้พักจริง ๆ",
      en: "You sense emotions and details deeply, often spending more emotional energy than you realize. This program returns space to your heart.",
    },
    color: "from-violet-500/30 to-indigo-700/30",
    pillars: [
      { th: "Emotional Reset", en: "Emotional Reset" },
      { th: "Mindfulness", en: "Mindfulness" },
      { th: "Sound Healing", en: "Sound Healing" },
      { th: "Calm Balance", en: "Calm Balance" },
    ],
  },
  performer: {
    id: "performer",
    name: { th: "The High Performer", en: "The High Performer" },
    thaiName: { th: "เครื่องยนต์สมรรถนะสูง", en: "High Performer" },
    tagline: {
      th: "ฟื้นฟูเข้มข้นสำหรับคนใช้พลังงานสูง",
      en: "Intensive recovery for high-energy lives.",
    },
    description: {
      th: "คุณมีเป้าหมายชัดและใช้พลังงานสูง การเร่งต่อเนื่องทำให้ร่างกายต้องการการฟื้นฟูอย่างจริงจัง",
      en: "You're goal-driven and high-energy. Constant acceleration means your body needs serious recovery.",
    },
    color: "from-rose-500/30 to-amber-600/30",
    pillars: [
      { th: "Executive Detox", en: "Executive Detox" },
      { th: "Energy Reset", en: "Energy Reset" },
      { th: "Premium Recovery", en: "Premium Recovery" },
      { th: "Performance Nutrition", en: "Performance Nutrition" },
    ],
  },
  explorer: {
    id: "explorer",
    name: { th: "The Wellness Explorer", en: "The Wellness Explorer" },
    thaiName: { th: "นักสำรวจสุขภาพ", en: "Wellness Explorer" },
    tagline: {
      th: "ระบบช่วยจัดลำดับว่าควรเริ่มจากอะไร",
      en: "A system that helps you decide where to begin.",
    },
    description: {
      th: "คุณพร้อมเริ่มดูแลตัวเองและเปิดรับสิ่งใหม่ ต้องการระบบที่ช่วยจัดลำดับให้ชัดว่าควรเริ่มจากอะไรก่อน",
      en: "You're ready to take better care of yourself and open to new things — you need a system that orders the first steps clearly.",
    },
    color: "from-emerald-500/30 to-teal-600/30",
    pillars: [
      { th: "Wellness Discovery", en: "Wellness Discovery" },
      { th: "Samui Starter", en: "Samui Starter" },
      { th: "Personal Roadmap", en: "Personal Roadmap" },
      { th: "Habit Foundation", en: "Habit Foundation" },
    ],
  },
};

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
    id: 1, emoji: "☀️",
    question: { th: "พลังงานของคุณในเช้าวันใหม่เป็นแบบไหน?", en: "How is your energy on a new morning?" },
    options: [
      { label: { th: "ตื่นมายังล้า ต้องพึ่งกาแฟหรือเครื่องดื่มช่วยเริ่มวัน", en: "Wake up tired — need coffee to start the day." }, weights: { performer: 2, warrior: 2, comfort: 1 } },
      { label: { th: "เริ่มวันได้ดี แต่พลังงานตกเร็วช่วงบ่าย", en: "Start well, but energy drops in the afternoon." }, weights: { performer: 2, thinker: 2 } },
      { label: { th: "อยากนอนต่อ รู้สึกว่ายังพักไม่พอ", en: "Want to keep sleeping — don't feel rested." }, weights: { thinker: 2, feeler: 2 } },
      { label: { th: "พลังงานพอใช้ ค่อย ๆ เริ่มวันแบบไม่รีบ", en: "Enough energy — ease into the day." }, weights: { explorer: 3 } },
    ],
  },
  {
    id: 2, emoji: "🌊",
    question: { th: "ช่วงนี้ความเครียดของคุณมักแสดงออกแบบไหน?", en: "How does your stress usually show up lately?" },
    options: [
      { label: { th: "รู้สึกแน่นในใจ หรือคิดเรื่องเดิมซ้ำ ๆ", en: "Tight chest, or replaying the same thoughts." }, weights: { thinker: 3, feeler: 1 } },
      { label: { th: "หงุดหงิดง่าย หรือรู้สึกต้องรีบจัดการทุกอย่าง", en: "Easily irritated, rushing to fix everything." }, weights: { performer: 2, warrior: 2 } },
      { label: { th: "อยากอยู่เงียบ ๆ ไม่อยากคุยกับใคร", en: "Want to be quiet — not talk to anyone." }, weights: { feeler: 3 } },
      { label: { th: "ยังรับมือได้ แต่รู้ว่าตัวเองต้องการพักบ้าง", en: "Still coping, but I know I need a break." }, weights: { explorer: 2, warrior: 1 } },
    ],
  },
  {
    id: 3, emoji: "🌙",
    question: { th: "การนอนของคุณในช่วง 2 สัปดาห์ที่ผ่านมาเป็นอย่างไร?", en: "How has your sleep been the last two weeks?" },
    options: [
      { label: { th: "หลับยาก เพราะสมองยังคิดเรื่องงานหรือชีวิต", en: "Hard to fall asleep — mind still on work or life." }, weights: { thinker: 3 } },
      { label: { th: "หลับได้ แต่ตื่นกลางดึก หรือตื่นมาไม่สดชื่น", en: "Sleep, but wake at night or wake unrefreshed." }, weights: { warrior: 2, thinker: 1 } },
      { label: { th: "นอนน้อย เพราะเวลาชีวิตไม่เป็นระบบ", en: "Sleep too little — schedule is irregular." }, weights: { performer: 2, comfort: 1 } },
      { label: { th: "นอนได้พอสมควร แต่อยากให้หลับลึกกว่านี้", en: "Sleep is OK, but I want deeper rest." }, weights: { explorer: 2, feeler: 1 } },
    ],
  },
  {
    id: 4, emoji: "🍵",
    question: { th: "เวลาเหนื่อยหรือเครียด คุณมักดูแลตัวเองอย่างไร?", en: "When tired or stressed, how do you take care of yourself?" },
    options: [
      { label: { th: "หาอาหาร ของหวาน หรือเครื่องดื่มที่ทำให้รู้สึกดีขึ้น", en: "Find food, sweets, or drinks that make me feel better." }, weights: { comfort: 3 } },
      { label: { th: "เลื่อนมือถือ ดูคลิป หาสิ่งเบี่ยงเบนความคิด", en: "Scroll the phone, watch clips, distract myself." }, weights: { comfort: 1, thinker: 2 } },
      { label: { th: "ออกไปเดิน ขยับร่างกาย หรือหาอากาศหายใจ", en: "Go walk, move my body, get fresh air." }, weights: { explorer: 2, performer: 1 } },
      { label: { th: "เก็บไว้คนเดียว แล้วพยายามผ่านไปให้ได้", en: "Keep it to myself and push through." }, weights: { feeler: 2, warrior: 2 } },
    ],
  },
  {
    id: 5, emoji: "🥗",
    question: { th: "อาหารในชีวิตประจำวันของคุณใกล้เคียงข้อไหนที่สุด?", en: "Which best describes your daily eating?" },
    options: [
      { label: { th: "กินไม่เป็นเวลา บางมื้อข้าม บางมื้อกินหนัก", en: "Eat irregularly — skip meals, then eat heavy." }, weights: { warrior: 2, performer: 2 } },
      { label: { th: "กินตามสะดวก อะไรง่ายก็เลือกอันนั้น", en: "Eat what's convenient — whatever is easy." }, weights: { comfort: 3 } },
      { label: { th: "พยายามเลือกอาหารดีขึ้น แต่ยังทำต่อเนื่องยาก", en: "Trying to eat better, but hard to stay consistent." }, weights: { explorer: 2, comfort: 1 } },
      { label: { th: "ค่อนข้างใส่ใจอาหาร แต่อยากได้แผนเฉพาะตัว", en: "Quite mindful, but I want a personal plan." }, weights: { explorer: 2, performer: 2 } },
    ],
  },
  {
    id: 6, emoji: "💆",
    question: { th: "ร่างกายของคุณส่งสัญญาณอะไรบ่อยที่สุด?", en: "What does your body signal most often?" },
    options: [
      { label: { th: "ปวดคอ บ่า ไหล่ หรือหลังจากการนั่งนาน", en: "Neck, shoulder, or back pain from sitting." }, weights: { warrior: 2, performer: 2 } },
      { label: { th: "ปวดหัว เหนื่อยง่าย พลังงานไม่คงที่", en: "Headache, easy fatigue, unstable energy." }, weights: { thinker: 2, performer: 1 } },
      { label: { th: "ท้องอืด แน่นท้อง ระบบย่อยไม่ค่อยสบาย", en: "Bloating, heavy stomach, digestion issues." }, weights: { comfort: 3 } },
      { label: { th: "ไม่มีอาการชัด แต่ไม่สดชื่นเหมือนเดิม", en: "No clear symptoms — just not as fresh as before." }, weights: { explorer: 2, feeler: 1 } },
    ],
  },
  {
    id: 7, emoji: "🏝️",
    question: { th: "ถ้าได้ไปพักที่สมุย 3 วัน คุณอยากให้ทริปนี้ช่วยอะไรมากที่สุด?", en: "If you had 3 days on Samui, what would you want most?" },
    options: [
      { label: { th: "ได้พักจริง ๆ ปิดเสียงรบกวน นอนให้เต็มอิ่ม", en: "Real rest — silence, deep sleep, full reset." }, weights: { warrior: 2, thinker: 2 } },
      { label: { th: "ให้ร่างกายฟื้นจากความล้าและอาการปวดเมื่อย", en: "Body recovery from fatigue and aches." }, weights: { warrior: 2, performer: 2 } },
      { label: { th: "ให้ใจสงบ ลดความคิดมาก และรู้สึกเบาขึ้น", en: "A calm mind, less overthinking, lighter feeling." }, weights: { feeler: 2, thinker: 1 } },
      { label: { th: "กลับไปพร้อมพลังงานใหม่และแรงบันดาลใจ", en: "Return with fresh energy and inspiration." }, weights: { performer: 2, explorer: 1 } },
    ],
  },
  {
    id: 8, emoji: "✨",
    question: { th: "ถ้า Goodfill ออกแบบโปรแกรมให้ 1 อย่าง คุณอยากให้เน้นเรื่องใดมากที่สุด?", en: "If Goodfill designed one program for you, what should it focus on?" },
    options: [
      { label: { th: "Sleep Recovery — นอนหลับดีขึ้นและฟื้นตัวลึกขึ้น", en: "Sleep Recovery — better sleep, deeper restoration." }, weights: { thinker: 3, warrior: 1 } },
      { label: { th: "Stress Reset — ลดความเครียดและคืนความสงบให้ใจ", en: "Stress Reset — lower stress, restore calm." }, weights: { feeler: 3 } },
      { label: { th: "Body Balance — ลดปวดเมื่อยและดูแลร่างกายให้สมดุล", en: "Body Balance — relieve aches, restore balance." }, weights: { warrior: 2, comfort: 1 } },
      { label: { th: "Energy Restore — เพิ่มพลังงานและความสดชื่น", en: "Energy Restore — boost energy and freshness." }, weights: { performer: 3, explorer: 1 } },
    ],
  },
];

export function scorePersona(answers: Record<number, number>): PersonaId {
  return scorePersonaTop2(answers)[0];
}

export function scorePersonaTop2(
  answers: Record<number, number>,
): [PersonaId, PersonaId] {
  const totals: Record<PersonaId, number> = {
    warrior: 0, thinker: 0, comfort: 0, feeler: 0, performer: 0, explorer: 0,
  };
  for (const q of questions) {
    const idx = answers[q.id];
    if (idx == null) continue;
    const opt = q.options[idx];
    if (!opt) continue;
    for (const [k, v] of Object.entries(opt.weights)) {
      totals[k as PersonaId] += v ?? 0;
    }
  }
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const primary = (sorted[0]?.[0] ?? "explorer") as PersonaId;
  const secondary = (sorted.find(([k]) => k !== primary)?.[0] ?? "explorer") as PersonaId;
  return [primary, secondary];
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
  mealPlan: { day: Bi; breakfast: Bi; lunch: Bi; dinner: Bi; note?: Bi }[];
  expert: { name: Bi; role: Bi };
}

export const programs: Program[] = [
  {
    id: "recharge-3",
    name: { th: "The Samui Recharge", en: "The Samui Recharge" },
    duration: { th: "3 วัน 2 คืน", en: "3 days · 2 nights" },
    nights: 2,
    price: 12545,
    tagline: {
      th: "แพ็กเกจฟื้นฟูครบวงจร · ตรวจสุขภาพ · บำบัด · โภชนาการ",
      en: "Full recharge — check-up, therapy, nutrition.",
    },
    matches: ["feeler", "comfort", "thinker"],
    image: samuiSpaRitual,
    venue: { th: "Hug Samui × Royal Muang Samui", en: "Hug Samui × Royal Muang Samui" },
    highlights: [
      { th: "ตรวจสุขภาพและอารมณ์ (Medical Check-up)", en: "Medical & mood check-up" },
      { th: "โยคะส่วนตัว (Private Yoga Session)", en: "Private yoga session" },
      { th: "สมุนไพรบำบัด ล้างพิษลำไส้", en: "Herbal gut-detox therapy" },
      { th: "นวดบำบัดแบบองค์รวม (Holistic Massage)", en: "Holistic massage" },
      { th: "โปรแกรมบำรุงผิวหน้า (Facial Treatment)", en: "Facial treatment" },
      { th: "มื้ออาหารเพื่อสุขภาพ + Wellness Consult", en: "Healthy meal + wellness consult" },
    ],
    schedule: [
      { day: { th: "Day 1 — Arrival", en: "Day 1 — Arrival" }, items: [
        { th: "เช็คอินที่ Royal Muang Samui", en: "Check-in at Royal Muang Samui" },
        { th: "Welcome herbal drink + intake form", en: "Welcome herbal drink + intake form" },
        { th: "Healing dinner ริมทะเล", en: "Healing dinner by the sea" },
      ] },
      { day: { th: "Day 2 — Recharge", en: "Day 2 — Recharge" }, items: [
        { th: "เช้า · ตรวจสุขภาพและอารมณ์", en: "Morning · medical & mood check-up" },
        { th: "เช้า · โยคะส่วนตัว", en: "Morning · private yoga" },
        { th: "เช้า · สมุนไพรบำบัดล้างพิษ", en: "Morning · herbal detox therapy" },
        { th: "บ่าย · นวดบำบัดองค์รวม", en: "Afternoon · holistic massage" },
        { th: "บ่าย · Facial treatment", en: "Afternoon · facial treatment" },
        { th: "เย็น · มื้ออาหารเพื่อสุขภาพ", en: "Evening · healthy meal" },
      ] },
      { day: { th: "Day 3 — Consult & Depart", en: "Day 3 — Consult & Depart" }, items: [
        { th: "Sunrise meditation", en: "Sunrise meditation" },
        { th: "Wellness consultation · สรุปผลและคำแนะนำ", en: "Wellness consultation · summary & guidance" },
        { th: "Brunch + departure", en: "Brunch + departure" },
      ] },
    ],
    gallery: [samuiSpaRitual, samuiInfinity, samuiLongtail, spa, food, yoga],
    expert: {
      name: { th: "ดร. ปานรวีร์ ประดิษฐ์ศร", en: "Dr. Panrawee Praditsorn" },
      role: {
        th: "นักกำหนดอาหารวิชาชีพ · สถาบันโภชนาการ มหิดล (ปริญญาเอกด้านโภชนาการ ประเทศเยอรมนี) · ที่ปรึกษาโดย พญ. สวนันท์ วัชราวนิช",
        en: "Registered Dietitian · Mahidol Institute of Nutrition (PhD Nutrition, Germany) · Advised by Dr. Sawanan Watcharawanich",
      },
    },
    mealPlan: [
      { day: { th: "Day 1", en: "Day 1" },
        breakfast: { th: "—", en: "—" },
        lunch: { th: "Welcome herbal drink + light salad", en: "Welcome herbal drink + light salad" },
        dinner: { th: "ปลานึ่งสมุนไพร + ข้าวกล้อง + ผักย่าง", en: "Herb-steamed fish + brown rice + grilled veg" },
        note: { th: "งดคาเฟอีนหลัง 14:00", en: "No caffeine after 14:00" } },
      { day: { th: "Day 2", en: "Day 2" },
        breakfast: { th: "Tropical smoothie bowl + เมล็ดเจีย", en: "Tropical smoothie bowl + chia" },
        lunch: { th: "Buddha bowl ควินัว + อกไก่ + อะโวคาโด", en: "Buddha bowl: quinoa + chicken + avocado" },
        dinner: { th: "ต้มข่าเห็ด + ปลากระพงนึ่ง + ผักลวก", en: "Tom kha mushroom + steamed sea bass + greens" },
        note: { th: "ดื่มน้ำ 2.5L กระจายทั้งวัน", en: "Drink 2.5L water across the day" } },
      { day: { th: "Day 3", en: "Day 3" },
        breakfast: { th: "ไข่ลวก + อะโวคาโดโทสต์", en: "Soft-boiled eggs + avocado toast" },
        lunch: { th: "Light bowl ก่อนเดินทาง", en: "Light bowl before travel" },
        dinner: { th: "—", en: "—" },
        note: { th: "รับแผนอาหาร 7 วันกลับบ้าน", en: "Take home a 7-day meal plan" } },
    ],
  },
  {
    id: "reset-3",
    name: { th: "The Samui Reset", en: "The Samui Reset" },
    duration: { th: "3 วัน 2 คืน", en: "3 days · 2 nights" },
    nights: 2,
    price: 38000,
    tagline: { th: "Short escape สำหรับคน timeline แน่น", en: "Short escape for tight schedules." },
    matches: ["feeler", "thinker", "explorer"],
    image: programReset,
    venue: { th: "Bo Phut Beach Villa", en: "Bo Phut Beach Villa" },
    highlights: [
      { th: "Welcome Sound Bath ริมหาด", en: "Beachside Welcome Sound Bath" },
      { th: "Signature Thai Massage 90 นาที", en: "Signature Thai Massage · 90 min" },
      { th: "Sunrise Yoga 2 เช้า", en: "Sunrise Yoga · 2 mornings" },
      { th: "Wellness Chef Dinner", en: "Wellness Chef Dinner" },
    ],
    schedule: [
      { day: { th: "Day 1 — Arrival", en: "Day 1 — Arrival" }, items: [
        { th: "เช็คอินวิลล่า", en: "Villa check-in" },
        { th: "Welcome herbal mocktail", en: "Welcome herbal mocktail" },
        { th: "Sunset breathwork ริมหาด", en: "Beachside sunset breathwork" },
        { th: "Healing dinner", en: "Healing dinner" },
      ] },
      { day: { th: "Day 2 — Restore", en: "Day 2 — Restore" }, items: [
        { th: "Sunrise yoga", en: "Sunrise yoga" },
        { th: "Body composition scan", en: "Body composition scan" },
        { th: "Signature massage 90'", en: "Signature massage 90'" },
        { th: "Sound healing", en: "Sound healing" },
      ] },
      { day: { th: "Day 3 — Carry On", en: "Day 3 — Carry On" }, items: [
        { th: "Sunrise meditation", en: "Sunrise meditation" },
        { th: "Wellness brunch", en: "Wellness brunch" },
        { th: "Personal report consult", en: "Personal report consult" },
        { th: "Departure transfer", en: "Departure transfer" },
      ] },
    ],
    gallery: [programReset, villa, spa, food, meditation, yoga],
    expert: {
      name: { th: "ดร. ภัทรา วงศ์สุข", en: "Dr. Pattara Wongsuk" },
      role: { th: "Wellness Physician & Sleep Specialist", en: "Wellness Physician & Sleep Specialist" },
    },
    mealPlan: [
      { day: { th: "Day 1 — Arrival", en: "Day 1 — Arrival" },
        breakfast: { th: "—", en: "—" },
        lunch: { th: "Welcome herbal mocktail + light salad", en: "Welcome herbal mocktail + light salad" },
        dinner: { th: "Healing dinner: ปลานึ่งมะนาว + ข้าวกล้อง + ผักย่าง", en: "Healing dinner: steamed lime fish + brown rice + grilled veg" },
        note: { th: "งดคาเฟอีนหลัง 14:00 เพื่อเตรียม sleep cycle", en: "No caffeine after 14:00 to prep your sleep cycle" } },
      { day: { th: "Day 2 — Restore", en: "Day 2 — Restore" },
        breakfast: { th: "Tropical smoothie bowl + chia + coconut yoghurt", en: "Tropical smoothie bowl + chia + coconut yoghurt" },
        lunch: { th: "Buddha bowl ควินัว + อกไก่ + อะโวคาโด", en: "Buddha bowl: quinoa + chicken breast + avocado" },
        dinner: { th: "ต้มข่าเห็ด + ปลากระพงนึ่ง + ผักลวก", en: "Tom kha mushroom + steamed sea bass + blanched greens" },
        note: { th: "ดื่มน้ำ 2.5L กระจายทั้งวัน", en: "Drink 2.5L water spread across the day" } },
      { day: { th: "Day 3 — Carry On", en: "Day 3 — Carry On" },
        breakfast: { th: "Wellness brunch: ไข่ลวก + อะโวคาโดโทสต์", en: "Wellness brunch: soft-boiled eggs + avocado toast" },
        lunch: { th: "Light bowl ก่อนเดินทาง", en: "Light bowl before travel" },
        dinner: { th: "—", en: "—" },
        note: { th: "เตรียมรายการอาหารกลับบ้าน 7 วัน", en: "Prep a 7-day home meal list" } },
    ],
  },
  {
    id: "balance-5",
    name: { th: "Mindful Balance", en: "Mindful Balance" },
    duration: { th: "5 วัน 4 คืน", en: "5 days · 4 nights" },
    nights: 4,
    price: 72000,
    tagline: { th: "Sweet spot — เห็นผลจริง ไม่หักโหม", en: "Sweet spot — real results, no overload." },
    matches: ["warrior", "thinker", "feeler"],
    image: programBalance,
    venue: { th: "Chaweng Noi Wellness Resort", en: "Chaweng Noi Wellness Resort" },
    highlights: [
      { th: "1:1 Wellness Coach ทุกวัน", en: "1:1 Wellness Coach every day" },
      { th: "5 Treatments แบบ tailor-made", en: "5 tailor-made treatments" },
      { th: "Detox Juice Day", en: "Detox Juice Day" },
      { th: "Sunrise yoga + Sunset breathwork", en: "Sunrise yoga + sunset breathwork" },
    ],
    schedule: [
      { day: { th: "Day 1", en: "Day 1" }, items: [
        { th: "Check-in + intake", en: "Check-in + intake" },
        { th: "Welcome ritual", en: "Welcome ritual" },
        { th: "Light dinner", en: "Light dinner" },
      ] },
      { day: { th: "Day 2", en: "Day 2" }, items: [
        { th: "Yoga", en: "Yoga" },
        { th: "Lymphatic massage", en: "Lymphatic massage" },
        { th: "Coaching session", en: "Coaching session" },
        { th: "Sound bath", en: "Sound bath" },
      ] },
      { day: { th: "Day 3", en: "Day 3" }, items: [
        { th: "Juice cleanse day", en: "Juice cleanse day" },
        { th: "Forest bathing", en: "Forest bathing" },
        { th: "Meditation", en: "Meditation" },
      ] },
      { day: { th: "Day 4", en: "Day 4" }, items: [
        { th: "Active flow yoga", en: "Active flow yoga" },
        { th: "Signature treatment", en: "Signature treatment" },
        { th: "Sunset breathwork", en: "Sunset breathwork" },
      ] },
      { day: { th: "Day 5", en: "Day 5" }, items: [
        { th: "Final report", en: "Final report" },
        { th: "Brunch", en: "Brunch" },
        { th: "Departure", en: "Departure" },
      ] },
    ],
    gallery: [programBalance, meditation, yoga, spa, food, villa],
    expert: {
      name: { th: "นพ. กฤษฎา ศิริชัย", en: "Dr. Krisada Sirichai" },
      role: { th: "Functional Medicine Doctor", en: "Functional Medicine Doctor" },
    },
    mealPlan: [
      { day: { th: "Day 1", en: "Day 1" },
        breakfast: { th: "—", en: "—" },
        lunch: { th: "Welcome bowl: ปลาทูน่า + ผักสด", en: "Welcome bowl: tuna + fresh greens" },
        dinner: { th: "Light dinner: ต้มยำกุ้ง clear soup + ข้าวกล้อง", en: "Light dinner: clear tom yum kung + brown rice" } },
      { day: { th: "Day 2", en: "Day 2" },
        breakfast: { th: "Acai bowl + เมล็ดแฟลกซ์", en: "Acai bowl + flax seeds" },
        lunch: { th: "Quinoa & roasted veggie bowl + ทาฮีนี", en: "Quinoa & roasted veggie bowl + tahini" },
        dinner: { th: "ปลาย่างสมุนไพร + สลัดผักไทย", en: "Herb-grilled fish + Thai garden salad" },
        note: { th: "เริ่ม intermittent 12:12", en: "Start 12:12 intermittent fasting" } },
      { day: { th: "Day 3 — Juice Cleanse", en: "Day 3 — Juice Cleanse" },
        breakfast: { th: "Green juice (cucumber + apple + ginger)", en: "Green juice (cucumber + apple + ginger)" },
        lunch: { th: "Beet & carrot juice + almond milk", en: "Beet & carrot juice + almond milk" },
        dinner: { th: "Bone broth + steamed greens", en: "Bone broth + steamed greens" },
        note: { th: "วันล้างพิษ ดื่มน้ำเปล่า 3L", en: "Cleanse day — drink 3L water" } },
      { day: { th: "Day 4", en: "Day 4" },
        breakfast: { th: "Coconut yoghurt + berries + granola", en: "Coconut yoghurt + berries + granola" },
        lunch: { th: "Salmon poke bowl + edamame", en: "Salmon poke bowl + edamame" },
        dinner: { th: "อกไก่ย่าง + ผักรวมย่าง + quinoa", en: "Grilled chicken + roasted veg + quinoa" } },
      { day: { th: "Day 5", en: "Day 5" },
        breakfast: { th: "Farewell brunch: omelette + อะโวคาโด + เห็ด", en: "Farewell brunch: omelette + avocado + mushroom" },
        lunch: { th: "—", en: "—" },
        dinner: { th: "—", en: "—" } },
    ],
  },
  {
    id: "transform-7",
    name: { th: "Full Transformation", en: "Full Transformation" },
    duration: { th: "7 วัน 6 คืน", en: "7 days · 6 nights" },
    nights: 6,
    price: 128000,
    tagline: { th: "Deep work — เปลี่ยนนิสัย เปลี่ยนชีวิต", en: "Deep work — change habits, change life." },
    matches: ["performer", "warrior", "comfort"],
    image: programTransform,
    venue: { th: "Lamai Hilltop Sanctuary", en: "Lamai Hilltop Sanctuary" },
    highlights: [
      { th: "ตรวจสุขภาพละเอียด + Metabolic test", en: "Detailed health check + metabolic test" },
      { th: "Detox protocol 7 วัน", en: "7-day detox protocol" },
      { th: "Personal trainer + nutrition coach", en: "Personal trainer + nutrition coach" },
      { th: "Habit blueprint สำหรับ 90 วันถัดไป", en: "Habit blueprint for the next 90 days" },
    ],
    schedule: [
      { day: { th: "Day 1", en: "Day 1" }, items: [
        { th: "Intake + full assessment", en: "Intake + full assessment" },
        { th: "Welcome dinner", en: "Welcome dinner" },
      ] },
      { day: { th: "Day 2-3", en: "Day 2-3" }, items: [
        { th: "Detox start", en: "Detox start" },
        { th: "Daily yoga", en: "Daily yoga" },
        { th: "Lymphatic + sauna ritual", en: "Lymphatic + sauna ritual" },
      ] },
      { day: { th: "Day 4-5", en: "Day 4-5" }, items: [
        { th: "Active training", en: "Active training" },
        { th: "Cold plunge", en: "Cold plunge" },
        { th: "Sound healing", en: "Sound healing" },
      ] },
      { day: { th: "Day 6", en: "Day 6" }, items: [
        { th: "Integration day", en: "Integration day" },
        { th: "1:1 coaching", en: "1:1 coaching" },
      ] },
      { day: { th: "Day 7", en: "Day 7" }, items: [
        { th: "Final report + 90-day plan", en: "Final report + 90-day plan" },
        { th: "Departure", en: "Departure" },
      ] },
    ],
    gallery: [programTransform, yoga, spa, villa, food, meditation],
    expert: {
      name: { th: "ดร. ปริญญ์ ตั้งจิตร", en: "Dr. Parin Tangchitr" },
      role: { th: "Performance Physician & Nutrition Coach", en: "Performance Physician & Nutrition Coach" },
    },
    mealPlan: [
      { day: { th: "Day 1", en: "Day 1" },
        breakfast: { th: "—", en: "—" },
        lunch: { th: "Intake — light bowl ปลานึ่ง + ผักสด", en: "Intake — light bowl: steamed fish + greens" },
        dinner: { th: "Welcome dinner: salmon + roasted root veg", en: "Welcome dinner: salmon + roasted root veg" } },
      { day: { th: "Day 2", en: "Day 2" },
        breakfast: { th: "Detox green smoothie + chia", en: "Detox green smoothie + chia" },
        lunch: { th: "Buddha bowl ควินัว + อกไก่ย่าง", en: "Buddha bowl: quinoa + grilled chicken" },
        dinner: { th: "Bone broth + steamed fish + ผักลวก", en: "Bone broth + steamed fish + blanched greens" },
        note: { th: "เริ่ม detox protocol", en: "Start detox protocol" } },
      { day: { th: "Day 3", en: "Day 3" },
        breakfast: { th: "Coconut yoghurt + berries", en: "Coconut yoghurt + berries" },
        lunch: { th: "Light fish ceviche + avocado", en: "Light fish ceviche + avocado" },
        dinner: { th: "Veggie miso soup + tofu", en: "Veggie miso soup + tofu" } },
      { day: { th: "Day 4", en: "Day 4" },
        breakfast: { th: "Tropical smoothie bowl", en: "Tropical smoothie bowl" },
        lunch: { th: "Grilled salmon + quinoa + salad", en: "Grilled salmon + quinoa + salad" },
        dinner: { th: "อกไก่อบสมุนไพร + sweet potato", en: "Herb-roasted chicken + sweet potato" } },
      { day: { th: "Day 5", en: "Day 5" },
        breakfast: { th: "Egg white omelette + avocado", en: "Egg white omelette + avocado" },
        lunch: { th: "Steak salad (grass-fed) + greens", en: "Steak salad (grass-fed) + greens" },
        dinner: { th: "Light Thai clear soup + ปลาย่าง", en: "Light Thai clear soup + grilled fish" } },
      { day: { th: "Day 6", en: "Day 6" },
        breakfast: { th: "Overnight oats + almond butter", en: "Overnight oats + almond butter" },
        lunch: { th: "Poke bowl + edamame", en: "Poke bowl + edamame" },
        dinner: { th: "Integration dinner: chef tasting menu (clean)", en: "Integration dinner: chef tasting menu (clean)" } },
      { day: { th: "Day 7", en: "Day 7" },
        breakfast: { th: "Farewell brunch", en: "Farewell brunch" },
        lunch: { th: "—", en: "—" },
        dinner: { th: "—", en: "—" },
        note: { th: "รับ 90-day meal blueprint กลับบ้าน", en: "Take home your 90-day meal blueprint" } },
    ],
  },
];

export function programsForPersona(p: PersonaId) {
  return [...programs].sort((a, b) => {
    const aM = a.matches.includes(p) ? 0 : 1;
    const bM = b.matches.includes(p) ? 0 : 1;
    return aM - bM;
  });
}
