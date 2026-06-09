## Approach

ตอนนี้แอป Goodfill Care มี route และ flow ครบทั้ง 10 หน้าที่ขอแล้ว (ไม่ต้องสร้างใหม่จากศูนย์) — สิ่งที่จะทำคือ **rebrand design system** ทั้งหมดให้เป็นสไตล์ **Luxury Tropical Wellness** ตามพาเลตและ spec ที่ให้มา และเก็บงาน UX detail ทุกหน้าให้สงบ มีจังหวะเดียวกัน

## Mapping 10 หน้า → route ที่มีอยู่

| # | หน้า | Route |
|---|---|---|
| 1 | Welcome / Hero | `/` |
| 2 | Bio-assessment summary | `/quest` (สรุปท้ายแบบประเมิน) |
| 3 | AI recommendation (ถามต้องการช่วยอะไร) | `/persona` (ส่วนบน) |
| 4 | AI crafting program | `/persona` (AI Insight) |
| 5 | Program detail | `/programs/$id` |
| 6 | Daily meal plan | `/meals/$id` |
| 7 | Location selection | `/channel` |
| 8 | Expert consultation | `/expert` |
| 9 | Booking | `/programs/$id` (booking modal) |
| 10 | Booking success | สร้างใหม่ `/booking-success` |

## Design tokens ใหม่ (`src/styles.css`)

```css
--color-primary: #142C25      /* deep emerald */
--color-secondary: #0F4A38    /* forest */
--color-background: #F0EDE9   /* warm cream */
--color-card: #FAF7F2         /* ivory card */
--color-accent: #988A71       /* muted gold */
--color-border: #E4DED5       /* soft sand */
--color-foreground: #142C25
--color-muted-foreground: #6B6358
```

แทนพาเลต ocean/emerald-deep/gold เดิม → ทุกหน้าจะดูคุมโทนเดียวกันอัตโนมัติ

## Component refresh

- **Card**: `bg-card rounded-3xl border border-border shadow-[0_8px_28px_-12px_rgba(20,44,37,0.12)]` — มน นุ่ม เงาบางๆ
- **Pill button**: `rounded-full px-7 py-4 bg-primary text-card` หรือ outlined `border-2 border-primary text-primary`
- **Bottom nav**: เหลือ 5 ไอคอน, สีพื้น cream, active = primary
- **Typography**: heading = serif display (Cormorant), body = sans (Inter/Manrope) — เน้นช่องว่าง

## งานต่อหน้า

1. **Hero `/`** — keep host illustration; เปลี่ยน background gradient เป็น cream + emerald overlay; CTA pill emerald
2. **`/quest` summary** — เพิ่ม section "ผลประเมินของคุณ" 4 การ์ด (ความเครียด / การนอน / อารมณ์ / เป้าหมาย) ก่อนไป /persona
3. **`/persona`** — แยก 2 บล็อก: คำถาม "อยากให้ AI ช่วยเรื่องอะไร" + การ์ดผล AI crafting
4. **`/programs/$id`** — โครงสร้าง: Overview → Meals preview → Activities → Benefits → Price → CTA "จองเลย"
5. **`/meals/$id`** — แท็บวัน 1-7, แต่ละวันมี breakfast/lunch/dinner + activities + รูปจริง
6. **`/channel`** — 3 การ์ดใหญ่: Samui Resort / Clinic / Online Support (พร้อมรูป)
7. **`/expert`** — การ์ดผู้เชี่ยวชาญ 4 ประเภท: หมอ / นักโภชนาการ / โค้ช / นักจิตวิทยา
8. **Booking flow** — package → room tier → date → summary → confirm
9. **`/booking-success`** (ใหม่) — checkmark วงใหญ่ + ฉาก tropical + ปุ่ม "ดูแผนของฉัน"

## รูปภาพ

ใช้ภาพ Samui ที่มีอยู่ในโปรเจ็กต์ (`hero-samui`, `villa`, `yoga`, `spa`, `meditation`, `food`, `samui-aerial`, ฯลฯ) — ไม่ต้องสร้างใหม่ แต่กระจายให้ทุกหน้ามีรูปอย่างน้อย 1 ภาพ

## QA ก่อนปิดงาน

- เปิด preview มือถือ 390×844 ทุก route ตรวจว่า: ข้อความไม่ตกบรรทัด, ปุ่มไม่ทับการ์ด, host ไม่บังข้อความ, คอนทราสต์ผ่าน
- คำไทยอ่านง่าย ไม่มี jargon

## Scope ที่จะ **ไม่ทำ** ในรอบนี้

- ไม่เปลี่ยน database/schema
- ไม่ refactor server functions
- ไม่แตะ auth / payment flow ที่ทำงานอยู่
- ภาพใหม่ที่ generate ด้วย AI — รอรอบถัดไปถ้าต้องการ

---

ยืนยันแผนนี้ไหมครับ? หรืออยากให้เริ่มจากบางหน้าก่อน (เช่น hero + booking success) แล้วค่อยทยอยทำหน้าอื่น?