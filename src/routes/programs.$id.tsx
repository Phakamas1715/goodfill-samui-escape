import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CalendarDays, ChefHat, MapPin } from "lucide-react";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { programs, pick, type Program } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { confirmBooking } from "@/lib/booking.functions";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/programs/$id")({
  head: ({ params }) => {
    const p = programs.find((x) => x.id === params.id);
    return {
      meta: [
        { title: p ? `${p.name.th} — Goodfill Care` : "Program — Goodfill Care" },
        { name: "description", content: p?.tagline.th ?? "Wellness program ที่เกาะสมุย" },
      ],
    };
  },
  notFoundComponent: () => (
    <Shell><Section><h1 className="font-display text-3xl">ไม่พบโปรแกรม / Program not found</h1><Link to="/programs" className="text-gold mt-4 inline-block">← Back</Link></Section></Shell>
  ),
  loader: ({ params }) => {
    const p = programs.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { program: p };
  },
  component: ProgramDetail,
});

function ProgramDetail() {
  const { t, lang } = useI18n();
  const { program } = Route.useLoaderData() as { program: Program };
  const [state, setState] = useAppState();
  const navigate = useNavigate();
  const isBooked = state.bookedProgramId === program.id;
  const confirm = useServerFn(confirmBooking);
  const [sending, setSending] = useState(false);
  const [dietaryPlan, setDietaryPlan] = useState<"Signature" | "Plant-based" | "High-Protein" | "Detox Light">("Signature");
  const [allergies, setAllergies] = useState<{ nuts: boolean; seafood: boolean; dairy: boolean; gluten: boolean }>({ nuts: false, seafood: false, dairy: false, gluten: false });
  const [allergyNote, setAllergyNote] = useState("");

  async function book() {
    if (sending) return;
    setSending(true);
    const date = new Date();
    date.setDate(date.getDate() + 21);
    const bookingDate = date.toISOString();
    const mealPlan = program.schedule.flatMap((d) =>
      d.items
        .map((i) => pick(i, lang))
        .filter((i) => /อาหาร|มื้อ|meal|breakfast|lunch|dinner|juice|tea|smoothie/i.test(i))
    );
    const mealsUrl = typeof window !== "undefined"
      ? `${window.location.origin}/meals/${program.id}`
      : `/meals/${program.id}`;
    const allergyLabels: string[] = [];
    if (allergies.nuts) allergyLabels.push("ถั่ว");
    if (allergies.seafood) allergyLabels.push("อาหารทะเล");
    if (allergies.dairy) allergyLabels.push("นม");
    if (allergies.gluten) allergyLabels.push("กลูเตน");
    const extra = allergyNote.trim();
    const dietaryNotes = [allergyLabels.length ? `แพ้: ${allergyLabels.join(", ")}` : "", extra].filter(Boolean).join(" · ") || undefined;
    toast.loading(t("programs.sending"), { id: "book" });
    try {
      const res = await confirm({
        data: {
          programId: program.id,
          programName: pick(program.name, lang),
          programDuration: pick(program.duration, lang),
          programVenue: pick(program.venue, lang),
          programPrice: program.price,
          bookingDate,
          mealPlan,
          mealsUrl,
          expertName: pick(program.expert.name, lang),
          dietaryPlan,
          dietaryNotes,
        },
      });
      setState((s) => ({ ...s, bookedProgramId: program.id, bookingDate }));
      if (res.customer.ok && res.partner.ok) {
        toast.success(t("programs.bookedToast").replace("{id}", res.bookingId), { id: "book" });
      } else {
        toast.warning(t("programs.partialFail"), {
          id: "book",
          description: [
            !res.customer.ok && `ลูกค้า: ${res.customer.error ?? ""}`,
            !res.partner.ok && `พาร์ทเนอร์: ${res.partner.error ?? ""}`,
          ].filter(Boolean).join(" | "),
        });
      }
      navigate({ to: "/journey" });
    } catch (e) {
      toast.error(t("programs.errorToast"), { id: "book", description: String(e).slice(0, 200) });
    } finally {
      setSending(false);
    }
  }

  return (
    <Shell>
      <Section>
        <Link to="/programs" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
          <ArrowLeft size={14} /> {t("programs.allLink")}
        </Link>

        <div className="grid lg:grid-cols-5 gap-8 mt-8">
          <div className="lg:col-span-3">
            <div className="aspect-[16/10] rounded-[2rem] overflow-hidden">
              <img src={program.image} alt={pick(program.name, lang)} className="size-full object-cover" width={1280} height={800} />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
              {program.gallery.slice(1).map((src, i) => (
                <img key={i} src={src} alt={`${pick(program.name, lang)} ${i + 1}`} loading="lazy" width={400} height={400} className="aspect-square object-cover rounded-2xl" />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Eyebrow>{pick(program.duration, lang)}</Eyebrow>
            <h1 className="font-display text-4xl md:text-5xl mt-3">{pick(program.name, lang)}</h1>
            <p className="text-muted-foreground mt-3">{pick(program.tagline, lang)}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <MapPin size={14} className="text-gold" /> {pick(program.venue, lang)}
            </div>

            <div className="mt-8 glass rounded-3xl p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("programs.pricePerPerson")}</div>
                  <div className="font-display text-4xl gold-text">฿{program.price.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t("programs.priceIncludes")}</div>
                </div>
              </div>
              {state.credits > 0 && (
                <div className="mt-4 text-sm text-emerald flex items-center gap-2">
                  ✦ {t("programs.useCredits").replace("{n}", String(state.credits))}
                </div>
              )}
              {!isBooked && (
                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">เลือกแนวอาหาร / Meal direction</div>
                    <div className="grid grid-cols-2 gap-2">
                      {(["Signature", "Plant-based", "High-Protein", "Detox Light"] as const).map((opt) => (
                        <label
                          key={opt}
                          className={`cursor-pointer rounded-2xl border px-3 py-2 text-center transition ${
                            dietaryPlan === opt ? "border-gold bg-gold/10 text-foreground" : "border-border text-muted-foreground hover:border-gold/60"
                          }`}
                        >
                          <input
                            type="radio"
                            name="dietary-plan"
                            value={opt}
                            checked={dietaryPlan === opt}
                            onChange={() => setDietaryPlan(opt)}
                            className="sr-only"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">แพ้อาหาร / Allergies</div>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        ["nuts", "ถั่ว"],
                        ["seafood", "อาหารทะเล"],
                        ["dairy", "นม"],
                        ["gluten", "กลูเตน"],
                      ] as const).map(([k, label]) => (
                        <label key={k} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allergies[k]}
                            onChange={(e) => setAllergies((s) => ({ ...s, [k]: e.target.checked }))}
                            className="accent-gold"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="อื่นๆ / Other (เช่น ไข่, ถั่วเหลือง...)"
                      value={allergyNote}
                      onChange={(e) => setAllergyNote(e.target.value.slice(0, 300))}
                      className="mt-2 w-full rounded-xl border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-gold"
                    />
                  </div>
                </div>
              )}
              <button
                onClick={book}
                disabled={isBooked || sending}
                className="btn-gold rounded-full w-full py-4 mt-6 inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isBooked ? t("programs.booked") : sending ? t("programs.booking") : t("programs.confirmBook")}
                {!isBooked && !sending && <ArrowRight size={16} />}
              </button>
              {isBooked && (
                <Link to="/journey" className="block text-center text-sm text-gold mt-3">{t("programs.goJourney")}</Link>
              )}
            </div>

            <div className="mt-8">
              <div className="text-xs tracking-widest text-gold uppercase">{t("programs.highlights")}</div>
              <ul className="mt-3 space-y-2">
                {program.highlights.map((h) => (
                  <li key={h.th} className="flex items-start gap-3 text-sm">
                    <span className="text-gold mt-1">✦</span> {pick(h, lang)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex items-center gap-2 text-gold text-xs tracking-[0.25em] uppercase">
            <CalendarDays size={14} /> {t("programs.itineraryKicker")}
          </div>
          <h2 className="font-display text-3xl mt-3">{t("programs.itineraryTitle")}</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {program.schedule.map((d) => (
              <div key={d.day.th} className="glass rounded-2xl p-6">
                <div className="font-display text-lg text-gold">{pick(d.day, lang)}</div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {d.items.map((i) => <li key={i.th}>· {pick(i, lang)}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex items-center gap-2 text-gold text-xs tracking-[0.25em] uppercase">
            <ChefHat size={14} /> {t("programs.mealKicker")}
          </div>
          <h2 className="font-display text-3xl mt-3">{t("programs.mealTitleBy")} {pick(program.expert.name, lang)}</h2>
          <p className="text-sm text-muted-foreground mt-1">{pick(program.expert.role, lang)}</p>
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {program.mealPlan.map((d) => (
              <div key={d.day.th} className="card-deep rounded-2xl p-5">
                <div className="text-[10px] tracking-[0.25em] uppercase text-gold">{pick(d.day, lang)}</div>
                <div className="mt-3 space-y-2 text-sm">
                  <div><span className="text-gold/90 text-[10px] uppercase tracking-widest">{t("meals.breakfast")} · </span>{pick(d.breakfast, lang)}</div>
                  <div><span className="text-gold/90 text-[10px] uppercase tracking-widest">{t("meals.lunch")} · </span>{pick(d.lunch, lang)}</div>
                  <div><span className="text-gold/90 text-[10px] uppercase tracking-widest">{t("meals.dinner")} · </span>{pick(d.dinner, lang)}</div>
                </div>
                {d.note && <div className="mt-3 text-[11px] text-ivory/75 italic">※ {pick(d.note, lang)}</div>}
              </div>
            ))}
          </div>
          <Link to="/meals/$id" params={{ id: program.id }} className="mt-6 inline-flex items-center gap-2 text-gold text-sm hover:underline">
            {t("programs.fullMeal")} <ArrowRight size={14} />
          </Link>
        </div>
      </Section>
    </Shell>
  );
}