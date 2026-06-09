import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ChefHat, Utensils } from "lucide-react";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { programs, images, type Program } from "@/lib/data";

export const Route = createFileRoute("/meals/$id")({
  head: ({ params }) => {
    const p = programs.find((x) => x.id === params.id);
    return {
      meta: [
        { title: p ? `Meal Plan — ${p.name}` : "Meal Plan — Goodfill Care" },
        { name: "description", content: p?.tagline ?? "แผนอาหารโดยผู้เชี่ยวชาญ" },
      ],
    };
  },
  notFoundComponent: () => (
    <Shell><Section><h1 className="font-display text-3xl">ไม่พบแผนอาหาร</h1></Section></Shell>
  ),
  loader: ({ params }) => {
    const p = programs.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { program: p };
  },
  component: MealsPage,
});

function MealsPage() {
  const { program } = Route.useLoaderData() as { program: Program };
  const tiles = [images.mealBreakfast, images.mealLunch, images.mealDinner];

  return (
    <Shell>
      <Section>
        <Link to="/journey" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
          <ArrowLeft size={14} /> กลับ My Journey
        </Link>
        <div className="mt-6"><Eyebrow>Expert Meal Plan</Eyebrow></div>
        <h1 className="font-display text-4xl md:text-5xl mt-2">{program.name}</h1>
        <p className="text-muted-foreground mt-2">วางแผนโดย {program.expert.name} — {program.expert.role}</p>

        <div className="grid grid-cols-3 gap-3 mt-8">
          {tiles.map((src, i) => (
            <img key={i} src={src} alt="meal" width={600} height={600} loading="lazy" className="aspect-square object-cover rounded-2xl" />
          ))}
        </div>

        <div className="mt-10 space-y-4">
          {program.mealPlan.map((d) => (
            <div key={d.day} className="card-deep rounded-3xl p-6">
              <div className="flex items-center gap-2 text-gold text-xs tracking-[0.25em] uppercase">
                <ChefHat size={14} /> {d.day}
              </div>
              <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
                <MealRow label="เช้า" value={d.breakfast} />
                <MealRow label="กลางวัน" value={d.lunch} />
                <MealRow label="เย็น" value={d.dinner} />
              </div>
              {d.note && (
                <div className="mt-4 text-xs text-ivory/80 border-l-2 border-gold pl-3 italic">
                  <Utensils size={12} className="inline mr-1" /> {d.note}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 glass rounded-2xl p-5 text-sm text-muted-foreground">
          แสดงหน้านี้ที่ห้องอาหาร เพื่อรับมื้ออาหารตามแผนของคุณ
        </div>
      </Section>
    </Shell>
  );
}

function MealRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.2em] uppercase text-gold/90">{label}</div>
      <div className="mt-1 text-ivory/95">{value || "—"}</div>
    </div>
  );
}