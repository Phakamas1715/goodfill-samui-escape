import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ChefHat, Utensils } from "lucide-react";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { programs, images, pick, type Program } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/meals/$id")({
  head: ({ params }) => {
    const p = programs.find((x) => x.id === params.id);
    return {
      meta: [
        { title: p ? `Meal Plan — ${p.name.th}` : "Meal Plan — Goodfill Care" },
        { name: "description", content: p?.tagline.th ?? "แผนอาหารโดยผู้เชี่ยวชาญ" },
      ],
    };
  },
  notFoundComponent: () => (
    <Shell><Section><h1 className="font-display text-3xl">ไม่พบแผนอาหาร / Meal plan not found</h1></Section></Shell>
  ),
  loader: ({ params }) => {
    const p = programs.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { program: p };
  },
  component: MealsPage,
});

function MealsPage() {
  const { t, lang } = useI18n();
  const { program } = Route.useLoaderData() as { program: Program };
  const tiles = [images.mealBreakfast, images.mealLunch, images.mealDinner];

  return (
    <Shell>
      <Section>
        <Link to="/journey" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
          <ArrowLeft size={14} /> {t("meals.backJourney")}
        </Link>
        <div className="mt-6"><Eyebrow>{t("meals.kicker")}</Eyebrow></div>
        <h1 className="font-display text-4xl md:text-5xl mt-2">{pick(program.name, lang)}</h1>
        <p className="text-muted-foreground mt-2">{t("meals.plannedBy")} {pick(program.expert.name, lang)} — {pick(program.expert.role, lang)}</p>

        <div className="grid grid-cols-3 gap-3 mt-8">
          {tiles.map((src, i) => {
            const labels = [t("meals.breakfast"), t("meals.lunch"), t("meals.dinner")];
            return (
              <img
                key={i}
                src={src}
                alt={`${labels[i]} — ${pick(program.name, lang)} wellness meal at Koh Samui`}
                width={600}
                height={600}
                loading="lazy"
                className="aspect-square object-cover rounded-2xl"
              />
            );
          })}
        </div>

        <div className="mt-10 space-y-4">
          {program.mealPlan.map((d) => (
            <div key={d.day.th} className="card-deep rounded-3xl p-6">
              <div className="flex items-center gap-2 text-gold text-xs tracking-[0.25em] uppercase">
                <ChefHat size={14} /> {pick(d.day, lang)}
              </div>
              <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
                <MealRow label={t("meals.breakfast")} value={pick(d.breakfast, lang)} />
                <MealRow label={t("meals.lunch")} value={pick(d.lunch, lang)} />
                <MealRow label={t("meals.dinner")} value={pick(d.dinner, lang)} />
              </div>
              {d.note && (
                <div className="mt-4 text-xs text-ivory/80 border-l-2 border-gold pl-3 italic">
                  <Utensils size={12} className="inline mr-1" /> {pick(d.note, lang)}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 glass rounded-2xl p-5 text-sm text-muted-foreground">
          {t("meals.showAtRestaurant")}
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