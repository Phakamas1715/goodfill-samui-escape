
# Goodfill Care — Luxury Wellness PWA (เกาะสมุย)

## วิเคราะห์จากไฟล์ที่แนบ

จากเอกสารโครงสร้าง (README + 7 HTML mockups) ระบบ Goodfill Wellness เดิมครอบคลุม 3 channels (Customer/Partner/Expert) ผ่าน LINE/Telegram/Web พร้อม Wellness Quest 8 ข้อ → 6 Personas → Calm Credits → Booking

**Design DNA ที่จะคงไว้:**
- Dark Luxury Theme: `#070E0B` base, `#1B6B4A` emerald green, `#C9A84C` gold accent
- Typography: Playfair Display (hero) + Poppins (UI) + Sarabun (Thai body)
- Glassmorphism cards, ambient radial glows, gold/green gradients

**สโคปใหม่ (Goodfill Care PWA):** Web App ฝั่ง**ลูกค้า**ล้วน เน้น Customer Journey 5 เฟส ไม่ทำ Partner/Expert board, ไม่ทำ LINE LIFF integration ในรอบนี้

---

## 5-Phase Customer Journey

```
1. Pre-arrival Wellness Quest  →  แบบประเมิน 8 ข้อ ค้นพบ Persona
2. Personalized Program        →  Package matching เกาะสมุย + booking
3. Partner Service Experience  →  ตารางบริการ + QR check-in ระหว่างพัก
4. Final Wellness Report       →  สรุปผล metrics + insight หลังจบทริป
5. Long-term Goodfill Care     →  Habit tracking + Calm Credits + รีบุ๊ค
```

## หน้าเว็บ (Routes)

| Path | หน้า | สาระสำคัญ |
|---|---|---|
| `/` | Landing | Hero ภาพสมุยจริง, value props, CTA "เริ่มแบบประเมิน" |
| `/quest` | Wellness Quest | 8 คำถาม UI แบบ card-by-card + progress |
| `/persona` | ผลลัพธ์ Persona | 6 personas (Sleep Seeker, Energy Rebuilder, Detox Reset, Stress Calmer, Body Reshape, Mindful Glow) + +300 credits |
| `/programs` | Personalized Programs | 3-day / 5-day / 7-day packages พร้อมภาพรีสอร์ท/อาหาร/treatment |
| `/programs/$id` | รายละเอียดแพ็คเกจ | ตารางวัน, partner venues, ราคา, จอง |
| `/booking/$id` | Booking confirm | สรุปวันที่/ผู้เข้าพัก/ชำระ |
| `/journey` | During-stay (Phase 3) | ตารางวันนี้, QR redemption mock, daily check-in mood |
| `/report` | Final Wellness Report | Before/After metrics, persona evolution, badge |
| `/care` | Long-term Care | Habit streaks, Calm Credits wallet, รีบุ๊ค |
| `/profile` | Profile/auth | Email หรือ guest mode |

## Design Highlights
- **ภาพจริงสวยๆ** ของเกาะสมุย: หาดทราย, infinity pool, สปา, อาหาร wellness, โยคะ sunrise → ใช้ภาพคุณภาพสูง (Unsplash CDN หรือ generate ผ่าน imagegen สำหรับ hero/persona)
- Layout โล่ง: generous spacing, max-w-6xl, ตัดส่วนรกออก, 1 hero / 1 CTA หลักต่อหน้า
- Framer Motion: fade-up on scroll, parallax hero, card hover lift
- Mobile-first responsive ทุกจอ, bottom nav บน mobile
- **PWA**: manifest + icons (installable, ไม่ทำ offline service worker)

## Stack & Backend
- TanStack Start + Tailwind v4 + shadcn (customized) + Framer Motion
- **Lovable Cloud** (Supabase): tables `profiles`, `quest_responses`, `personas`, `bookings`, `journey_checkins`, `credits_ledger` + RLS
- Auth: email/password (เริ่มต้น); LINE login เลื่อนเป็น phase ถัดไป
- Quest scoring + persona matching: ทำใน client (deterministic), บันทึกผลใน DB

## สิ่งที่จะยังไม่ทำในรอบนี้
- LINE/Telegram bot integration (รอ phase 2)
- Partner LIFF board, Expert review web
- Payment gateway จริง (ใช้ mock confirm)
- Push notifications

---

## ขั้นตอนการสร้าง
1. เปิด Lovable Cloud + สร้าง schema + RLS
2. Design system: tokens (dark emerald + gold), fonts, base components
3. Generate hero images (Koh Samui wellness) ผ่าน imagegen
4. หน้า `/` Landing + Quest flow + Persona result
5. Programs list + detail + booking mock
6. Journey / Report / Care pages
7. PWA manifest + icons + meta
8. Auth + profile

ยืนยันแผนนี้แล้วจะเริ่มลงมือทำได้ทันที — หรือบอกว่าอยากปรับสโคป (เช่น ตัด/เพิ่มเฟสไหน, ใช้ภาษาไทยล้วน vs ไทย/อังกฤษผสม) ก่อนเริ่ม
