import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Droplets, Smartphone, Salad, Sun, HeartPulse, ArrowRight } from "lucide-react";
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
                text:
                  "โปรแกรมล้างพิษพื้นฐานเริ่มที่ 3 วัน 2 คืน เหมาะกับ reset ลำไส้และการนอน ส่วนโปรแกรม full transformation 7 วัน 6 คืน เหมาะกับการล้างพิษตับและฟื้นฟูระบบเผาผลาญ",
              },
            },
            {
              "@type": "Question",
              name: "Juice Cleanse กับ Water Fast ต่างกันอย่างไร?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Juice Cleanse ใช้น้ำผักผลไม้สดให้พลังงานวันละ 800-1,200 kcal เหมาะกับผู้เริ่มต้น Water Fast ต้องอยู่ในการดูแลของแพทย์เท่านั้นและไม่เหมาะกับทุกคน — Goodfill Care แนะนำเริ่มจาก Juice Cleanse",
              },
            },
            {
              "@type": "Question",
              name: "Digital Detox คืออะไร?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "การงดใช้สมาร์ทโฟน โซเชียลมีเดีย และอีเมล 24-72 ชั่วโมง ร่วมกับกิจกรรม mindfulness, sunrise yoga และ forest bathing เพื่อลดความเครียดและฟื้นฟูระบบประสาทอัตโนมัติ",
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
  },
  {
    icon: Smartphone,
    th: "Digital Detox 48 ชั่วโมง",
    en: "Off-Grid Mindfulness Retreat",
    desc: "งดหน้าจอ จับคู่กับ sunrise yoga, forest bathing และ guided breathwork ลดคอร์ติซอล ฟื้นการนอน",
  },
  {
    icon: Leaf,
    th: "Liver & Gut Reset 5 วัน",
    en: "Functional Medicine Cleanse",
    desc: "โปรแกรมล้างพิษตับ-ลำไส้แบบ functional medicine ร่วมกับสมุนไพรไทย, IV drip และ infrared sauna",
  },
  {
    icon: Salad,
    th: "Plant-Based Reset 7 วัน",
    en: "Whole-Food Plant-Based",
    desc: "อาหารพืชล้วน high-fiber, low-glycemic ปรับโดยนักโภชนาการ ผลลัพธ์: น้ำหนักลด, energy เพิ่ม",
  },
  {
    icon: Sun,
    th: "Heat & Cold Therapy",
    en: "Sauna · Ice Bath Protocol",
    desc: "Contrast therapy ฟื้นฟูระบบไหลเวียน, brown-fat activation, ลดอักเสบเรื้อรัง — 4 รอบ/วัน",
  },
  {
    icon: HeartPulse,
    th: "Stress Reset Lab",
    en: "HRV-Guided Recovery",
    desc: "วัด HRV ทุกเช้า ปรับโปรแกรมพักผ่อน-สมาธิตามจังหวะระบบประสาทอัตโนมัติของคุณ",
  },
];

function DetoxGuide() {
  return (
    <div className="min-h-dvh bg-ivory text-emerald-deep">
      <Nav />
      <header className="px-5 md:px-10 pt-28 md:pt-32 pb-12 max-w-5xl mx-auto">
        <p className="text-[11px] tracking-[0.4em] uppercase text-gold font-medium">Guide · Detox & Cleanse</p>
        <h1 className="font-display text-[2.4rem] md:text-6xl leading-[1.05] mt-4">
          Detox ที่เกาะสมุย —
          <br />
          <em className="text-gold italic font-normal">การล้างพิษแบบองค์รวม</em>
        </h1>
        <p className="mt-6 text-base md:text-lg leading-relaxed max-w-3xl">
          คู่มือฉบับครบสำหรับผู้ที่กำลังมองหาโปรแกรม detox cleanse Thailand —
          ตั้งแต่ juice cleanse 3 วัน, digital detox retreat, ไปจนถึง liver & gut reset แบบ functional medicine
          ที่ Goodfill Care ดูแลร่วมกับวิลล่าและสปาพาร์ทเนอร์บนเกาะสมุย
        </p>
      </header>

      <section className="px-5 md:px-10 pb-16 max-w-5xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl mb-6">6 Detox Modalities</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {modalities.map((m) => (
            <article
              key={m.en}
              className="rounded-2xl bg-white border border-emerald-deep/10 p-6 shadow-sm hover:shadow-md transition"
            >
              <m.icon className="size-7 text-gold" aria-hidden="true" />
              <h3 className="font-display text-xl mt-3">{m.th}</h3>
              <p className="text-[11px] tracking-[0.3em] uppercase text-gold/80 mt-1">{m.en}</p>
              <p className="text-sm leading-relaxed mt-3 text-emerald-deep/80">{m.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-10 pb-16 max-w-3xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl mb-6">ใครเหมาะกับ Detox Retreat?</h2>
        <ul className="space-y-3 text-emerald-deep/85 leading-relaxed">
          <li>• ผู้ที่นอนไม่หลับเรื้อรัง คอร์ติซอลสูง รู้สึก burn out จากงาน</li>
          <li>• ผู้ที่มีปัญหาระบบย่อยอาหาร ท้องอืด IBS หรืออาการแพ้อาหาร</li>
          <li>• ผู้ที่ต้องการ reset น้ำหนัก-เผาผลาญ หลังช่วงเทศกาลหรือเดินทาง</li>
          <li>• ผู้บริหาร / ครีเอเตอร์ที่ใช้หน้าจอ &gt;10 ชั่วโมง/วัน — เหมาะกับ digital detox</li>
        </ul>
      </section>

      <section className="px-5 md:px-10 pb-24 max-w-3xl mx-auto text-center">
        <h2 className="font-display text-2xl md:text-3xl">เริ่ม Detox Journey ของคุณ</h2>
        <p className="mt-3 text-emerald-deep/80">
          ทำแบบประเมิน 8 ข้อเพื่อให้เราจัดโปรแกรม detox ที่เหมาะกับร่างกายและจังหวะชีวิตคุณ
        </p>
        <Link
          to="/quest"
          className="inline-flex items-center gap-2 mt-6 px-7 py-3.5 rounded-full bg-emerald-deep text-ivory font-medium hover:bg-emerald-deep/90 transition"
        >
          เริ่มแบบประเมิน <ArrowRight className="size-4" />
        </Link>
        <p className="mt-4 text-sm">
          หรือ{" "}
          <Link to="/programs" className="text-gold underline underline-offset-4">
            ดูโปรแกรม wellness ทั้งหมด
          </Link>
        </p>
      </section>
    </div>
  );
}