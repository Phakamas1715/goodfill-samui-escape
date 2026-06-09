import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react";

export type Lang = "th" | "en";

// ============================================================================
// Types
// ============================================================================

type NestedDict = {
  [key: string]: string | NestedDict | { th: string; en: string };
};

type TranslationValue = { th: string; en: string };

type TranslationRecord = Record<string, TranslationValue>;

type TFunction = (key: string, params?: Record<string, string | number>) => string;

// ============================================================================
// Helper: Flatten nested dictionary
// ============================================================================

function flattenDict(obj: NestedDict, prefix = ""): TranslationRecord {
  const result: TranslationRecord = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && "th" in value && "en" in value) {
      // Already in { th, en } format
      result[fullKey] = value as TranslationValue;
    } else if (value && typeof value === "object") {
      // Nested object
      Object.assign(result, flattenDict(value as NestedDict, fullKey));
    }
  }

  return result;
}

// ============================================================================
// Translation Data
// ============================================================================

const nestedDict = {
  nav: {
    home: { th: "หน้าแรก", en: "Home" },
    quest: { th: "แบบประเมิน", en: "Quest" },
    programs: { th: "แพ็คเกจ", en: "Programs" },
    journey: { th: "การเดินทาง", en: "Journey" },
    care: { th: "ดูแลต่อเนื่อง", en: "Care" },
    cta: { th: "เริ่มแบบประเมิน", en: "Start Quest" },
    menu: { th: "เมนู", en: "Menu" },
  },
  common: {
    back: { th: "ย้อนกลับ", en: "Back" },
    next: { th: "ถัดไป", en: "Next" },
    viewResult: { th: "ดูผลลัพธ์", en: "See Result" },
    startQuest: { th: "เริ่มแบบประเมิน", en: "Start Quest" },
    seePrograms: { th: "ดูโปรแกรม", en: "See Programs" },
    viewDetail: { th: "ดูรายละเอียด", en: "View Details" },
    bookAgain: { th: "จองอีกครั้ง", en: "Book Again" },
    swipeHint: { th: "ปัดซ้าย-ขวาเพื่อดูแพ็คเกจ", en: "Swipe left/right to browse" },
    swipeShort: { th: "ปัดซ้าย–ขวา", en: "swipe" },
    startFrom: { th: "เริ่มต้น", en: "From" },
  },
  quest: {
    subtitle: { th: "+300 Calm Credits เมื่อทำเสร็จ", en: "+300 Calm Credits on completion" },
    kicker: { th: "Wellness Quest", en: "Wellness Quest" },
  },
  persona: {
    empty: {
      kicker: { th: "Wellness Persona", en: "Wellness Persona" },
      title: { th: "ยังไม่มีผลลัพธ์", en: "No result yet" },
      subtitle: { th: "ตอบ 8 ข้อสั้นๆ เพื่อค้นพบ persona", en: "Answer 8 short questions to find your persona" },
    },
    kicker: { th: "Your Wellness Persona", en: "Your Wellness Persona" },
    secondary: { th: "Persona รอง", en: "Secondary Persona" },
    pillars: { th: "4 Wellness Pillars", en: "4 Wellness Pillars" },
    recommended: { th: "โปรแกรมที่แนะนำ", en: "Recommended Programs" },
  },
  programs: {
    kicker: { th: "Personalized Programs", en: "Personalized Programs" },
    title: { th: "แพ็คเกจที่เกาะสมุย", en: "Packages on Koh Samui" },
    subtitleFor: { th: "แนะนำสำหรับ", en: "Recommended for" },
    subtitlePick: { th: "เลือกระยะเวลาที่เหมาะกับคุณ", en: "Pick the duration that fits you" },
    count: { th: "แพ็คเกจ", en: "packages" },
    notFound: { th: "ไม่พบโปรแกรม", en: "Program not found" },
    backAll: { th: "← กลับไปดูโปรแกรมทั้งหมด", en: "← Back to all programs" },
    allLink: { th: "โปรแกรมทั้งหมด", en: "All programs" },
    pricePerPerson: { th: "ราคาต่อท่าน", en: "Price per person" },
    priceIncludes: { th: "รวมที่พัก อาหาร และทรีตเมนต์", en: "Includes lodging, meals, and treatments" },
    useCredits: { th: "ใช้ {n} Calm Credits ได้ในการชำระ", en: "Use {n} Calm Credits at checkout" },
    booked: { th: "✓ จองแล้ว — ดู Journey", en: "✓ Booked — View Journey" },
    booking: { th: "กำลังจอง...", en: "Booking..." },
    confirmBook: { th: "ยืนยันการจอง & รับใบจอง LINE", en: "Confirm Booking & Get LINE Receipt" },
    goJourney: { th: "ไปที่ My Journey →", en: "Go to My Journey →" },
    highlights: { th: "Highlights", en: "Highlights" },
    itineraryKicker: { th: "Day-by-day itinerary", en: "Day-by-day itinerary" },
    itineraryTitle: { th: "ตารางการเดินทาง", en: "Itinerary" },
    mealKicker: { th: "Expert Meal Plan", en: "Expert Meal Plan" },
    mealTitleBy: { th: "แผนอาหารโดย", en: "Meal plan by" },
    fullMeal: { th: "ดูแผนอาหารเต็มรูปแบบ", en: "See the full meal plan" },
    sending: { th: "กำลังส่งใบจองทาง LINE...", en: "Sending LINE receipt..." },
    bookedToast: { th: "ยืนยันการจอง {id} — ส่งใบจองทาง LINE แล้ว", en: "Booking confirmed {id} — LINE receipt sent" },
    partialFail: { th: "จองสำเร็จ แต่ส่ง LINE บางส่วนล้มเหลว", en: "Booked, but some LINE deliveries failed" },
    errorToast: { th: "เกิดข้อผิดพลาด กรุณาลองใหม่", en: "Something went wrong. Please try again." },
  },
  meals: {
    notFound: { th: "ไม่พบแผนอาหาร", en: "Meal plan not found" },
    backJourney: { th: "กลับ My Journey", en: "Back to My Journey" },
    kicker: { th: "Expert Meal Plan", en: "Expert Meal Plan" },
    plannedBy: { th: "วางแผนโดย", en: "Planned by" },
    breakfast: { th: "เช้า", en: "Breakfast" },
    lunch: { th: "กลางวัน", en: "Lunch" },
    dinner: { th: "เย็น", en: "Dinner" },
    showAtRestaurant: {
      th: "แสดงหน้านี้ที่ห้องอาหาร เพื่อรับมื้ออาหารตามแผนของคุณ",
      en: "Show this page at the restaurant to receive your planned meals",
    },
  },
  journey: {
    empty: {
      kicker: { th: "My Journey", en: "My Journey" },
      title: { th: "ยังไม่มีการจอง", en: "No booking yet" },
      subtitle: { th: "เลือกโปรแกรมก่อนเริ่ม Journey", en: "Choose a program to start your Journey" },
    },
    kicker: { th: "Phase 3 · Partner Experience", en: "Phase 3 · Partner Experience" },
    title: { th: "My Journey · วันนี้", en: "My Journey · Today" },
    checkinAt: { th: "เช็คอิน", en: "Check-in" },
    qrTitle: { th: "Service QR", en: "Service QR" },
    qrHint: { th: "แสดง QR ให้พาร์ทเนอร์", en: "Show QR to partner" },
    qrOpen: { th: "เปิด QR", en: "Open QR" },
    moodTitle: { th: "Daily mood", en: "Daily mood" },
    moodHint: { th: "วันนี้รู้สึกอย่างไร? (+20)", en: "How do you feel today? (+20)" },
    moodLogged: { th: "✓ +20 Calm Credits", en: "✓ +20 Calm Credits" },
    endTripHint: { th: "เมื่อจบทริปแล้ว ดูสรุปผล", en: "When your trip ends, view the summary" },
    finalReport: { th: "ดู Final Report", en: "View Final Report" },
  },
  care: {
    kicker: { th: "Phase 5 · Long-term Care", en: "Phase 5 · Long-term Care" },
    title: { th: "Care Plan ของคุณ", en: "Your Care Plan" },
    subtitle: { th: "ติดตามนิสัย · สะสม Calm Credits", en: "Track habits · earn Calm Credits" },
    streak: { th: "Streak (days)", en: "Streak (days)" },
    yourPersona: { th: "Your persona", en: "Your persona" },
    readyToStart: { th: "พร้อมเริ่มสะสมพลังบวกหรือยังคะ?", en: "Ready to start collecting good energy?" },
    firstMission: { th: "เริ่มภารกิจแรก →", en: "Start your first mission →" },
    habitsTitle: { th: "นิสัยวันนี้ · Daily Habits", en: "Today's Habits · Daily" },
    checkinHint: { th: "เริ่มเช็กอินตรงนี้", en: "Tap to check in" },
    alumniTitle: { th: "Alumni · −15% · กลับมาอีกครั้ง", en: "Alumni · −15% · Come back again" },
  },
  habit: {
    meditation: { th: "Morning meditation 5'", en: "Morning meditation 5'" },
    hydration: { th: "Hydration 2L", en: "Hydration 2L" },
    screen: { th: "No screen after 10pm", en: "No screen after 10pm" },
  },
  footer: {
    tagline: {
      th: "แพลตฟอร์มดูแลสุขภาพแบบครบวงจร สำหรับการพักผ่อนระดับพรีเมียมที่เกาะสมุย",
      en: "An all-in-one wellness platform for premium retreats on Koh Samui.",
    },
    experience: { th: "ประสบการณ์", en: "Experience" },
    forTeams: { th: "สำหรับทีม", en: "For Teams" },
    contact: { th: "ติดต่อ", en: "Contact" },
    location: { th: "เกาะสมุย · สุราษฎร์ธานี · ประเทศไทย", en: "Koh Samui · Surat Thani · Thailand" },
    rights: { th: "Create your best version", en: "Create your best version" },
  },
  report: {
    kicker: { th: "Phase 4 · Final Report", en: "Phase 4 · Final Report" },
    title: { th: "7 วันที่เปลี่ยนคุณ", en: "7 days that changed you" },
    subtitle: { th: "Before / After summary", en: "Before / After summary" },
    personaLabel: { th: "Wellness Persona", en: "Wellness Persona" },
    alumniBadge: { th: "Alumni Badge", en: "Alumni Badge" },
    before: { th: "Before", en: "Before" },
    after: { th: "After", en: "After" },
    statHabits: { th: "Habits", en: "Habits" },
    statCredits: { th: "Credits", en: "Credits" },
    statDays: { th: "Days @ Samui", en: "Days @ Samui" },
    startCare: { th: "เริ่ม Care Plan 90 วัน", en: "Start 90-day Care Plan" },
    sleep: { th: "Sleep Quality", en: "Sleep Quality" },
    energy: { th: "Energy Level", en: "Energy Level" },
    hrv: { th: "Heart Rate Variability", en: "Heart Rate Variability" },
    stress: { th: "Stress Score", en: "Stress Score" },
  },
  hero: {
    kicker: { th: "Koh Samui · Wellness Journey", en: "Koh Samui · Wellness Journey" },
    brand: { th: "Goodfill Care", en: "Goodfill Care" },
    title1: { th: "สัมผัสบรรยากาศ", en: "Experience" },
    title2: { th: "เกาะสมุย", en: "Koh Samui" },
    title3: { th: "ที่ออกแบบเพื่อคุณคนเดียว", en: "designed just for you" },
    desc: { th: "Luxury Personalized Wellness Companion", en: "Luxury Personalized Wellness Companion" },
    ctaStart: { th: "เริ่มแบบประเมิน · 8 นาที", en: "Start Quest · 8 min" },
    btnJourney: { th: "การเดินทาง 5 ขั้น", en: "5-Phase Journey" },
    btnPersonas: { th: "6 Personas", en: "6 Personas" },
    btnSamui: { th: "บรรยากาศสมุย", en: "Samui Atmosphere" },
    btnCompany: { th: "เกี่ยวกับบริษัท", en: "About Company" },
    btnPartners: { th: "พาร์ทเนอร์เป้าหมาย", en: "Target Partners" },
    note: {
      th: "ผลประเมินใช้แนะนำโปรแกรม Wellness เบื้องต้น ไม่ใช่การวินิจฉัยโรค โปรแกรมจริงผ่านการตรวจสอบโดยผู้เชี่ยวชาญก่อนให้บริการ",
      en: "Quest results suggest wellness programs only — not a medical diagnosis. Real programs are reviewed by experts before service.",
    },
    stat: {
      min: { th: "นาที / Quest", en: "Min Quest" },
      credits: { th: "Calm Credits", en: "Calm Credits" },
      personas: { th: "Personas", en: "Personas" },
      partners: { th: "พาร์ทเนอร์", en: "Partners" },
    },
    greeting1: { th: "สวัสดีค่ะ", en: "Welcome" },
    greeting2: {
      th: "พร้อมพาคุณค้นพบโปรแกรมที่ใช่บนเกาะสมุยแล้วค่ะ ✨",
      en: "Ready to find the program that fits you on Koh Samui ✨",
    },
  },
  modal: {
    journey: {
      kicker: { th: "Goodfill Journey", en: "Goodfill Journey" },
      title: { th: "การเดินทาง 5 ขั้นตอน", en: "Our 5-Phase Journey" },
    },
    personas: {
      kicker: { th: "Wellness Personas", en: "Wellness Personas" },
      title: { th: "คุณอยู่ในกลุ่มไหน?", en: "Which persona are you?" },
      sub: {
        th: "แบบประเมินจะค้นพบบุคลิกด้าน wellness และจับคู่โปรแกรมที่ใช่",
        en: "The quest reveals your wellness persona and matches the right program.",
      },
      cta: { th: "เริ่มค้นหา Persona", en: "Find My Persona" },
    },
    samui: {
      kicker: { th: "Koh Samui", en: "Koh Samui" },
      title: { th: "บรรยากาศที่ทำให้ทุกอย่างช้าลง", en: "Where everything slows down" },
    },
    company: {
      kicker: { th: "บริษัทแม่ · Parent Company", en: "Parent Company" },
      title: {
        th: "Samui 741 · Hospitality crafted by the island",
        en: "Samui 741 · Hospitality crafted by the island",
      },
      intro: {
        th: "Samui 741 หลอมรวมความเชี่ยวชาญด้าน ร้านอาหาร โรงแรม อสังหาริมทรัพย์ สปา และการท่องเที่ยว สู่บทใหม่ของ Wellness — Goodfill Care คือแพลตฟอร์มสุขภาพในเครือ ที่นำประสบการณ์ทั้งหมดมารวมไว้ในที่เดียว",
        en: "Samui 741 fuses expertise across Restaurants, Hotels, Real Estate, Spa and Tourism into a new wellness chapter — Goodfill Care is its in-house wellness platform that brings every craft together.",
      },
      s1: { th: "Restaurants · ร้านอาหารพรีเมียม", en: "Restaurants · Premium dining" },
      s2: { th: "Hotels · โรงแรมและรีสอร์ทบูทีค", en: "Hotels · Boutique resorts" },
      s3: { th: "Real Estate · พูลวิลล่า & คอนโด", en: "Real Estate · Villas & condos" },
      s4: { th: "Spa · ทรีตเมนต์โดยผู้เชี่ยวชาญ", en: "Spa · Expert treatments" },
      s5: { th: "Tourism · ทัวร์ไพรเวต", en: "Tourism · Private journeys" },
      s6: { th: "Wellness · Goodfill Care", en: "Wellness · Goodfill Care" },
      contact: { th: "ติดต่อเรา", en: "Contact" },
      addr: {
        th: "บริษัท สมุย 741 จำกัด · 99/201 หมู่ 2 ต.บ่อผุด อ.เกาะสมุย จ.สุราษฎร์ธานี 84320",
        en: "Samui 741 Co., Ltd. · 99/201 Moo 2, Bo Phut, Koh Samui, Surat Thani 84320",
      },
      visit: { th: "เยี่ยมชม samui-741.com", en: "Visit samui-741.com" },
    },
  },
  phase: {
    "01": {
      title: { th: "Pre-arrival Wellness Quest", en: "Pre-arrival Wellness Quest" },
      desc: {
        th: "ตอบ 8 ข้อ ค้นพบ Wellness Persona ของคุณ พร้อมรับ 300 Calm Credits",
        en: "Answer 8 questions, discover your wellness persona, get 300 Calm Credits.",
      },
    },
    "02": {
      title: { th: "Personalized Program", en: "Personalized Program" },
      desc: {
        th: "AI จับคู่แพ็คเกจที่เหมาะกับร่างกาย ไลฟ์สไตล์ และเป้าหมายของคุณ",
        en: "AI matches a package to your body, lifestyle and goals.",
      },
    },
    "03": {
      title: { th: "Partner Service Experience", en: "Partner Service Experience" },
      desc: {
        th: "เครือข่ายรีสอร์ท สปา และผู้เชี่ยวชาญที่ผ่านการคัดสรรบนเกาะสมุย",
        en: "Curated network of resorts, spas and specialists on Koh Samui.",
      },
    },
    "04": {
      title: { th: "Final Wellness Report", en: "Final Wellness Report" },
      desc: { th: "สรุปผล Before/After พร้อมแผน 90 วันต่อจากนี้", en: "Before / after summary plus a 90-day plan." },
    },
    "05": {
      title: { th: "Long-term Goodfill Care", en: "Long-term Goodfill Care" },
      desc: {
        th: "ติดตาม habit · สะสม Calm Credits · กลับมาทุกฤดูที่คุณต้องการ",
        en: "Track habits, earn Calm Credits, return every season.",
      },
    },
  },
  samui: {
    yoga: { th: "โยคะรับอรุณ", en: "Sunrise Yoga" },
    spa: { th: "สปา Signature", en: "Signature Spa" },
    villa: { th: "วิลล่าส่วนตัว", en: "Private Villa" },
    food: { th: "อาหาร Wellness", en: "Wellness Cuisine" },
    med: { th: "สมาธิ", en: "Meditation" },
    sunrise: { th: "อรุณสมุย", en: "Samui Sunrise" },
  },
} as const;

