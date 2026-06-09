import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CalendarDays, ChefHat, MapPin } from "lucide-react";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { programs, type Program } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { confirmBooking } from "@/lib/booking.functions";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/programs/$id")({
  head: ({ params }) => {
    const p = programs.find((x) => x.id === params.id);
    return {
      meta: [
        { title: p ? `${p.name} — Goodfill Care` : "Program — Goodfill Care" },
        { name: "description", content: p?.tagline ?? "Wellness program ที่เกาะสมุย" },
      ],
    };
  },
  notFoundComponent: () => (
    <Shell><Section><h1 className="font-display text-3xl">ไม่พบโปรแกรม</h1><Link to="/programs" className="text-gold mt-4 inline-block">← กลับไปดูโปรแกรมทั้งหมด</Link></Section></Shell>
  ),
  loader: ({ params }) => {
    const p = programs.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { program: p };
  },
  component: ProgramDetail,
});

function ProgramDetail() {
  const { program } = Route.useLoaderData() as { program: Program };
  const [state, setState] = useAppState();
  const navigate = useNavigate();
  const isBooked = state.bookedProgramId === program.id;
  const confirm = useServerFn(confirmBooking);
  const [sending, setSending] = useState(false);

  async function book() {
    if (sending) return;
    setSending(true);
    const date = new Date();
    date.setDate(date.getDate() + 21);
    const bookingDate = date.toISOString();
    const mealPlan = program.schedule.flatMap((d) =>
      d.items.filter((i) => /อาหาร|มื้อ|meal|breakfast|lunch|dinner|juice|tea|smoothie/i.test(i))
    );
    const mealsUrl = typeof window !== "undefined"
      ? `${window.location.origin}/meals/${program.id}`
      : `/meals/${program.id}`;
    toast.loading("กำลังส่งใบจองทาง LINE...", { id: "book" });
    try {
      const res = await confirm({
        data: {
          programId: program.id,
          programName: program.name,
          programDuration: program.duration,
          programVenue: program.venue,
          programPrice: program.price,
          bookingDate,
          mealPlan,
          mealsUrl,
          expertName: program.expert.name,
        },
      });
      setState((s) => ({ ...s, bookedProgramId: program.id, bookingDate }));
      if (res.customer.ok && res.partner.ok) {
        toast.success(`ยืนยันการจอง ${res.bookingId} — ส่งใบจองทาง LINE แล้ว`, { id: "book" });
      } else {
        toast.warning("จองสำเร็จ แต่ส่ง LINE บางส่วนล้มเหลว", {
          id: "book",
          description: [
            !res.customer.ok && `ลูกค้า: ${res.customer.error ?? ""}`,
            !res.partner.ok && `พาร์ทเนอร์: ${res.partner.error ?? ""}`,
          ].filter(Boolean).join(" | "),
        });
      }
      navigate({ to: "/journey" });
    } catch (e) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่", { id: "book", description: String(e).slice(0, 200) });
    } finally {
      setSending(false);
    }
  }

  return (
    <Shell>
      <Section>
        <Link to="/programs" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
          <ArrowLeft size={14} /> โปรแกรมทั้งหมด
        </Link>

        <div className="grid lg:grid-cols-5 gap-8 mt-8">
          <div className="lg:col-span-3">
            <div className="aspect-[16/10] rounded-[2rem] overflow-hidden">
              <img src={program.image} alt={program.name} className="size-full object-cover" width={1280} height={800} />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
              {program.gallery.slice(1).map((src, i) => (
                <img key={i} src={src} alt={`${program.name} ${i + 1}`} loading="lazy" width={400} height={400} className="aspect-square object-cover rounded-2xl" />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Eyebrow>{program.duration}</Eyebrow>
            <h1 className="font-display text-4xl md:text-5xl mt-3">{program.name}</h1>
            <p className="text-muted-foreground mt-3">{program.tagline}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <MapPin size={14} className="text-gold" /> {program.venue}
            </div>

            <div className="mt-8 glass rounded-3xl p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">ราคาต่อท่าน</div>
                  <div className="font-display text-4xl gold-text">฿{program.price.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">รวมที่พัก อาหาร และทรีตเมนต์</div>
                </div>
              </div>
              {state.credits > 0 && (
                <div className="mt-4 text-sm text-emerald flex items-center gap-2">
                  ✦ ใช้ {state.credits} Calm Credits ได้ในการชำระ
                </div>
              )}
              <button
                onClick={book}
                disabled={isBooked || sending}
                className="btn-gold rounded-full w-full py-4 mt-6 inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isBooked ? "✓ จองแล้ว — ดู Journey" : sending ? "กำลังจอง..." : "ยืนยันการจอง & รับใบจอง LINE"}
                {!isBooked && !sending && <ArrowRight size={16} />}
              </button>
              {isBooked && (
                <Link to="/journey" className="block text-center text-sm text-gold mt-3">ไปที่ My Journey →</Link>
              )}
            </div>

            <div className="mt-8">
              <div className="text-xs tracking-widest text-gold uppercase">Highlights</div>
              <ul className="mt-3 space-y-2">
                {program.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm">
                    <span className="text-gold mt-1">✦</span> {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex items-center gap-2 text-gold text-xs tracking-[0.25em] uppercase">
            <CalendarDays size={14} /> Day-by-day itinerary
          </div>
          <h2 className="font-display text-3xl mt-3">ตารางการเดินทาง</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {program.schedule.map((d) => (
              <div key={d.day} className="glass rounded-2xl p-6">
                <div className="font-display text-lg text-gold">{d.day}</div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {d.items.map((i) => <li key={i}>· {i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </Shell>
  );
}