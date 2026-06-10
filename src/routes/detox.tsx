import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Leaf,
  Droplets,
  Smartphone,
  Salad,
  Sun,
  HeartPulse,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Clock,
} from "lucide-react";
import { Nav } from "@/components/Nav";

export const Route = createFileRoute("/detox")({
  head: () => ({
    meta: [
      { title: "Detox & Cleanse Retreats in Koh Samui — Goodfill Care" },
      {
        name: "description",
        content:
          "คู่มือ Detox & Cleanse ที่เกาะสมุย — Juice Cleanse, Digital Detox, Liver & Gut Reset และโปรแกรมล้างพิษแบบองค์รวมจากพาร์ทเนอร์ Goodfill Care",
      },
      { property: "og:title", content: "Detox & Cleanse in Koh Samui — Holistic Reset Guide" },
      {
        property: "og:description",
        content:
          "Juice cleanse, digital detox, liver & gut reset, and signature wellness detox programs in Koh Samui curated by Goodfill Care.",
      },
      { property: "og:url", content: "https://goodfillcare-samui.com/detox" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://goodfillcare-samui.com/detox" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Detox & Cleanse Retreats in Koh Samui",
          about: ["detox cleanse thailand", "juice cleanse koh samui", "digital detox retreat"],
          inLanguage: "th-TH",
          publisher: {
            "@type": "Organization",
            name: "Goodfill Care",
            url: "https://goodfillcare-samui.com",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Detox ที่เกาะสมุยใช้เวลานานแค่ไหน?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "โปรแกรมล้างพิษพื้นฐานเริ่มที่ 3 วัน 2 คืน เหมาะกับ reset ลำไส้และการนอน ส่วนโปรแกรม full transformation 7 วัน 6 คืน เหมาะกับการล้างพิษตับและฟื้นฟูระบบเผาผลาญ",
              },
            },
            {
              "@type": "Question",
              name: "Juice Cleanse กับ Water Fast ต่างกันอย่างไร?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Juice Cleanse ใช้น้ำผักผลไม้สดให้พลังงานวันละ 800-1,200 kcal เหมาะกับผู้เริ่มต้น Water Fast ต้องอยู่ในการดูแลของแพทย์เท่านั้นและไม่เหมาะกับทุกคน — Goodfill Care แนะนำเริ่มจาก Juice Cleanse",
              },
            },
            {
              "@type": "Question",
              name: "Digital Detox คืออะไร?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "การงดใช้สมาร์ทโฟน โซเชียลมีเดีย และอีเมล 24-72 ชั่วโมง ร่วมกับกิจกรรม mindfulness, sunrise yoga และ forest bathing เพื่อลดความเครียดและฟื้นฟูระบบประสาทอัตโนมัติ",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: DetoxGuide,
});

const modalities = [
  {
    icon: Droplets,
    th: "Juice Cleanse 3 วัน",
    en: "Cold-Pressed Juice Cleanse",
    desc: "น้ำผักผลไม้สดเย็น 6 ขวด/วัน ล้างลำไส้ ฟื้น microbiome และพักระบบย่อยอาหารแบบนุ่มนวล",
    duration: "3 วัน",
  },
  {
    icon: Smartphone,
    th: "Digital Detox 48 ชั่วโมง",
    en: "Off-Grid Mindfulness Retreat",
    desc: "งดหน้าจอ จับคู่กับ sunrise yoga, forest bathing และ guided breathwork ลดคอร์ติซอล ฟื้นการนอน",
    duration: "48 ชม.",
  },
  {
    icon: Leaf,
    th: "Liver & Gut Reset 5 วัน",
    en: "Functional Medicine Cleanse",
    desc: "โปรแกรมล้างพิษตับ-ลำไส้แบบ functional medicine ร่วมกับสมุนไพรไทย, IV drip และ infrared sauna",
    duration: "5 วัน",
  },
  {
    icon: Salad,
    th: "Plant-Based Reset 7 วัน",
    en: "Whole-Food Plant-Based",
    desc: "อาหารพืชล้วน high-fiber, low-glycemic ปรับโดยนักโภชนาการ ผลลัพธ์: น้ำหนักลด, energy เพิ่ม",
    duration: "7 วัน",
  },
  {
    icon: Sun,
    th: "Heat & Cold Therapy",
    en: "Sauna · Ice Bath Protocol",
    desc: "Contrast therapy ฟื้นฟูระบบไหลเวียน, brown-fat activation, ลดอักเสบเรื้อรัง — 4 รอบ/วัน",
    duration: "Daily",
  },
  {
    icon: HeartPulse,
    th: "Stress Reset Lab",
    en: "HRV-Guided Recovery",
    desc: "วัด HRV ทุกเช้า ปรับโปรแกรมพักผ่อน-สมาธิตามจังหวะระบบประสาทอัตโนมัติของคุณ",
    duration: "Daily",
  },
];

const faqs = [
  {
    q: "Detox ที่เกาะสมุยเหมาะกับใครบ้าง?",
    a: "เหมาะสำหรับผู้ที่นอนไม่หลับเรื้อรัง มีอาการ burn out, ปัญหาระบบย่อยอาหาร ท้องอืด หรือต้องการ reset น้ำหนักหลังช่วงเทศกาล รวมถึงผู้บริหารและครีเอเตอร์ที่ใช้หน้าจอมากกว่า 10 ชั่วโมงต่อวัน",
  },
  {
    q: "ต้องเตรียมตัวอะไรก่อนมา Detox?",
    a: "แนะนำลดคาเฟอีนและอาหารแปรรูป 3-5 วันก่อนเริ่มโปรแกรม รวมถึงงดแอลกอฮอล์ 7 วัน เพื่อให้ร่างกายตอบสนองต่อการล้างพิษได้ดีที่สุด",
  },
  {
    q: "มีโปรแกรมสำหรับมือใหม่ไหม?",
    a: "มี! Juice Cleanse 3 วัน และ Digital Detox 48 ชั่วโมง เป็นโปรแกรมเริ่มต้นที่ Gentle และเหมาะสำหรับผู้ที่เพิ่งเคยทำ Detox ครั้งแรก",
  },
];

function DetoxGuide() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-ivory via-white to-ivory">
      <Nav />

      {/* Hero Section — larger */}
      <header className="px-5 md:px-10 pt-28 md:pt-32 pb-16 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] md:text-xs font-semibold mb-4">
          <Sparkles size={12} /> Guide · Detox & Cleanse
        </div>
        <h1 className="font-display text-[2.8rem] sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] mt-2">
          Detox ที่เกาะสมุย —
          <br />
          <em className="text-gold italic font-normal">การล้างพิษแบบองค์รวม</em>
        </h1>
        <p className="mt-6 text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl text-navy/80">
          คู่มือฉบับครบสำหรับผู้ที่กำลังมองหาโปรแกรม detox cleanse Thailand — ตั้งแต่ juice cleanse
          3 วัน, digital detox retreat, ไปจนถึง liver & gut reset แบบ functional medicine ที่
          Goodfill Care ดูแลร่วมกับวิลล่าและสปาพาร์ทเนอร์บนเกาะสมุย
        </p>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-6 mt-8 pt-4">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-full bg-emerald/10 flex items-center justify-center">
              <Users size={18} className="text-emerald" />
            </div>
            <div>
              <div className="font-bold text-navy text-lg">500+</div>
              <div className="text-[10px] text-muted-foreground">ผู้เข้าร่วม</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-full bg-gold/10 flex items-center justify-center">
              <Clock size={18} className="text-gold" />
            </div>
            <div>
              <div className="font-bold text-navy text-lg">6+</div>
              <div className="text-[10px] text-muted-foreground">โปรแกรม</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-full bg-sky/10 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-sky-600" />
            </div>
            <div>
              <div className="font-bold text-navy text-lg">98%</div>
              <div className="text-[10px] text-muted-foreground">พอใจ</div>
            </div>
          </div>
        </div>
      </header>

      {/* Modalities Section — larger cards */}
      <section className="px-5 md:px-10 pb-20 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-navy">
            6 Detox Modalities
          </h2>
          <p className="text-base md:text-lg text-navy/70 mt-3 max-w-2xl mx-auto">
            เลือกโปรแกรมที่เหมาะกับเป้าหมายของคุณ — ตั้งแต่เริ่มต้นเบาๆ ไปจนถึงการฟื้นฟูแบบองค์รวม
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {modalities.map((m, idx) => (
            <article
              key={m.en}
              className="group rounded-2xl bg-white border border-emerald-deep/10 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="size-12 rounded-xl bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center">
                  <m.icon className="size-6 text-gold" aria-hidden="true" />
                </div>
                {m.duration && (
                  <span className="text-[10px] font-semibold text-emerald bg-emerald/10 px-2 py-1 rounded-full">
                    {m.duration}
                  </span>
                )}
              </div>
              <h3 className="font-display text-xl md:text-2xl mt-4 text-navy">{m.th}</h3>
              <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gold/80 mt-1 font-medium">
                {m.en}
              </p>
              <p className="text-sm md:text-base leading-relaxed mt-3 text-navy/75">{m.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Who is this for — larger */}
      <section className="px-5 md:px-10 pb-20 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-deep/5 to-transparent rounded-3xl p-6 md:p-8">
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-navy mb-6">
            ใครเหมาะกับ Detox Retreat?
          </h2>
          <ul className="space-y-3 text-base md:text-lg text-navy/80 leading-relaxed">
            <li className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald shrink-0 mt-0.5" />
              <span>ผู้ที่นอนไม่หลับเรื้อรัง คอร์ติซอลสูง รู้สึก burn out จากงาน</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald shrink-0 mt-0.5" />
              <span>ผู้ที่มีปัญหาระบบย่อยอาหาร ท้องอืด IBS หรืออาการแพ้อาหาร</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald shrink-0 mt-0.5" />
              <span>ผู้ที่ต้องการ reset น้ำหนัก-เผาผลาญ หลังช่วงเทศกาลหรือเดินทาง</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald shrink-0 mt-0.5" />
              <span>
                ผู้บริหาร / ครีเอเตอร์ที่ใช้หน้าจอ &gt;10 ชั่วโมง/วัน — เหมาะกับ digital detox
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ Section — new */}
      <section className="px-5 md:px-10 pb-20 max-w-4xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-navy text-center mb-10">
          คำถามที่พบบ่อย
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 md:p-6 border border-mint/30 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-navy text-base md:text-lg mb-2">{faq.q}</h3>
              <p className="text-sm md:text-base text-navy/70 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section — larger */}
      <section className="px-5 md:px-10 pb-24 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-emerald-deep to-emerald rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl">
            เริ่ม Detox Journey ของคุณ
          </h2>
          <p className="mt-3 text-base md:text-lg text-white/90 max-w-md mx-auto">
            ทำแบบประเมิน 8 ข้อเพื่อให้เราจัดโปรแกรม detox ที่เหมาะกับร่างกายและจังหวะชีวิตคุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              to="/quest"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-emerald-deep font-semibold hover:bg-gold hover:text-navy transition-all shadow-lg hover:shadow-xl"
            >
              เริ่มแบบประเมิน <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition-all"
            >
              ดูโปรแกรมทั้งหมด
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs md:text-sm text-muted-foreground">
          โปรแกรม Detox ทั้งหมดอยู่ภายใต้การดูแลของผู้เชี่ยวชาญด้านสุขภาพและโภชนาการของ Goodfill
          Care
        </p>
      </section>
    </div>
  );
}
