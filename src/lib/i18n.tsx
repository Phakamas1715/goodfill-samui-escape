import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "th" | "en";

type Dict = Record<string, { th: string; en: string }>;

export const dict = {
  "nav.home": { th: "หน้าแรก", en: "Home" },
  "nav.quest": { th: "แบบประเมิน", en: "Quest" },
  "nav.programs": { th: "แพ็คเกจ", en: "Programs" },
  "nav.journey": { th: "การเดินทาง", en: "Journey" },
  "nav.care": { th: "ดูแลต่อเนื่อง", en: "Care" },
  "nav.cta": { th: "เริ่มแบบประเมิน", en: "Start Quest" },
  "nav.menu": { th: "เมนู", en: "Menu" },

  "hero.kicker": { th: "Koh Samui · Wellness Journey", en: "Koh Samui · Wellness Journey" },
  "hero.brand": { th: "Goodfill Care", en: "Goodfill Care" },
  "hero.title1": { th: "สัมผัสบรรยากาศ", en: "Experience" },
  "hero.title2": { th: "เกาะสมุย", en: "Koh Samui" },
  "hero.title3": { th: "ที่ออกแบบเพื่อคุณคนเดียว", en: "designed just for you" },
  "hero.desc": {
    th: "แบบประเมิน 8 ข้อ · 6 Wellness Personas · จับคู่โปรแกรมพักผ่อนระดับลักชัวรี่กับพาร์ทเนอร์รีสอร์ทและสปาบนเกาะสมุย",
    en: "An 8-question quest, 6 wellness personas, matched with luxury programs from our resort and spa partners on Koh Samui.",
  },
  "hero.ctaStart": { th: "เริ่มแบบประเมิน · 8 นาที", en: "Start Quest · 8 min" },
  "hero.btnJourney": { th: "การเดินทาง 5 ขั้น", en: "5-Phase Journey" },
  "hero.btnPersonas": { th: "6 Personas", en: "6 Personas" },
  "hero.btnSamui": { th: "บรรยากาศสมุย", en: "Samui Atmosphere" },
  "hero.stat.min": { th: "นาที / Quest", en: "Min Quest" },
  "hero.stat.credits": { th: "Calm Credits", en: "Calm Credits" },
  "hero.stat.personas": { th: "Personas", en: "Personas" },
  "hero.stat.partners": { th: "พาร์ทเนอร์", en: "Partners" },
  "hero.greeting1": { th: "สวัสดีค่ะ", en: "Welcome" },
  "hero.greeting2": {
    th: "พร้อมพาคุณค้นพบโปรแกรมที่ใช่บนเกาะสมุยแล้วค่ะ ✨",
    en: "Ready to find the program that fits you on Koh Samui ✨",
  },

  "modal.journey.kicker": { th: "Goodfill Journey", en: "Goodfill Journey" },
  "modal.journey.title": { th: "การเดินทาง 5 ขั้นตอน", en: "Our 5-Phase Journey" },
  "modal.personas.kicker": { th: "Wellness Personas", en: "Wellness Personas" },
  "modal.personas.title": { th: "คุณอยู่ในกลุ่มไหน?", en: "Which persona are you?" },
  "modal.personas.sub": {
    th: "แบบประเมินจะค้นพบบุคลิกด้าน wellness และจับคู่โปรแกรมที่ใช่",
    en: "The quest reveals your wellness persona and matches the right program.",
  },
  "modal.personas.cta": { th: "เริ่มค้นหา Persona", en: "Find My Persona" },
  "modal.samui.kicker": { th: "Koh Samui", en: "Koh Samui" },
  "modal.samui.title": { th: "บรรยากาศที่ทำให้ทุกอย่างช้าลง", en: "Where everything slows down" },

  "phase.01.title": { th: "Pre-arrival Wellness Quest", en: "Pre-arrival Wellness Quest" },
  "phase.01.desc": {
    th: "ตอบ 8 ข้อ ค้นพบ Wellness Persona ของคุณ พร้อมรับ 300 Calm Credits",
    en: "Answer 8 questions, discover your wellness persona, get 300 Calm Credits.",
  },
  "phase.02.title": { th: "Personalized Program", en: "Personalized Program" },
  "phase.02.desc": {
    th: "AI จับคู่แพ็คเกจที่เหมาะกับร่างกาย ไลฟ์สไตล์ และเป้าหมายของคุณ",
    en: "AI matches a package to your body, lifestyle and goals.",
  },
  "phase.03.title": { th: "Partner Service Experience", en: "Partner Service Experience" },
  "phase.03.desc": {
    th: "เครือข่ายรีสอร์ท สปา และผู้เชี่ยวชาญที่ผ่านการคัดสรรบนเกาะสมุย",
    en: "Curated network of resorts, spas and specialists on Koh Samui.",
  },
  "phase.04.title": { th: "Final Wellness Report", en: "Final Wellness Report" },
  "phase.04.desc": {
    th: "สรุปผล Before/After พร้อมแผน 90 วันต่อจากนี้",
    en: "Before / after summary plus a 90-day plan.",
  },
  "phase.05.title": { th: "Long-term Goodfill Care", en: "Long-term Goodfill Care" },
  "phase.05.desc": {
    th: "ติดตาม habit · สะสม Calm Credits · กลับมาทุกฤดูที่คุณต้องการ",
    en: "Track habits, earn Calm Credits, return every season.",
  },

  "samui.yoga": { th: "โยคะรับอรุณ", en: "Sunrise Yoga" },
  "samui.spa": { th: "สปา Signature", en: "Signature Spa" },
  "samui.villa": { th: "วิลล่าส่วนตัว", en: "Private Villa" },
  "samui.food": { th: "อาหาร Wellness", en: "Wellness Cuisine" },
  "samui.med": { th: "สมาธิ", en: "Meditation" },
  "samui.sunrise": { th: "อรุณสมุย", en: "Samui Sunrise" },
} satisfies Dict;

export type TKey = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }>({
  lang: "th",
  setLang: () => {},
  t: (k) => dict[k].th,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("th");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gf-lang") as Lang | null;
      if (saved === "en" || saved === "th") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("gf-lang", l);
    } catch {}
  };

  const t = (k: TKey) => dict[k][lang];
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);