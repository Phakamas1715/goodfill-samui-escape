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

  "common.back": { th: "ย้อนกลับ", en: "Back" },
  "common.next": { th: "ถัดไป", en: "Next" },
  "common.viewResult": { th: "ดูผลลัพธ์", en: "See Result" },
  "common.startQuest": { th: "เริ่มแบบประเมิน", en: "Start Quest" },
  "common.seePrograms": { th: "ดูโปรแกรม", en: "See Programs" },
  "common.viewDetail": { th: "ดูรายละเอียด", en: "View Details" },
  "common.bookAgain": { th: "จองอีกครั้ง", en: "Book Again" },
  "common.swipeHint": { th: "ปัดซ้าย-ขวาเพื่อดูแพ็คเกจ", en: "Swipe left/right to browse" },
  "common.swipeShort": { th: "ปัดซ้าย–ขวา", en: "swipe" },
  "common.startFrom": { th: "เริ่มต้น", en: "From" },

  "quest.subtitle": { th: "+300 Calm Credits เมื่อทำเสร็จ", en: "+300 Calm Credits on completion" },
  "quest.kicker": { th: "Wellness Quest", en: "Wellness Quest" },

  "persona.empty.kicker": { th: "Wellness Persona", en: "Wellness Persona" },
  "persona.empty.title": { th: "ยังไม่มีผลลัพธ์", en: "No result yet" },
  "persona.empty.subtitle": { th: "ตอบ 8 ข้อสั้นๆ เพื่อค้นพบ persona", en: "Answer 8 short questions to find your persona" },
  "persona.kicker": { th: "Your Wellness Persona", en: "Your Wellness Persona" },
  "persona.secondary": { th: "Persona รอง", en: "Secondary Persona" },
  "persona.pillars": { th: "4 Wellness Pillars", en: "4 Wellness Pillars" },
  "persona.recommended": { th: "โปรแกรมที่แนะนำ", en: "Recommended Programs" },

  "programs.kicker": { th: "Personalized Programs", en: "Personalized Programs" },
  "programs.title": { th: "แพ็คเกจที่เกาะสมุย", en: "Packages on Koh Samui" },
  "programs.subtitleFor": { th: "แนะนำสำหรับ", en: "Recommended for" },
  "programs.subtitlePick": { th: "เลือกระยะเวลาที่เหมาะกับคุณ", en: "Pick the duration that fits you" },
  "programs.count": { th: "แพ็คเกจ", en: "packages" },
  "programs.notFound": { th: "ไม่พบโปรแกรม", en: "Program not found" },
  "programs.backAll": { th: "← กลับไปดูโปรแกรมทั้งหมด", en: "← Back to all programs" },
  "programs.allLink": { th: "โปรแกรมทั้งหมด", en: "All programs" },
  "programs.pricePerPerson": { th: "ราคาต่อท่าน", en: "Price per person" },
  "programs.priceIncludes": { th: "รวมที่พัก อาหาร และทรีตเมนต์", en: "Includes lodging, meals, and treatments" },
  "programs.useCredits": { th: "ใช้ {n} Calm Credits ได้ในการชำระ", en: "Use {n} Calm Credits at checkout" },
  "programs.booked": { th: "✓ จองแล้ว — ดู Journey", en: "✓ Booked — View Journey" },
  "programs.booking": { th: "กำลังจอง...", en: "Booking..." },
  "programs.confirmBook": { th: "ยืนยันการจอง & รับใบจอง LINE", en: "Confirm Booking & Get LINE Receipt" },
  "programs.goJourney": { th: "ไปที่ My Journey →", en: "Go to My Journey →" },
  "programs.highlights": { th: "Highlights", en: "Highlights" },
  "programs.itineraryKicker": { th: "Day-by-day itinerary", en: "Day-by-day itinerary" },
  "programs.itineraryTitle": { th: "ตารางการเดินทาง", en: "Itinerary" },
  "programs.mealKicker": { th: "Expert Meal Plan", en: "Expert Meal Plan" },
  "programs.mealTitleBy": { th: "แผนอาหารโดย", en: "Meal plan by" },
  "programs.fullMeal": { th: "ดูแผนอาหารเต็มรูปแบบ", en: "See the full meal plan" },
  "programs.sending": { th: "กำลังส่งใบจองทาง LINE...", en: "Sending LINE receipt..." },
  "programs.bookedToast": { th: "ยืนยันการจอง {id} — ส่งใบจองทาง LINE แล้ว", en: "Booking confirmed {id} — LINE receipt sent" },
  "programs.partialFail": { th: "จองสำเร็จ แต่ส่ง LINE บางส่วนล้มเหลว", en: "Booked, but some LINE deliveries failed" },
  "programs.errorToast": { th: "เกิดข้อผิดพลาด กรุณาลองใหม่", en: "Something went wrong. Please try again." },

  "meals.notFound": { th: "ไม่พบแผนอาหาร", en: "Meal plan not found" },
  "meals.backJourney": { th: "กลับ My Journey", en: "Back to My Journey" },
  "meals.kicker": { th: "Expert Meal Plan", en: "Expert Meal Plan" },
  "meals.plannedBy": { th: "วางแผนโดย", en: "Planned by" },
  "meals.breakfast": { th: "เช้า", en: "Breakfast" },
  "meals.lunch": { th: "กลางวัน", en: "Lunch" },
  "meals.dinner": { th: "เย็น", en: "Dinner" },
  "meals.showAtRestaurant": { th: "แสดงหน้านี้ที่ห้องอาหาร เพื่อรับมื้ออาหารตามแผนของคุณ", en: "Show this page at the restaurant to receive your planned meals" },

  "journey.empty.kicker": { th: "My Journey", en: "My Journey" },
  "journey.empty.title": { th: "ยังไม่มีการจอง", en: "No booking yet" },
  "journey.empty.subtitle": { th: "เลือกโปรแกรมก่อนเริ่ม Journey", en: "Choose a program to start your Journey" },
  "journey.kicker": { th: "Phase 3 · Partner Experience", en: "Phase 3 · Partner Experience" },
  "journey.title": { th: "My Journey · วันนี้", en: "My Journey · Today" },
  "journey.checkinAt": { th: "เช็คอิน", en: "Check-in" },
  "journey.qrTitle": { th: "Service QR", en: "Service QR" },
  "journey.qrHint": { th: "แสดง QR ให้พาร์ทเนอร์", en: "Show QR to partner" },
  "journey.qrOpen": { th: "เปิด QR", en: "Open QR" },
  "journey.moodTitle": { th: "Daily mood", en: "Daily mood" },
  "journey.moodHint": { th: "วันนี้รู้สึกอย่างไร? (+20)", en: "How do you feel today? (+20)" },
  "journey.moodLogged": { th: "✓ +20 Calm Credits", en: "✓ +20 Calm Credits" },
  "journey.endTripHint": { th: "เมื่อจบทริปแล้ว ดูสรุปผล", en: "When your trip ends, view the summary" },
  "journey.finalReport": { th: "ดู Final Report", en: "View Final Report" },

  "care.kicker": { th: "Phase 5 · Long-term Care", en: "Phase 5 · Long-term Care" },
  "care.title": { th: "Care Plan ของคุณ", en: "Your Care Plan" },
  "care.subtitle": { th: "ติดตามนิสัย · สะสม Calm Credits", en: "Track habits · earn Calm Credits" },
  "care.streak": { th: "Streak (days)", en: "Streak (days)" },
  "care.yourPersona": { th: "Your persona", en: "Your persona" },
  "care.readyToStart": { th: "พร้อมเริ่มสะสมพลังบวกหรือยังคะ?", en: "Ready to start collecting good energy?" },
  "care.firstMission": { th: "เริ่มภารกิจแรก →", en: "Start your first mission →" },
  "care.habitsTitle": { th: "นิสัยวันนี้ · Daily Habits", en: "Today's Habits · Daily" },
  "care.checkinHint": { th: "เริ่มเช็กอินตรงนี้", en: "Tap to check in" },
  "care.alumniTitle": { th: "Alumni · −15% · กลับมาอีกครั้ง", en: "Alumni · −15% · Come back again" },

  "habit.meditation": { th: "Morning meditation 5'", en: "Morning meditation 5'" },
  "habit.hydration": { th: "Hydration 2L", en: "Hydration 2L" },
  "habit.screen": { th: "No screen after 10pm", en: "No screen after 10pm" },

  "footer.tagline": {
    th: "แพลตฟอร์มดูแลสุขภาพแบบครบวงจร สำหรับการพักผ่อนระดับพรีเมียมที่เกาะสมุย",
    en: "An all-in-one wellness platform for premium retreats on Koh Samui.",
  },
  "footer.experience": { th: "ประสบการณ์", en: "Experience" },
  "footer.forTeams": { th: "สำหรับทีม", en: "For Teams" },
  "footer.contact": { th: "ติดต่อ", en: "Contact" },
  "footer.location": { th: "เกาะสมุย · สุราษฎร์ธานี · ประเทศไทย", en: "Koh Samui · Surat Thani · Thailand" },
  "footer.rights": { th: "Create your best version", en: "Create your best version" },

  "report.kicker": { th: "Phase 4 · Final Report", en: "Phase 4 · Final Report" },
  "report.title": { th: "7 วันที่เปลี่ยนคุณ", en: "7 days that changed you" },
  "report.subtitle": { th: "Before / After summary", en: "Before / After summary" },
  "report.personaLabel": { th: "Wellness Persona", en: "Wellness Persona" },
  "report.alumniBadge": { th: "Alumni Badge", en: "Alumni Badge" },
  "report.before": { th: "Before", en: "Before" },
  "report.after": { th: "After", en: "After" },
  "report.statHabits": { th: "Habits", en: "Habits" },
  "report.statCredits": { th: "Credits", en: "Credits" },
  "report.statDays": { th: "Days @ Samui", en: "Days @ Samui" },
  "report.startCare": { th: "เริ่ม Care Plan 90 วัน", en: "Start 90-day Care Plan" },
  "report.sleep": { th: "Sleep Quality", en: "Sleep Quality" },
  "report.energy": { th: "Energy Level", en: "Energy Level" },
  "report.hrv": { th: "Heart Rate Variability", en: "Heart Rate Variability" },
  "report.stress": { th: "Stress Score", en: "Stress Score" },

  "hero.kicker": { th: "Koh Samui · Wellness Journey", en: "Koh Samui · Wellness Journey" },
  "hero.brand": { th: "Goodfill Care", en: "Goodfill Care" },
  "hero.title1": { th: "สัมผัสบรรยากาศ", en: "Experience" },
  "hero.title2": { th: "เกาะสมุย", en: "Koh Samui" },
  "hero.title3": { th: "ที่ออกแบบเพื่อคุณคนเดียว", en: "designed just for you" },
  "hero.desc": {
    th: "Luxury Personalized Wellness Companion — ดูแลสุขภาพและความสุขของคุณ แบบที่คุณไม่ต้องคิดเอง · 8 คำถาม · 6 Personas · ผู้เชี่ยวชาญรับรอง · QR รับบริการ · Calm Credits",
    en: "Luxury Personalized Wellness Companion — we take care of your wellbeing so you don't have to think. 8 questions · 6 personas · expert-reviewed · QR redemption · Calm Credits.",
  },
  "hero.ctaStart": { th: "เริ่มแบบประเมิน · 8 นาที", en: "Start Quest · 8 min" },
  "hero.btnJourney": { th: "การเดินทาง 5 ขั้น", en: "5-Phase Journey" },
  "hero.btnPersonas": { th: "6 Personas", en: "6 Personas" },
  "hero.btnSamui": { th: "บรรยากาศสมุย", en: "Samui Atmosphere" },
  "hero.btnCompany": { th: "เกี่ยวกับบริษัท", en: "About Company" },
  "hero.btnPartners": { th: "พาร์ทเนอร์เป้าหมาย", en: "Target Partners" },
  "hero.note": {
    th: "ผลประเมินใช้แนะนำโปรแกรม Wellness เบื้องต้น ไม่ใช่การวินิจฉัยโรค โปรแกรมจริงผ่านการตรวจสอบโดยผู้เชี่ยวชาญก่อนให้บริการ",
    en: "Quest results suggest wellness programs only — not a medical diagnosis. Real programs are reviewed by experts before service.",
  },
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

  "modal.company.kicker": { th: "บริษัทแม่ · Parent Company", en: "Parent Company" },
  "modal.company.title": { th: "Samui 741 · Hospitality crafted by the island", en: "Samui 741 · Hospitality crafted by the island" },
  "modal.company.intro": {
    th: "Samui 741 หลอมรวมความเชี่ยวชาญด้าน ร้านอาหาร โรงแรม อสังหาริมทรัพย์ สปา และการท่องเที่ยว สู่บทใหม่ของ Wellness — Goodfill Care คือแพลตฟอร์มสุขภาพในเครือ ที่นำประสบการณ์ทั้งหมดมารวมไว้ในที่เดียว",
    en: "Samui 741 fuses expertise across Restaurants, Hotels, Real Estate, Spa and Tourism into a new wellness chapter — Goodfill Care is its in-house wellness platform that brings every craft together.",
  },
  "modal.company.s1": { th: "Restaurants · ร้านอาหารพรีเมียม", en: "Restaurants · Premium dining" },
  "modal.company.s2": { th: "Hotels · โรงแรมและรีสอร์ทบูทีค", en: "Hotels · Boutique resorts" },
  "modal.company.s3": { th: "Real Estate · พูลวิลล่า & คอนโด", en: "Real Estate · Villas & condos" },
  "modal.company.s4": { th: "Spa · ทรีตเมนต์โดยผู้เชี่ยวชาญ", en: "Spa · Expert treatments" },
  "modal.company.s5": { th: "Tourism · ทัวร์ไพรเวต", en: "Tourism · Private journeys" },
  "modal.company.s6": { th: "Wellness · Goodfill Care", en: "Wellness · Goodfill Care" },
  "modal.company.contact": { th: "ติดต่อเรา", en: "Contact" },
  "modal.company.addr": {
    th: "บริษัท สมุย 741 จำกัด · 99/201 หมู่ 2 ต.บ่อผุด อ.เกาะสมุย จ.สุราษฎร์ธานี 84320",
    en: "Samui 741 Co., Ltd. · 99/201 Moo 2, Bo Phut, Koh Samui, Surat Thani 84320",
  },
  "modal.company.visit": { th: "เยี่ยมชม samui-741.com", en: "Visit samui-741.com" },
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

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);

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