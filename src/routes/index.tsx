import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Compass, HeartPulse, Leaf, MoonStar } from "lucide-react";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { images, personas } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Goodfill Care — Koh Samui Wellness Journey" },
      { name: "description", content: "เริ่มจากแบบประเมิน 8 ข้อ ค้นพบโปรแกรมพักผ่อนแบบลักชัวรี่ที่เกาะสมุย เหมาะกับร่างกายและจิตใจของคุณ" },
      { property: "og:title", content: "Goodfill Care — Koh Samui Wellness" },
      { property: "og:description", content: "Pre-arrival Quest · Personalized Program · Final Report · Long-term Care" },
      { property: "og:image", content: "/icon-512.png" },
    ],
  }),
  component: Landing,
});

const phases = [
  { num: "01", title: "Pre-arrival Wellness Quest", desc: "ตอบ 8 ข้อ ค้นพบ Wellness Persona ของคุณ พร้อมรับ 300 Calm Credits", icon: Sparkles },
  { num: "02", title: "Personalized Program", desc: "AI จับคู่แพ็คเกจที่เหมาะกับร่างกาย ไลฟ์สไตล์ และเป้าหมายของคุณ", icon: Compass },
  { num: "03", title: "Partner Service Experience", desc: "เครือข่ายรีสอร์ท สปา และผู้เชี่ยวชาญที่ผ่านการคัดสรรบนเกาะสมุย", icon: Leaf },
  { num: "04", title: "Final Wellness Report", desc: "สรุปผล Before/After พร้อมแผน 90 วันต่อจากนี้", icon: HeartPulse },
  { num: "05", title: "Long-term Goodfill Care", desc: "ติดตาม habit · สะสม Calm Credits · กลับมาทุกฤดูที่คุณต้องการ", icon: MoonStar },
];

function Landing() {
  return (
    <Shell>
      {/* HERO */}
      <section className="relative -mt-28 md:-mt-32 min-h-[92vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={images.heroSamui}
            alt="พระอาทิตย์ขึ้นที่เกาะสมุย น้ำทะเลสีเทอร์ควอยซ์ และวิลล่าวงกลมริมหาด"
            className="size-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 md:px-8 pb-16 md:pb-24 pt-44 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <Eyebrow>Koh Samui · Thailand</Eyebrow>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mt-5">
              ค้นหา <em className="gold-text not-italic">Wellness</em> <br />
              ที่ใช่สำหรับ<span className="block">ร่างกายและใจของคุณ</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              เริ่มต้นการพักผ่อนของคุณก่อนที่เครื่องบินจะลงจอด —
              แบบประเมิน 8 ข้อจะค้นพบสิ่งที่ร่างกายคุณต้องการจริงๆ
              และจับคู่กับโปรแกรมที่ออกแบบเฉพาะคุณบนเกาะสมุย
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/quest"
                className="btn-gold rounded-full px-7 py-4 inline-flex items-center gap-2 text-sm md:text-base"
              >
                เริ่มแบบประเมิน Wellness Quest
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/programs"
                className="glass rounded-full px-7 py-4 text-sm md:text-base hover:bg-white/5 transition"
              >
                ดูแพ็คเกจทั้งหมด
              </Link>
            </div>
            <div className="mt-12 flex gap-8 md:gap-12 text-sm">
              {[
                { v: "8", l: "นาทีในการประเมิน" },
                { v: "+300", l: "Calm Credits" },
                { v: "6", l: "Wellness Personas" },
                { v: "12+", l: "Partner Venues" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl md:text-3xl gold-text">{s.v}</div>
                  <div className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5 PHASES */}
      <Section>
        <div className="text-center max-w-2xl mx-auto">
          <Eyebrow>The Goodfill Journey</Eyebrow>
          <h2 className="font-display text-4xl md:text-5xl mt-4">การเดินทาง 5 ขั้นตอน</h2>
          <p className="mt-4 text-muted-foreground">
            ทุกช่วงเวลา ตั้งแต่ก่อนออกเดินทางไปจนถึงหลังกลับบ้าน
            ได้รับการดูแลอย่างต่อเนื่องและพิถีพิถัน
          </p>
        </div>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {phases.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="glass rounded-3xl p-7 hover:bg-white/5 transition group"
            >
              <div className="flex items-center justify-between">
                <div className="size-12 rounded-2xl bg-emerald/20 border border-emerald/30 grid place-items-center text-gold group-hover:scale-110 transition">
                  <p.icon size={20} />
                </div>
                <span className="font-display text-3xl text-muted-foreground/50">{p.num}</span>
              </div>
              <h3 className="font-display text-xl mt-6">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* PERSONAS PREVIEW */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Eyebrow>6 Wellness Personas</Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl mt-4">
              คุณอยู่ในกลุ่มไหน?
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              แบบประเมินจะค้นพบบุคลิกด้าน wellness ของคุณจาก 6 personas
              และจับคู่กับโปรแกรมที่เหมาะที่สุด
            </p>
            <Link
              to="/quest"
              className="mt-8 inline-flex items-center gap-2 text-gold hover:gap-3 transition-all text-sm tracking-wider uppercase"
            >
              ค้นพบ Persona ของคุณ <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(personas).map((p) => (
              <div
                key={p.id}
                className={`glass rounded-2xl p-5 bg-gradient-to-br ${p.color}`}
              >
                <div className="text-xs tracking-widest uppercase text-gold">{p.id}</div>
                <div className="font-display text-lg mt-1">{p.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.thaiName}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* IMAGE GRID */}
      <Section>
        <div className="text-center max-w-xl mx-auto">
          <Eyebrow>The Samui Experience</Eyebrow>
          <h2 className="font-display text-4xl md:text-5xl mt-4">
            จุดหมายที่ทำให้ทุกอย่าง<em className="gold-text not-italic"> ช้าลง</em>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-12 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[220px]">
          <img src={images.yoga} alt="โยคะตอนพระอาทิตย์ขึ้น" loading="lazy" className="col-span-7 md:col-span-5 row-span-2 size-full object-cover rounded-3xl" />
          <img src={images.spa} alt="สปาทรีตเมนต์" loading="lazy" className="col-span-5 md:col-span-4 row-span-1 size-full object-cover rounded-3xl" />
          <img src={images.food} alt="อาหาร wellness" loading="lazy" className="col-span-5 md:col-span-3 row-span-1 size-full object-cover rounded-3xl" />
          <img src={images.villa} alt="วิลล่าริมทะเล" loading="lazy" className="col-span-7 md:col-span-4 row-span-1 size-full object-cover rounded-3xl" />
          <img src={images.meditation} alt="พื้นที่ทำสมาธิ" loading="lazy" className="col-span-12 md:col-span-3 row-span-1 size-full object-cover rounded-3xl" />
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="glass rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-deep/30 via-transparent to-gold/10 pointer-events-none" />
          <div className="relative">
            <Eyebrow>เริ่มได้แล้ววันนี้</Eyebrow>
            <h2 className="font-display text-4xl md:text-6xl mt-5">
              ใช้เวลาเพียง <em className="gold-text not-italic">8 นาที</em>
            </h2>
            <p className="text-muted-foreground mt-5 max-w-lg mx-auto">
              แบบประเมินจะช่วยให้คุณและทีมเข้าใจกันก่อนเดินทาง
              เพื่อให้ทุกนาทีที่เกาะสมุยมีความหมายที่สุด
            </p>
            <Link to="/quest" className="btn-gold rounded-full px-8 py-4 inline-flex items-center gap-2 mt-10">
              เริ่มแบบประเมินตอนนี้ <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </Section>
    </Shell>
  );
}
