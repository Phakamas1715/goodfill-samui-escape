import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ChefHat, Utensils, Wand2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { programs, images, pick, type Program } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useAppState } from "@/lib/state";
import { getMealPlan } from "@/lib/ai-insights.functions";

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
    <Shell>
      <Section>
        <h1 className="font-display text-3xl">ไม่พบแผนอาหาร / Meal plan not found</h1>
      </Section>
    </Shell>
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
  const [state] = useAppState();
  const fetchPlan = useServerFn(getMealPlan);
  const [aiPlan, setAiPlan] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function runAIPlan() {
    setLoadingAI(true);
    setAiError(null);
    try {
      const result = await fetchPlan({
        data: {
          personaId: state.persona ?? "balanced",
          personaName: state.persona ?? "Balanced wellness traveller",
          days: Math.min(7, program.mealPlan.length || 3),
          lang,
        },
      });
      setAiPlan(result);
    } catch (e: any) {
      setAiError(e?.message ?? "AI error");
    } finally {
      setLoadingAI(false);
    }
  }

  const tiles = [images.mealBreakfast, images.mealLunch, images.mealDinner];

  return (
    <Shell>
      <Section className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Back link — larger */}
        <Link
          to="/journey"
          className="text-sm md:text-base text-muted-foreground hover:text-foreground inline-flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={16} /> {t("meals.backJourney")}
        </Link>

        {/* Header — larger text */}
        <div className="mt-4">
          <Eyebrow className="text-sm md:text-base">{t("meals.kicker")}</Eyebrow>
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mt-3 leading-[1.15]">
          {pick(program.name, lang)}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mt-3 leading-relaxed">
          {t("meals.plannedBy")} {pick(program.expert.name, lang)} —{" "}
          {pick(program.expert.role, lang)}
        </p>

        {/* Meal images gallery — larger */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mt-10">
          {tiles.map((src, i) => {
            const labels = [t("meals.breakfast"), t("meals.lunch"), t("meals.dinner")];
            return (
              <div key={i} className="relative group">
                <img
                  key={i}
                  src={src}
                  alt={`${labels[i]} — ${pick(program.name, lang)} wellness meal at Koh Samui`}
                  width={600}
                  height={600}
                  loading="lazy"
                  className="aspect-square object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-white text-xs md:text-sm font-medium">{labels[i]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Meal Plan Cards — larger */}
        <div className="mt-12 space-y-5">
          {program.mealPlan.map((d) => (
            <div
              key={d.day.th}
              className="card-deep rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-2 text-gold text-xs md:text-sm tracking-[0.25em] uppercase font-semibold">
                <ChefHat size={16} /> {pick(d.day, lang)}
              </div>
              <div className="mt-5 grid md:grid-cols-3 gap-5 text-sm md:text-base">
                <MealRow label={t("meals.breakfast")} value={pick(d.breakfast, lang)} />
                <MealRow label={t("meals.lunch")} value={pick(d.lunch, lang)} />
                <MealRow label={t("meals.dinner")} value={pick(d.dinner, lang)} />
              </div>
              {d.note && (
                <div className="mt-5 text-xs md:text-sm text-ivory/80 border-l-2 border-gold pl-4 italic leading-relaxed">
                  <Utensils size={14} className="inline mr-2" /> {pick(d.note, lang)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI-enhanced meal plan section — larger and more prominent */}
        <div className="mt-12 card-deep rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gold text-xs md:text-sm tracking-[0.25em] uppercase font-semibold">
              <Wand2 size={16} /> {lang === "th" ? "แผนเสริม โดย AI" : "AI-tailored add-on plan"}
            </div>
            <button
              onClick={runAIPlan}
              disabled={loadingAI}
              className="btn-gold rounded-full px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-60 shadow-md hover:shadow-lg transition-all"
            >
              {loadingAI ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {loadingAI
                ? lang === "th"
                  ? "กำลังสร้าง…"
                  : "Generating…"
                : aiPlan
                  ? lang === "th"
                    ? "สร้างใหม่"
                    : "Regenerate"
                  : lang === "th"
                    ? "ให้ AI ช่วยวางแผน"
                    : "Generate with AI"}
            </button>
          </div>

          {aiError && (
            <p className="text-xs md:text-sm text-coral mt-4 p-3 bg-coral/10 rounded-xl">
              {aiError}
            </p>
          )}

          {aiPlan?.days?.length > 0 && (
            <div className="mt-6 space-y-4">
              {aiPlan.days.map((d: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/5 border border-white/15 p-5 md:p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-[11px] md:text-xs tracking-[0.25em] uppercase text-gold font-semibold">
                    {lang === "th" ? `วันที่ ${d.day ?? i + 1}` : `Day ${d.day ?? i + 1}`}
                  </div>
                  <div className="mt-3 grid md:grid-cols-3 gap-4 text-sm md:text-base text-ivory/95">
                    <MealRow label={t("meals.breakfast")} value={d.breakfast ?? ""} />
                    <MealRow label={t("meals.lunch")} value={d.lunch ?? ""} />
                    <MealRow label={t("meals.dinner")} value={d.dinner ?? ""} />
                  </div>
                  {(d.snack || d.hydration) && (
                    <div className="mt-4 grid md:grid-cols-2 gap-3 text-xs md:text-sm text-ivory/80 pt-3 border-t border-white/10">
                      {d.snack && (
                        <div className="flex items-center gap-2">
                          🥥 <span>{d.snack}</span>
                        </div>
                      )}
                      {d.hydration && (
                        <div className="flex items-center gap-2">
                          💧 <span>{d.hydration}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {aiPlan.notes && (
                <div className="text-xs md:text-sm italic text-ivory/85 border-l-2 border-gold pl-4 py-2 leading-relaxed">
                  💡 {aiPlan.notes}
                </div>
              )}
            </div>
          )}

          {!aiPlan && !loadingAI && !aiError && (
            <div className="mt-5 p-4 md:p-5 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[13px] md:text-sm text-ivory/80 leading-relaxed">
                {lang === "th"
                  ? "✨ ให้ AI สร้างเมนูเสริมส่วนตัวจาก persona ของคุณ ผู้เชี่ยวชาญสามารถใช้เป็นจุดตั้งต้นในการปรับให้ลึกขึ้น"
                  : "✨ Let AI draft a personalised add-on menu from your persona — your expert uses it as a starting point."}
              </p>
            </div>
          )}
        </div>

        {/* Footer note — larger */}
        <div className="mt-10 glass rounded-xl md:rounded-2xl p-5 md:p-6 text-sm md:text-base text-muted-foreground text-center shadow-md">
          {t("meals.showAtRestaurant")}
        </div>
      </Section>
    </Shell>
  );
}

function MealRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[11px] md:text-xs tracking-[0.2em] uppercase text-gold/90 font-semibold">
        {label}
      </div>
      <div className="text-sm md:text-base text-ivory/95 leading-relaxed">{value || "—"}</div>
    </div>
  );
}
