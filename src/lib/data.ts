// Goodfill Care — quest, personas, programs (static client data)

import heroSamui from "@/assets/hero-samui.jpg";
import yoga from "@/assets/yoga-sunrise.jpg";
import spa from "@/assets/spa-treatment.jpg";
import food from "@/assets/wellness-food.jpg";
import villa from "@/assets/villa-pool.jpg";
import meditation from "@/assets/meditation.jpg";
import programReset from "@/assets/program-reset.jpg";
import programBalance from "@/assets/program-balance.jpg";
import programTransform from "@/assets/program-transform.jpg";
import mealBreakfast from "@/assets/meal-breakfast.jpg";
import mealLunch from "@/assets/meal-lunch.jpg";
import mealDinner from "@/assets/meal-dinner.jpg";

export const images = {
  heroSamui, yoga, spa, food, villa, meditation,
  programReset, programBalance, programTransform,
  mealBreakfast, mealLunch, mealDinner,
};

export type PersonaId =
  | "warrior"
  | "thinker"
  | "comfort"
  | "feeler"
  | "performer"
  | "explorer";

export interface Persona {
  id: PersonaId;
  name: string;
  thaiName: string;
  tagline: string;
  description: string;
  color: string; // tailwind class fragment
  pillars: string[];
}

export const personas: Record<PersonaId, Persona> = {
  warrior: {
    id: "warrior",
    name: "The Silent Warrior",
    thaiName: "นักสู้เงียบ",
    tagline: "ผู้รับผิดชอบสูง อดทน ดูแลทุกอย่างให้ดีที่สุด",
    description:
      "คุณเป็นคนรับผิดชอบสูง อดทน และพยายามดูแลทุกอย่างให้ดีที่สุด แต่ร่างกายอาจเริ่มสะสมความล้าโดยไม่รู้ตัว",
    color: "from-slate-500/30 to-emerald-700/30",
    pillars: ["Executive Recovery", "Deep Tissue Massage", "Sleep Restoration", "Adrenal Reset"],
  },
  thinker: {
    id: "thinker",
    name: "The Midnight Thinker",
    thaiName: "นกฮูกคิดมาก",
    tagline: "คนคิดลึก วางแผนเก่ง ละเอียดรอบคอบ",
    description:
      "คุณเป็นคนคิดลึก วางแผนเก่ง และละเอียดรอบคอบ แต่สมองที่ไม่ค่อยได้พัก อาจส่งผลต่อการนอนและความสดชื่นในแต่ละวัน",
    color: "from-indigo-500/30 to-violet-700/30",
    pillars: ["Sleep Recovery", "Nervous System Reset", "Mind Quieting", "Breathwork"],
  },
  comfort: {
    id: "comfort",
    name: "The Comfort Seeker",
    thaiName: "ผู้แสวงหาความสบายใจ",
    tagline: "เชื่อมอาหารกับอารมณ์อย่างสมดุล",
    description:
      "คุณมักใช้ความอร่อย ความสบาย หรือสิ่งคุ้นเคยช่วยปลอบใจในวันที่เหนื่อย โปรแกรมจึงเน้นเชื่อมอาหารกับอารมณ์อย่างสมดุล",
    color: "from-amber-500/30 to-rose-600/30",
    pillars: ["Gut Health", "Emotional Balance", "Thai Herbal Nutrition", "Mindful Eating"],
  },
  feeler: {
    id: "feeler",
    name: "The Deep Feeler",
    thaiName: "ผู้รู้สึกลึก",
    tagline: "คืนพื้นที่ให้ใจได้พักจริง ๆ",
    description:
      "คุณรับรู้อารมณ์และรายละเอียดรอบตัวได้ลึก บางครั้งใช้พลังใจมากกว่าที่คิด โปรแกรมจึงคืนพื้นที่ให้ใจได้พักจริง ๆ",
    color: "from-violet-500/30 to-indigo-700/30",
    pillars: ["Emotional Reset", "Mindfulness", "Sound Healing", "Calm Balance"],
  },
  performer: {
    id: "performer",
    name: "The High Performer",
    thaiName: "เครื่องยนต์สมรรถนะสูง",
    tagline: "ฟื้นฟูเข้มข้นสำหรับคนใช้พลังงานสูง",
    description:
      "คุณมีเป้าหมายชัดและใช้พลังงานสูง การเร่งต่อเนื่องทำให้ร่างกายต้องการการฟื้นฟูอย่างจริงจัง",
    color: "from-rose-500/30 to-amber-600/30",
    pillars: ["Executive Detox", "Energy Reset", "Premium Recovery", "Performance Nutrition"],
  },
  explorer: {
    id: "explorer",
    name: "The Wellness Explorer",
    thaiName: "นักสำรวจสุขภาพ",
    tagline: "ระบบช่วยจัดลำดับว่าควรเริ่มจากอะไร",
    description:
      "คุณพร้อมเริ่มดูแลตัวเองและเปิดรับสิ่งใหม่ ต้องการระบบที่ช่วยจัดลำดับให้ชัดว่าควรเริ่มจากอะไรก่อน",
    color: "from-emerald-500/30 to-teal-600/30",
    pillars: ["Wellness Discovery", "Samui Starter", "Personal Roadmap", "Habit Foundation"],
  },
};

