
## Goodfill — แผนการพัฒนา 4 Phase

ลุยทีละ phase, แต่ละ phase verify ก่อนข้าม

### Phase 1 — Admin Dashboard จริง (LINE Login)
**Schema**
- `user_roles` มีอยู่แล้ว (admin/moderator/user) — เพิ่ม role `staff`, `expert`, `partner`
- เพิ่มตาราง `line_identities` (user_id ↔ line_user_id, channel: customer/partner) สำหรับ map LINE → user
- เพิ่มตาราง `app_settings` (key/value JSONB) — ตั้งค่าได้จริง (LINE OA names, opening hours, brand text, feature flags)
- programs ตารางมีอยู่แล้ว — เพิ่ม policy admin update/insert/delete

**Routes**
- `/admin` (under `_authenticated/` + has_role admin/staff check) — แดชบอร์ดหลัก
  - `/admin/bookings` — ดู bookings realtime, filter status, view dietary plan/notes, send LINE message, mark complete
  - `/admin/programs` — CRUD programs (title, price, days, location, image_url, dietary options)
  - `/admin/reviews` — ดู/อนุมัติรีวิว
  - `/admin/users` — assign roles, ดู line identities
  - `/admin/settings` — แก้ app_settings (brand name, contact, LINE OA ids — display only, hours)
- `/admin/login` — LINE Login flow ผ่าน LIFF (ใช้ VITE_LIFF_ID ที่มี): user เปิดใน LINE → liff.init → liff.getIDToken → POST `/api/public/line-login` → server verify ID token กับ LINE → upsert profile + line_identities → set Supabase session via service role create-or-sign-in flow → redirect /admin

**Server fns**
- `admin.functions.ts` — listBookings, updateBooking, listPrograms, upsertProgram, deleteProgram, listReviews, listUsers, assignRole, getSettings, updateSetting (all `requireSupabaseAuth` + has_role check)
- Route `/api/public/line-login` — verify LIFF ID token, mint Supabase session

**Verify P1:** สร้าง admin user, ทดสอบ CRUD programs, แก้ settings, see bookings list

---

### Phase 2 — Image System + Storage
- สร้าง bucket `program-images` (public)
- หน้า Admin upload (drag-drop, preview, alt text), เก็บ urls ลง `programs.image_urls` (เปลี่ยน image_url → text[])
- AI generate placeholder ทันที 4 programs × 6 ภาพ (hero, gallery×3, meal, venue) ผ่าน Lovable AI gateway (`google/gemini-3.1-flash-image-preview`) → upload Storage → update DB
- Gallery component ในหน้า `/programs/$id` (carousel + lightbox)
- เพิ่ม OG image จาก hero image แต่ละโปรแกรม

**Verify P2:** ภาพโชว์ครบทุกโปรแกรม, admin upload ใหม่ได้, OG preview ทำงาน

---

### Phase 3 — LINE Rich Menu + LIFF
- LIFF endpoints ใน app:
  - `/liff/quest` — Wellness Quest (ใช้ที่มี)
  - `/liff/pass` — My Wellness Pass (QR code + booking info)
  - `/liff/partner` — Partner Board (today queue, scan QR)
  - `/liff/expert` — Expert Review Board
- Rich Menu setup script (server fn `setupRichMenu`) — สร้าง rich menu ฝั่ง customer (4 ปุ่ม: Quest/My Pass/Programs/Contact) และ partner (Today Queue/Scan QR/Menu)
- ส่ง LINE message ตอน confirm booking มี action button → LIFF URL พร้อม `?bookingCode=GF-XXXX`
- QR code generator (`qrcode` lib) แสดงใน `/liff/pass`
- Scan QR ใน `/liff/partner` (ใช้ liff.scanCodeV2) → POST `/api/redeem` → mark booking redeemed

**Verify P3:** เปิดใน LINE app เห็น rich menu, กดเปิด LIFF ได้, QR pass แสดงผล, partner scan ได้

---

### Phase 4 — Notification Engine + Expert Review
- ตาราง `notifications_queue` (event_type, target_channel, target_line_id, payload, status, sent_at)
- Server fn `pushNotification(eventType, bookingId)` — สร้างข้อความ flex ตาม event:
  - booking_created → customer + partner
  - check_in_reminder → customer (cron)
  - today_queue → partner morning
  - risk_flag → expert
  - review_submitted → admin
- Trigger จากจุดเหล่านี้: confirmBooking, redeemBooking, submitReview, ฯลฯ
- Expert Review Board (`/liff/expert` + `/admin/expert-review`): list pending cases, approve/reject meal & activity plan, add notes
- เพิ่มตาราง `expert_reviews` (booking_id, reviewer_id, status, meal_plan_approved, notes)

**Verify P4:** trigger event ทดสอบครบ → ข้อความถึง LINE จริง

---

## Technical highlights

**LINE Login flow (P1):**
```
User เปิด /admin/login ใน LINE → liff.init(VITE_LIFF_ID)
→ liff.getIDToken() → POST /api/public/line-login {id_token}
→ Server: fetch https://api.line.me/oauth2/v2.1/verify (verify token)
→ get lineUserId, displayName
→ supabaseAdmin: find/create user via admin.createUser (email = line_{lineUserId}@goodfill.local)
→ upsert line_identities(user_id, line_user_id, channel='customer')
→ admin.generateLink type=magiclink → return session token to client
→ supabase.auth.setSession() → redirect /admin
```

**Settings ตั้งค่าได้จริง (P1):**
- `app_settings` key/value JSONB → cached client-side via TanStack Query
- Admin UI: form per key (brand_name, contact_phone, contact_email, default_meal_plan, business_hours_json, feature_flags_json)
- Page รับค่าจาก `useAppSettings()` hook แทน hardcode

**Roles ที่จำเป็น:**
- `admin` — full access
- `staff` — bookings + reviews
- `expert` — expert review board เท่านั้น
- `partner` — partner board เท่านั้น (อาจไม่ต้องเข้า web)
- `user` — default

---

## ขอบเขตคำตอบครั้งนี้

ลุย **Phase 1 ก่อนทั้งหมด** (Admin Dashboard + LINE Login + Settings + roles) ในการตอบครั้งเดียวนี้ จากนั้นค่อยรอ user verify แล้วลุย P2, P3, P4 ในรอบถัดไป

Phase 1 deliverables:
1. Migration: extend app_role enum, line_identities, app_settings, programs admin policies
2. `/api/public/line-login` route — verify LIFF token + mint session
3. `_authenticated/admin/` layout + 5 pages (bookings, programs, reviews, users, settings)
4. `admin.functions.ts` — server fns with role gate
5. `useAppSettings` hook + replace hardcoded values
6. หน้า `/admin/login` ใช้ LIFF (fallback แสดง QR ให้สแกนเปิดใน LINE สำหรับ desktop)

โอเคลุยตามนี้มั้ยครับ? ตอบ "ลุย P1" จะเริ่มทันที
