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
  | "sleep"
  | "energy"
  | "detox"
  | "calm"
  | "shape"
  | "glow";

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
  sleep: {
    id: "sleep",
    name: "Sleep Seeker",
    thaiName: "ผู้แสวงหาการพักผ่อน",
    tagline: "คืนการนอนหลับลึกให้ร่างกาย",
    description:
      "คุณต้องการฟื้นฟูคุณภาพการนอน ลดความเครียดสะสม และตื่นมาด้วยพลังใหม่ทุกเช้า",
    color: "from-indigo-500/30 to-emerald-700/30",
    pillars: ["Sound Healing", "Sleep Massage", "Herbal Tea Ritual", "Digital Detox"],
  },
  energy: {
    id: "energy",
    name: "Energy Rebuilder",
    thaiName: "ผู้สร้างพลังใหม่",
    tagline: "เติมพลังกายและใจให้กลับมาสดใส",
    description:
      "เหมาะกับคนทำงานหนัก เหนื่อยล้าเรื้อรัง อยากกลับมามีพลังเต็มร้อย",
    color: "from-amber-500/30 to-orange-600/30",
    pillars: ["Vitality IV", "Active Yoga", "Cold Plunge", "Adaptogen Diet"],
  },
  detox: {
    id: "detox",
    name: "Detox Reset",
    thaiName: "รีเซ็ตจากภายใน",
    tagline: "ล้างพิษ ล้างสมอง เริ่มต้นใหม่",
    description:
      "ออกแบบสำหรับคนที่อยากล้างพิษทั้งร่างกายและจิตใจ พร้อมเริ่มต้นชีวิตใหม่",
    color: "from-emerald-500/30 to-teal-700/30",
    pillars: ["Juice Cleanse", "Colon Hydrotherapy", "Lymphatic Drain", "Sauna Ritual"],
  },
  calm: {
    id: "calm",
    name: "Stress Calmer",
    thaiName: "ผู้สงบจิต",
    tagline: "ผ่อนคลายจิตใจอย่างลึกซึ้ง",
    description:
      "สำหรับคนเครียดเรื้อรัง วิตกกังวล อยากกลับมาสงบและมีสมาธิ",
    color: "from-violet-500/30 to-indigo-700/30",
    pillars: ["Meditation Coaching", "Breathwork", "Forest Bathing", "Aromatherapy"],
  },
  shape: {
    id: "shape",
    name: "Body Reshape",
    thaiName: "ปรับรูปร่างจากภายใน",
    tagline: "หุ่นกระชับ สุขภาพดี ยั่งยืน",
    description:
      "ออกแบบโปรแกรมโภชนาการและการออกกำลังกายเพื่อรูปร่างและสุขภาพระยะยาว",
    color: "from-rose-500/30 to-amber-600/30",
    pillars: ["Personal Training", "Metabolic Test", "Macro Coaching", "Body Composition"],
  },
  glow: {
    id: "glow",
    name: "Mindful Glow",
    thaiName: "เปล่งประกายจากภายใน",
    tagline: "ผิวพรรณและจิตใจเปล่งประกาย",
    description:
      "สำหรับคนที่ต้องการดูแลผิว ความงาม ควบคู่กับจิตใจที่สดใส",
    color: "from-pink-400/30 to-amber-500/30",
    pillars: ["Facial Ritual", "Collagen Bar", "Sunrise Yoga", "Mindful Journaling"],
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
    emoji: "🌙",
    question: "ในช่วง 1 เดือนที่ผ่านมา คุณรู้สึกอย่างไรมากที่สุด?",
    options: [
      { label: "นอนไม่หลับ ตื่นกลางดึก", weights: { sleep: 3, calm: 1 } },
      { label: "เหนื่อยล้า ไม่มีแรง", weights: { energy: 3, detox: 1 } },
      { label: "เครียด คิดมาก", weights: { calm: 3, sleep: 1 } },
      { label: "อยากดูดี ผิวสวยขึ้น", weights: { glow: 3, shape: 1 } },
    ],
  },
  {
    id: 2,
    emoji: "🍃",
    question: "เป้าหมายหลักของทริปนี้คือ?",
    options: [
      { label: "พักผ่อนเต็มที่ ฟื้นการนอน", weights: { sleep: 3 } },
      { label: "ล้างพิษ รีเซ็ตร่างกาย", weights: { detox: 3 } },
      { label: "ลดน้ำหนัก ปรับรูปร่าง", weights: { shape: 3 } },
      { label: "สงบจิตใจ ทำสมาธิ", weights: { calm: 3 } },
    ],
  },
  {
    id: 3,
    emoji: "💪",
    question: "วันธรรมดาของคุณ ออกกำลังกายแค่ไหน?",
    options: [
      { label: "ไม่ได้ออกเลย", weights: { energy: 2, shape: 2 } },
      { label: "เดิน/โยคะเบาๆ", weights: { calm: 2, glow: 1 } },
      { label: "ออก 2-3 ครั้ง/สัปดาห์", weights: { shape: 2, energy: 1 } },
      { label: "ออกหนักทุกวัน", weights: { detox: 1, energy: 2 } },
    ],
  },
  {
    id: 4,
    emoji: "🥗",
    question: "อาหารส่วนใหญ่ที่คุณกิน?",
    options: [
      { label: "Fast food / ของทอด", weights: { detox: 3, shape: 2 } },
      { label: "ข้าวมันไก่ อาหารตามสั่ง", weights: { detox: 2, energy: 1 } },
      { label: "คลีน/ผักผลไม้", weights: { glow: 2, shape: 1 } },
      { label: "ไม่ค่อยมีเวลากิน", weights: { energy: 3, calm: 1 } },
    ],
  },
  {
    id: 5,
    emoji: "☕",
    question: "คุณดื่มกาแฟ/ชาวันละกี่แก้ว?",
    options: [
      { label: "ไม่ดื่ม", weights: { calm: 2, sleep: 1 } },
      { label: "1 แก้ว", weights: { glow: 1, shape: 1 } },
      { label: "2-3 แก้ว", weights: { energy: 2, detox: 1 } },
      { label: "มากกว่า 3 แก้ว", weights: { detox: 2, sleep: 2 } },
    ],
  },
  {
    id: 6,
    emoji: "📱",
    question: "ใช้มือถือ/หน้าจอต่อวันประมาณ?",
    options: [
      { label: "น้อยกว่า 3 ชม.", weights: { calm: 2, glow: 1 } },
      { label: "3-6 ชม.", weights: { shape: 1, energy: 1 } },
      { label: "6-10 ชม.", weights: { sleep: 2, calm: 1 } },
      { label: "มากกว่า 10 ชม.", weights: { sleep: 3, calm: 2 } },
    ],
  },
  {
    id: 7,
    emoji: "🧘",
    question: "เคยทำสมาธิหรือ Breathwork มาก่อนไหม?",
    options: [
      { label: "ยังไม่เคย แต่อยากลอง", weights: { calm: 2, sleep: 1 } },
      { label: "เคยบ้าง แต่ไม่ต่อเนื่อง", weights: { calm: 2 } },
      { label: "ทำสม่ำเสมอ", weights: { glow: 1, calm: 1 } },
      { label: "ไม่สนใจ", weights: { shape: 2, energy: 1 } },
    ],
  },
  {
    id: 8,
    emoji: "✨",
    question: "หลังจบทริป อยากกลับไปด้วยความรู้สึกแบบไหนมากที่สุด?",
    options: [
      { label: "หลับสนิทเหมือนเด็ก", weights: { sleep: 3 } },
      { label: "พลังเต็มเปี่ยม สดใส", weights: { energy: 3 } },
      { label: "ตัวเบา รีเซ็ตเรียบร้อย", weights: { detox: 3 } },
      { label: "สงบ ใจเย็น มีสติ", weights: { calm: 3 } },
    ],
  },
];

export function scorePersona(
  answers: Record<number, number>,
): PersonaId {
  const totals: Record<PersonaId, number> = {
    sleep: 0, energy: 0, detox: 0, calm: 0, shape: 0, glow: 0,
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
  return (Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "calm") as PersonaId;
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
    matches: ["calm", "sleep", "glow"],
    image: villa,
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
  },
  {
    id: "balance-5",
    name: "Mindful Balance",
    duration: "5 วัน 4 คืน",
    nights: 4,
    price: 72000,
    tagline: "Sweet spot — เห็นผลจริง ไม่หักโหม",
    matches: ["sleep", "calm", "energy"],
    image: meditation,
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
  },
  {
    id: "transform-7",
    name: "Full Transformation",
    duration: "7 วัน 6 คืน",
    nights: 6,
    price: 128000,
    tagline: "Deep work — เปลี่ยนนิสัย เปลี่ยนชีวิต",
    matches: ["detox", "shape", "energy"],
    image: yoga,
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