export interface QuestOption {
  label: string;
  weights: Partial<Record<PersonaId, number>>;
}
export interface QuestQuestion {
  id: number;
  emoji: string;
  question: string;
  options: QuestOption[];
}

export const questions: QuestQuestion[] = [
  {
    id: 1,
    emoji: "☀️",
    question: "พลังงานของคุณในเช้าวันใหม่เป็นแบบไหน?",
    options: [
      { label: "ตื่นมายังล้า ต้องพึ่งกาแฟหรือเครื่องดื่มช่วยเริ่มวัน", weights: { performer: 2, warrior: 2, comfort: 1 } },
      { label: "เริ่มวันได้ดี แต่พลังงานตกเร็วช่วงบ่าย", weights: { performer: 2, thinker: 2 } },
      { label: "อยากนอนต่อ รู้สึกว่ายังพักไม่พอ", weights: { thinker: 2, feeler: 2 } },
      { label: "พลังงานพอใช้ ค่อย ๆ เริ่มวันแบบไม่รีบ", weights: { explorer: 3 } },
    ],
  },
  {
    id: 2,
    emoji: "🌊",
    question: "ช่วงนี้ความเครียดของคุณมักแสดงออกแบบไหน?",
    options: [
      { label: "รู้สึกแน่นในใจ หรือคิดเรื่องเดิมซ้ำ ๆ", weights: { thinker: 3, feeler: 1 } },
      { label: "หงุดหงิดง่าย หรือรู้สึกต้องรีบจัดการทุกอย่าง", weights: { performer: 2, warrior: 2 } },
      { label: "อยากอยู่เงียบ ๆ ไม่อยากคุยกับใคร", weights: { feeler: 3 } },
      { label: "ยังรับมือได้ แต่รู้ว่าตัวเองต้องการพักบ้าง", weights: { explorer: 2, warrior: 1 } },
    ],
  },
  {
    id: 3,
    emoji: "🌙",
    question: "การนอนของคุณในช่วง 2 สัปดาห์ที่ผ่านมาเป็นอย่างไร?",
    options: [
      { label: "หลับยาก เพราะสมองยังคิดเรื่องงานหรือชีวิต", weights: { thinker: 3 } },
      { label: "หลับได้ แต่ตื่นกลางดึก หรือตื่นมาไม่สดชื่น", weights: { warrior: 2, thinker: 1 } },
      { label: "นอนน้อย เพราะเวลาชีวิตไม่เป็นระบบ", weights: { performer: 2, comfort: 1 } },
      { label: "นอนได้พอสมควร แต่อยากให้หลับลึกกว่านี้", weights: { explorer: 2, feeler: 1 } },
    ],
  },
  {
    id: 4,
    emoji: "🍵",
    question: "เวลาเหนื่อยหรือเครียด คุณมักดูแลตัวเองอย่างไร?",
    options: [
      { label: "หาอาหาร ของหวาน หรือเครื่องดื่มที่ทำให้รู้สึกดีขึ้น", weights: { comfort: 3 } },
      { label: "เลื่อนมือถือ ดูคลิป หาสิ่งเบี่ยงเบนความคิด", weights: { comfort: 1, thinker: 2 } },
      { label: "ออกไปเดิน ขยับร่างกาย หรือหาอากาศหายใจ", weights: { explorer: 2, performer: 1 } },
      { label: "เก็บไว้คนเดียว แล้วพยายามผ่านไปให้ได้", weights: { feeler: 2, warrior: 2 } },
    ],
  },
  {
    id: 5,
    emoji: "🥗",
    question: "อาหารในชีวิตประจำวันของคุณใกล้เคียงข้อไหนที่สุด?",
    options: [
      { label: "กินไม่เป็นเวลา บางมื้อข้าม บางมื้อกินหนัก", weights: { warrior: 2, performer: 2 } },
      { label: "กินตามสะดวก อะไรง่ายก็เลือกอันนั้น", weights: { comfort: 3 } },
      { label: "พยายามเลือกอาหารดีขึ้น แต่ยังทำต่อเนื่องยาก", weights: { explorer: 2, comfort: 1 } },
      { label: "ค่อนข้างใส่ใจอาหาร แต่อยากได้แผนเฉพาะตัว", weights: { explorer: 2, performer: 2 } },
    ],
  },
  {
    id: 6,
    emoji: "💆",
    question: "ร่างกายของคุณส่งสัญญาณอะไรบ่อยที่สุด?",
    options: [
      { label: "ปวดคอ บ่า ไหล่ หรือหลังจากการนั่งนาน", weights: { warrior: 2, performer: 2 } },
      { label: "ปวดหัว เหนื่อยง่าย พลังงานไม่คงที่", weights: { thinker: 2, performer: 1 } },
      { label: "ท้องอืด แน่นท้อง ระบบย่อยไม่ค่อยสบาย", weights: { comfort: 3 } },
      { label: "ไม่มีอาการชัด แต่ไม่สดชื่นเหมือนเดิม", weights: { explorer: 2, feeler: 1 } },
    ],
  },
  {
    id: 7,
    emoji: "🏝️",
    question: "ถ้าได้ไปพักที่สมุย 3 วัน คุณอยากให้ทริปนี้ช่วยอะไรมากที่สุด?",
    options: [
      { label: "ได้พักจริง ๆ ปิดเสียงรบกวน นอนให้เต็มอิ่ม", weights: { warrior: 2, thinker: 2 } },
      { label: "ให้ร่างกายฟื้นจากความล้าและอาการปวดเมื่อย", weights: { warrior: 2, performer: 2 } },
      { label: "ให้ใจสงบ ลดความคิดมาก และรู้สึกเบาขึ้น", weights: { feeler: 2, thinker: 1 } },
      { label: "กลับไปพร้อมพลังงานใหม่และแรงบันดาลใจ", weights: { performer: 2, explorer: 1 } },
    ],
  },
  {
    id: 8,
    emoji: "✨",
    question: "ถ้า Goodfill ออกแบบโปรแกรมให้ 1 อย่าง คุณอยากให้เน้นเรื่องใดมากที่สุด?",
    options: [
      { label: "Sleep Recovery — นอนหลับดีขึ้นและฟื้นตัวลึกขึ้น", weights: { thinker: 3, warrior: 1 } },
      { label: "Stress Reset — ลดความเครียดและคืนความสงบให้ใจ", weights: { feeler: 3 } },
      { label: "Body Balance — ลดปวดเมื่อยและดูแลร่างกายให้สมดุล", weights: { warrior: 2, comfort: 1 } },
      { label: "Energy Restore — เพิ่มพลังงานและความสดชื่น", weights: { performer: 3, explorer: 1 } },
    ],
  },
];

