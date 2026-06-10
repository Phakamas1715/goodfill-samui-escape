import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CalendarDays, ChefHat, MapPin, X, Sparkles } from "lucide-react";
import { Shell, Section, Eyebrow } from "@/components/Shell";
import { programs, pick, type Program } from "@/lib/data";
import { personas } from "@/lib/data";
import { useAppState } from "@/lib/state";
import { confirmBooking } from "@/lib/booking.functions";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/programs/$id")({
  head: ({ params }) => {
    const p = programs.find((x) => x.id === params.id);
    const url = `https://goodfillcare-samui.com/programs/${params.id}`;
    const image = p?.image ?? "https://goodfillcare-samui.com/icon-512.png";
    return {
      meta: [
        { title: p ? `${p.name.th} — Goodfill Care` : "Program — Goodfill Care" },
        { name: "description", content: p?.tagline.th ?? "Wellness program ที่เกาะสมุย" },
        {
          property: "og:title",
          content: p ? `${p.name.th} — Goodfill Care` : "Program — Goodfill Care",
        },
        { property: "og:description", content: p?.tagline.th ?? "Wellness program ที่เกาะสมุย" },
        { property: "og:image", content: image },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p.name.th,
                description: p.tagline.th,
                image: p.image,
                brand: { "@type": "Brand", name: "Goodfill Care" },
                offers: {
                  "@type": "Offer",
                  price: p.price,
                  priceCurrency: "THB",
                  availability: "https://schema.org/InStock",
                  url,
                },
              }),
            },
          ]
        : undefined,
    };
  },
  notFoundComponent: () => (
    <Shell>
      <Section>
        <h1 className="font-display text-3xl">ไม่พบโปรแกรม / Program not found</h1>
        <Link to="/programs" className="text-gold mt-4 inline-block">
          ← Back
        </Link>
      </Section>
    </Shell>
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
  const [dietaryPlan, setDietaryPlan] = useState<
    "Signature" | "Plant-based" | "High-Protein" | "Detox Light"
  >("Signature");
  const [allergies, setAllergies] = useState<{
    nuts: boolean;
    seafood: boolean;
    dairy: boolean;
    gluten: boolean;
  }>({
    nuts: false,
    seafood: false,
    dairy: false,
    gluten: false,
  });
  const [allergyNote, setAllergyNote] = useState("");
  const [bookOpen, setBookOpen] = useState(false);

  // Lock body scroll while the booking popup is open + close with Esc.
  useEffect(() => {
    if (!bookOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBookOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [bookOpen]);

  async function book() {
    if (sending) return;
    // Pre-check sign-in. confirmBooking enforces Supabase auth — without a session
    // it returns "Unauthorized: No authorization header provided" which is bad UX.
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      toast.info("กรุณาเข้าสู่ระบบก่อนทำการจอง", { id: "book" });
      setBookOpen(false);
      navigate({ to: "/login", search: { redirect: `/programs/${program.id}` } });
      return;
    }
    setSending(true);
    const date = new Date();
    date.setDate(date.getDate() + 21);
    const bookingDate = date.toISOString();
    const mealPlan = program.schedule.flatMap((d) =>
      d.items
        .map((i) => pick(i, lang))
        .filter((i) => /อาหาร|มื้อ|meal|breakfast|lunch|dinner|juice|tea|smoothie/i.test(i)),
    );
    const mealsUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/meals/${program.id}`
        : `/meals/${program.id}`;
    const allergyLabels: string[] = [];
    if (allergies.nuts) allergyLabels.push("ถั่ว");
    if (allergies.seafood) allergyLabels.push("อาหารทะเล");
    if (allergies.dairy) allergyLabels.push("นม");
    if (allergies.gluten) allergyLabels.push("กลูเตน");
    const extra = allergyNote.trim();
    const dietaryNotes =
      [allergyLabels.length ? `แพ้: ${allergyLabels.join(", ")}` : "", extra]
        .filter(Boolean)
        .join(" · ") || undefined;

    // Pre-fill a partner-facing persona note so experts see customer context without typing.
    let personaNote: string | undefined;
    if (state.persona) {
      const p = personas[state.persona];
      const sec =
        state.secondaryPersona && state.secondaryPersona !== state.persona
          ? personas[state.secondaryPersona]
          : null;
      const parts: string[] = [];
      parts.push(`Persona: ${pick(p.name, lang)} (${pick(p.thaiName, lang)})`);
      if (sec) parts.push(`รอง: ${pick(sec.name, lang)}`);
      parts.push(`คาแรกเตอร์: ${pick(p.tagline, lang)}`);
      const pillars = p.pillars
        .slice(0, 4)
        .map((x) => pick(x, lang))
        .join(" · ");
      if (pillars) parts.push(`Pillars: ${pillars}`);
      const ai = state.aiInsight;
      if (ai?.focusAreas?.length) parts.push(`Focus: ${ai.focusAreas.slice(0, 3).join(" · ")}`);
      if (ai?.avoid?.length) parts.push(`Avoid: ${ai.avoid.slice(0, 2).join(" · ")}`);
      personaNote = parts.join("\n").slice(0, 1200);
    }

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
          personaNote,
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
          ]
            .filter(Boolean)
            .join(" | "),
        });
      }
      navigate({
        to: "/booking-success",
        search: {
          bookingId: res.bookingId,
          programName: pick(program.name, lang),
          dates: bookingDate,
          location: pick(program.venue, lang),
        },
      });
    } catch (e) {
      toast.error(t("programs.errorToast"), { id: "book", description: String(e).slice(0, 200) });
    } finally {
      setSending(false);
      setBookOpen(false);
    }
  }

  return (
    <Shell>
      <Section className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Back link — larger */}
        <Link
          to="/programs"
          className="text-sm md:text-base text-muted-foreground hover:text-foreground inline-flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={16} /> {t("programs.allLink")}
        </Link>

        <div className="grid lg:grid-cols-5 gap-8 md:gap-12">
          {/* Left Column — Images (larger) */}
          <div className="lg:col-span-3">
            <div className="aspect-[16/10] rounded-[2rem] overflow-hidden shadow-xl">
              <img
                src={program.image}
                alt={pick(program.name, lang)}
                className="size-full object-cover"
                width={1280}
                height={800}
              />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
              {program.gallery.slice(1).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${pick(program.name, lang)} ${i + 1}`}
                  loading="lazy"
                  width={400}
                  height={400}
                  className="aspect-square object-cover rounded-xl shadow-md hover:shadow-lg transition"
                />
              ))}
            </div>
          </div>

          {/* Right Column — Program Info (larger fonts) */}
          <div className="lg:col-span-2">
            <Eyebrow className="text-sm">{pick(program.duration, lang)}</Eyebrow>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mt-3 leading-[1.15]">
              {pick(program.name, lang)}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mt-4 leading-relaxed">
              {pick(program.tagline, lang)}
            </p>
            <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground mt-5">
              <MapPin size={16} className="text-gold" /> {pick(program.venue, lang)}
            </div>

            {/* Price Card — larger */}
            <div className="mt-8 glass rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] md:text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    {t("programs.pricePerPerson")}
                  </div>
                  <div className="font-display text-4xl md:text-5xl gold-text font-bold mt-1">
                    ฿{program.price.toLocaleString()}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-2">
                    {t("programs.priceIncludes")}
                  </div>
                </div>
              </div>

              {state.credits > 0 && (
                <div className="mt-5 text-sm md:text-base text-emerald flex items-center gap-2 p-3 bg-emerald/10 rounded-xl">
                  <Sparkles size={16} /> ✦{" "}
                  {t("programs.useCredits").replace("{n}", String(state.credits))}
                </div>
              )}

              <button
                onClick={() => (isBooked ? null : setBookOpen(true))}
                disabled={isBooked || sending}
                className="btn-gold rounded-full w-full py-4 md:py-5 mt-6 inline-flex items-center justify-center gap-2 text-base md:text-lg font-bold disabled:opacity-60 shadow-lg hover:shadow-xl transition"
              >
                {isBooked ? t("programs.booked") : t("programs.confirmBook")}
                {!isBooked && <ArrowRight size={18} />}
              </button>

              {isBooked && (
                <Link
                  to="/journey"
                  className="block text-center text-sm md:text-base text-gold mt-4 font-medium hover:underline"
                >
                  {t("programs.goJourney")}
                </Link>
              )}
            </div>

            {/* Highlights Section — larger */}
            <div className="mt-10">
              <div className="text-xs md:text-sm tracking-widest text-gold uppercase font-semibold">
                {t("programs.highlights")}
              </div>
              <ul className="mt-4 space-y-3">
                {program.highlights.map((h) => (
                  <li key={h.th} className="flex items-start gap-3 text-sm md:text-base">
                    <span className="text-gold mt-1 text-base">✦</span>
                    <span className="leading-relaxed">{pick(h, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Itinerary Section — larger */}
        <div className="mt-16 md:mt-20">
          <div className="flex items-center gap-2 text-gold text-xs md:text-sm tracking-[0.25em] uppercase font-semibold">
            <CalendarDays size={16} /> {t("programs.itineraryKicker")}
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-3">
            {t("programs.itineraryTitle")}
          </h2>

          <div className="mt-8 grid md:grid-cols-2 gap-5 md:gap-6">
            {program.schedule.map((d) => (
              <div
                key={d.day.th}
                className="glass rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition"
              >
                <div className="font-display text-xl md:text-2xl text-gold font-semibold">
                  {pick(d.day, lang)}
                </div>
                <ul className="mt-4 space-y-2.5 text-sm md:text-base text-muted-foreground">
                  {d.items.map((i) => (
                    <li key={i.th} className="leading-relaxed">
                      · {pick(i, lang)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Plan Section — larger */}
        <div className="mt-16 md:mt-20">
          <div className="flex items-center gap-2 text-gold text-xs md:text-sm tracking-[0.25em] uppercase font-semibold">
            <ChefHat size={16} /> {t("programs.mealKicker")}
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-3">
            {t("programs.mealTitleBy")} {pick(program.expert.name, lang)}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            {pick(program.expert.role, lang)}
          </p>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {program.mealPlan.map((d) => (
              <div
                key={d.day.th}
                className="card-deep rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
              >
                <div className="text-[11px] md:text-xs tracking-[0.25em] uppercase text-gold font-semibold">
                  {pick(d.day, lang)}
                </div>
                <div className="mt-4 space-y-3 text-sm md:text-base">
                  <div>
                    <span className="text-gold/90 text-[10px] md:text-xs uppercase tracking-widest font-semibold">
                      {t("meals.breakfast")}
                    </span>
                    <span className="ml-2 leading-relaxed">{pick(d.breakfast, lang)}</span>
                  </div>
                  <div>
                    <span className="text-gold/90 text-[10px] md:text-xs uppercase tracking-widest font-semibold">
                      {t("meals.lunch")}
                    </span>
                    <span className="ml-2 leading-relaxed">{pick(d.lunch, lang)}</span>
                  </div>
                  <div>
                    <span className="text-gold/90 text-[10px] md:text-xs uppercase tracking-widest font-semibold">
                      {t("meals.dinner")}
                    </span>
                    <span className="ml-2 leading-relaxed">{pick(d.dinner, lang)}</span>
                  </div>
                </div>
                {d.note && (
                  <div className="mt-4 text-[11px] md:text-xs text-ivory/75 italic leading-relaxed">
                    ※ {pick(d.note, lang)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link
            to="/meals/$id"
            params={{ id: program.id }}
            className="mt-8 inline-flex items-center gap-2 text-gold text-sm md:text-base font-medium hover:underline"
          >
            {t("programs.fullMeal")} <ArrowRight size={16} />
          </Link>
        </div>
      </Section>

      {/* BOOKING POPUP — larger, more spacious */}
      <AnimatePresence>
        {bookOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md"
            onClick={() => !sending && setBookOpen(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", damping: 24, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-lg md:max-w-xl bg-ivory text-navy rounded-t-3xl sm:rounded-3xl shadow-2xl ring-1 ring-black/5 max-h-[100dvh] sm:max-h-[90vh] overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label={`ยืนยันการจอง ${pick(program.name, lang)}`}
            >
              {/* Header — larger */}
              <div className="px-6 pt-6 pb-4 flex items-start gap-3 border-b border-mint/40">
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] tracking-[0.28em] uppercase text-gold font-bold">
                    ยืนยันการจอง
                  </div>
                  <div className="font-display text-xl md:text-2xl leading-tight mt-1 truncate">
                    {pick(program.name, lang)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {pick(program.duration, lang)} · ฿{program.price.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => !sending && setBookOpen(false)}
                  aria-label="ปิด"
                  className="size-10 rounded-full bg-cream hover:bg-mint/40 grid place-items-center ring-1 ring-mint/40 active:scale-95 transition shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form body — larger inputs */}
              <div className="px-6 py-5 space-y-5 overflow-y-auto">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                    แนวอาหาร / Meal direction
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Signature", "Plant-based", "High-Protein", "Detox Light"] as const).map(
                      (opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setDietaryPlan(opt)}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-medium text-center transition ${
                            dietaryPlan === opt
                              ? "border-gold bg-gold/15 text-navy shadow-sm"
                              : "border-mint/50 text-muted-foreground hover:border-gold/60"
                          }`}
                        >
                          {opt}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                    แพ้อาหาร / Allergies
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {(
                      [
                        ["nuts", "ถั่ว"],
                        ["seafood", "ทะเล"],
                        ["dairy", "นม"],
                        ["gluten", "กลูเตน"],
                      ] as const
                    ).map(([k, label]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setAllergies((s) => ({ ...s, [k]: !s[k] }))}
                        aria-pressed={allergies[k]}
                        className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition ${
                          allergies[k]
                            ? "border-coral/70 bg-coral/15 text-navy"
                            : "border-mint/50 text-muted-foreground hover:border-coral/40"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="อื่น ๆ / Other (เช่น ไข่, ถั่วเหลือง)"
                    value={allergyNote}
                    onChange={(e) => setAllergyNote(e.target.value.slice(0, 300))}
                    className="mt-3 w-full rounded-xl border border-mint/50 bg-white/70 px-4 py-3 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
                  />
                </div>
              </div>

              {/* Footer CTA — larger */}
              <div className="px-6 pt-3 pb-[max(env(safe-area-inset-bottom),1.5rem)] border-t border-mint/40 bg-cream/60">
                <button
                  onClick={book}
                  disabled={sending}
                  className="btn-gold rounded-full w-full py-4 inline-flex items-center justify-center gap-2 text-base font-bold disabled:opacity-60 shadow-lg hover:shadow-xl transition"
                >
                  <Sparkles size={18} />
                  {sending
                    ? t("programs.booking")
                    : `${t("programs.confirmBook")} · ฿${program.price.toLocaleString()}`}
                  {!sending && <ArrowRight size={18} />}
                </button>
                <div className="mt-2 text-center text-[11px] text-muted-foreground">
                  ยืนยันแล้วระบบจะส่งใบเสร็จไป LINE/Telegram และแจ้งทีมพาร์ทเนอร์ทันที
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Shell>
  );
}