// ============================================================================
// Flatten translations
// ============================================================================

export const dict = flattenDict(nestedDict);

export type TKey = keyof typeof dict;

// ============================================================================
// Interpolation Helper
// ============================================================================

function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;

  return str.replace(/{([^{}]+)}/g, (match, key) => {
    const value = params[key.trim()];
    return value !== undefined ? String(value) : match;
  });
}

// ============================================================================
// Context
// ============================================================================

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: TFunction;
  translate: TFunction;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ============================================================================
// Provider Component
// ============================================================================

interface LanguageProviderProps {
  children: ReactNode;
  defaultLang?: Lang;
}

export function LanguageProvider({ children, defaultLang = "th" }: LanguageProviderProps) {
  const [lang, setLangState] = useState<Lang>(defaultLang);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved language preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gf-lang") as Lang | null;
      if (saved === "en" || saved === "th") {
        setLangState(saved);
      }
    } catch {}
    setIsHydrated(true);
  }, []);

  // Update HTML lang attribute
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [lang]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem("gf-lang", newLang);
    } catch {}
  }, []);

  const t = useCallback<TFunction>(
    (key: string, params?: Record<string, string | number>) => {
      const translation = dict[key as TKey];
      if (!translation) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[i18n] Missing translation key: ${key}`);
        }
        return key;
      }
      const text = translation[lang];
      return interpolate(text, params);
    },
    [lang],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t,
      translate: t,
      dir: "ltr",
    }),
    [lang, setLang, t],
  );

  // Avoid hydration mismatch
  if (!isHydrated) {
    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ============================================================================
// Hooks
// ============================================================================

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }
  return context;
}

// ============================================================================
// Higher-Order Component
// ============================================================================

export function withI18n<P extends object>(Component: React.ComponentType<P & { t: TFunction; lang: Lang }>) {
  return function WrappedComponent(props: P) {
    const { t, lang } = useI18n();
    return <Component {...props} t={t} lang={lang} />;
  };
}

// ============================================================================
// Server-side helper
// ============================================================================

export function getTranslation(key: TKey, lang: Lang, params?: Record<string, string | number>): string {
  const translation = dict[key];
  if (!translation) {
    return key;
  }
  const text = translation[lang];
  return interpolate(text, params);
}