export function scorePersona(
  answers: Record<number, number>,
): PersonaId {
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
  name: string;
  duration: string;
  nights: number;
  price: number; // THB
  tagline: string;
  matches: PersonaId[];
  image: string;
  highlights: string[];
  schedule: { day: string; items: string[] }[];
  venue: string;
  gallery: string[];
  mealPlan: { day: string; breakfast: string; lunch: string; dinner: string; note?: string }[];
  expert: { name: string; role: string };
}

export const programs: Program[] = [
  {
    id: "reset-3",
    name: "The Samui Reset",
    duration: "3 วัน 2 คืน",
    nights: 2,
    price: 38000,
    tagline: "Short escape สำหรับคน timeline แน่น",
    matches: ["feeler", "thinker", "explorer"],
    image: programReset,
    venue: "Bo Phut Beach Villa",
    highlights: [
      "Welcome Sound Bath ริมหาด",
      "Signature Thai Massage 90 นาที",
      "Sunrise Yoga 2 เช้า",
      "Wellness Chef Dinner",
    ],
    schedule: [
      { day: "Day 1 — Arrival", items: ["เช็คอินวิลล่า", "Welcome herbal mocktail", "Sunset breathwork ริมหาด", "Healing dinner"] },
      { day: "Day 2 — Restore", items: ["Sunrise yoga", "Body composition scan", "Signature massage 90'", "Sound healing"] },
      { day: "Day 3 — Carry On", items: ["Sunrise meditation", "Wellness brunch", "Personal report consult", "Departure transfer"] },
    ],
    gallery: [programReset, villa, spa, food, meditation, yoga],
    expert: { name: "ดร. ภัทรา วงศ์สุข", role: "Wellness Physician & Sleep Specialist" },
    mealPlan: [
      { day: "Day 1 — Arrival", breakfast: "—", lunch: "Welcome herbal mocktail + light salad", dinner: "Healing dinner: ปลานึ่งมะนาว + ข้าวกล้อง + ผักย่าง", note: "งดคาเฟอีนหลัง 14:00 เพื่อเตรียม sleep cycle" },
      { day: "Day 2 — Restore", breakfast: "Tropical smoothie bowl + chia + coconut yoghurt", lunch: "Buddha bowl ควินัว + อกไก่ + อะโวคาโด", dinner: "ต้มข่าเห็ด + ปลากระพงนึ่ง + ผักลวก", note: "ดื่มน้ำ 2.5L กระจายทั้งวัน" },
      { day: "Day 3 — Carry On", breakfast: "Wellness brunch: ไข่ลวก + อะโวคาโดโทสต์", lunch: "Light bowl ก่อนเดินทาง", dinner: "—", note: "เตรียมรายการอาหารกลับบ้าน 7 วัน" },
    ],
  },
  {
    id: "balance-5",
    name: "Mindful Balance",
    duration: "5 วัน 4 คืน",
    nights: 4,
    price: 72000,
    tagline: "Sweet spot — เห็นผลจริง ไม่หักโหม",
    matches: ["warrior", "thinker", "feeler"],
    image: programBalance,
    venue: "Chaweng Noi Wellness Resort",
    highlights: [
      "1:1 Wellness Coach ทุกวัน",
      "5 Treatments แบบ tailor-made",
      "Detox Juice Day",
      "Sunrise yoga + Sunset breathwork",
    ],
    schedule: [
      { day: "Day 1", items: ["Check-in + intake", "Welcome ritual", "Light dinner"] },
      { day: "Day 2", items: ["Yoga", "Lymphatic massage", "Coaching session", "Sound bath"] },
      { day: "Day 3", items: ["Juice cleanse day", "Forest bathing", "Meditation"] },
      { day: "Day 4", items: ["Active flow yoga", "Signature treatment", "Sunset breathwork"] },
      { day: "Day 5", items: ["Final report", "Brunch", "Departure"] },
    ],
    gallery: [programBalance, meditation, yoga, spa, food, villa],
    expert: { name: "นพ. กฤษฎา ศิริชัย", role: "Functional Medicine Doctor" },
    mealPlan: [
      { day: "Day 1", breakfast: "—", lunch: "Welcome bowl: ปลาทูน่า + ผักสด", dinner: "Light dinner: ต้มยำกุ้ง clear soup + ข้าวกล้อง" },
      { day: "Day 2", breakfast: "Acai bowl + เมล็ดแฟลกซ์", lunch: "Quinoa & roasted veggie bowl + ทาฮีนี", dinner: "ปลาย่างสมุนไพร + สลัดผักไทย", note: "เริ่ม intermittent 12:12" },
      { day: "Day 3 — Juice Cleanse", breakfast: "Green juice (cucumber + apple + ginger)", lunch: "Beet & carrot juice + almond milk", dinner: "Bone broth + steamed greens", note: "วันล้างพิษ ดื่มน้ำเปล่า 3L" },
      { day: "Day 4", breakfast: "Coconut yoghurt + berries + granola", lunch: "Salmon poke bowl + edamame", dinner: "อกไก่ย่าง + ผักรวมย่าง + quinoa" },
      { day: "Day 5", breakfast: "Farewell brunch: omelette + อะโวคาโด + เห็ด", lunch: "—", dinner: "—" },
    ],
  },
  {
    id: "transform-7",
    name: "Full Transformation",
    duration: "7 วัน 6 คืน",
    nights: 6,
    price: 128000,
    tagline: "Deep work — เปลี่ยนนิสัย เปลี่ยนชีวิต",
    matches: ["performer", "warrior", "comfort"],
    image: programTransform,
    venue: "Lamai Hilltop Sanctuary",
    highlights: [
      "ตรวจสุขภาพละเอียด + Metabolic test",
      "Detox protocol 7 วัน",
      "Personal trainer + nutrition coach",
      "Habit blueprint สำหรับ 90 วันถัดไป",
    ],
    schedule: [
      { day: "Day 1", items: ["Intake + full assessment", "Welcome dinner"] },
      { day: "Day 2-3", items: ["Detox start", "Daily yoga", "Lymphatic + sauna ritual"] },
      { day: "Day 4-5", items: ["Active training", "Cold plunge", "Sound healing"] },
      { day: "Day 6", items: ["Integration day", "1:1 coaching"] },
      { day: "Day 7", items: ["Final report + 90-day plan", "Departure"] },
    ],
    gallery: [programTransform, yoga, spa, villa, food, meditation],
    expert: { name: "ดร. ปริญญ์ ตั้งจิตร", role: "Performance Physician & Nutrition Coach" },
    mealPlan: [
      { day: "Day 1", breakfast: "—", lunch: "Intake — light bowl ปลานึ่ง + ผักสด", dinner: "Welcome dinner: salmon + roasted root veg" },
      { day: "Day 2", breakfast: "Detox green smoothie + chia", lunch: "Buddha bowl ควินัว + อกไก่ย่าง", dinner: "Bone broth + steamed fish + ผักลวก", note: "เริ่ม detox protocol" },
      { day: "Day 3", breakfast: "Coconut yoghurt + berries", lunch: "Light fish ceviche + avocado", dinner: "Veggie miso soup + tofu" },
      { day: "Day 4", breakfast: "Tropical smoothie bowl", lunch: "Grilled salmon + quinoa + salad", dinner: "อกไก่อบสมุนไพร + sweet potato" },
      { day: "Day 5", breakfast: "Egg white omelette + avocado", lunch: "Steak salad (grass-fed) + greens", dinner: "Light Thai clear soup + ปลาย่าง" },
      { day: "Day 6", breakfast: "Overnight oats + almond butter", lunch: "Poke bowl + edamame", dinner: "Integration dinner: chef tasting menu (clean)" },
      { day: "Day 7", breakfast: "Farewell brunch", lunch: "—", dinner: "—", note: "รับ 90-day meal blueprint กลับบ้าน" },
    ],
  },
];

export function programsForPersona(p: PersonaId) {
  // sort by match, keep all
  return [...programs].sort((a, b) => {
    const aM = a.matches.includes(p) ? 0 : 1;
    const bM = b.matches.includes(p) ? 0 : 1;
    return aM - bM;
  });
}