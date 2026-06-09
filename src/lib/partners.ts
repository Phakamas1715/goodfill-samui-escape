// Goodfill Care — Target partner directory (prospects, not signed)
// Used on /partners route.

export type PartnerStatus = "prospect" | "outreach" | "pilot" | "signed";

export interface Partner {
  name: string;
  role: string;
  status?: PartnerStatus;
}

export interface PartnerGroup {
  id: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  title: { th: string; en: string };
  intent: { th: string; en: string };
  partners: Partner[];
}

export const partnerGroups: PartnerGroup[] = [
  {
    id: "A",
    title: { th: "Anchor Wellness", en: "Anchor Wellness" },
    intent: {
      th: "พาร์ทเนอร์แม่เหล็ก ภาพลักษณ์ Wellness · Luxury · International",
      en: "Magnet partners — Wellness · Luxury · International image.",
    },
    partners: [
      { name: "Kamalaya Koh Samui", role: "Wellness Retreat / Premium Program / Expert-reviewed Journey" },
      { name: "Six Senses Samui", role: "Luxury Wellness Package / Pre-arrival Quest / Personalized Wellness" },
      { name: "Absolute Sanctuary", role: "Detox / Yoga / Pilates / Lifestyle Reset" },
      { name: "Celes Samui + BDMS Wellness Clinic", role: "Scientific Wellness / Preventive Wellness / Premium Health Package" },
      { name: "The Ritz-Carlton, Koh Samui", role: "Luxury Spa / Premium Resort Wellness / High-end Customer Journey" },
      { name: "Four Seasons Resort Koh Samui", role: "Luxury Spa / Immersive Wellness Retreat / Premium International Guests" },
    ],
  },
  {
    id: "B",
    title: { th: "โรงแรม / รีสอร์ท", en: "Hotels / Resorts" },
    intent: {
      th: "Wellness Package Solution + LINE Partner Board",
      en: "Wellness package solution + LINE Partner Board.",
    },
    partners: [
      { name: "Celes Samui", role: "Wellness Retreat + BDMS link" },
      { name: "Six Senses Samui", role: "Luxury wellness stay + personalized package" },
      { name: "The Ritz-Carlton, Koh Samui", role: "Premium guest journey + spa service" },
      { name: "Four Seasons Resort Koh Samui", role: "Luxury wellness retreat" },
      { name: "Absolute Sanctuary", role: "Specialized wellness resort" },
      { name: "The Spa Resorts Samui", role: "Spa / Yoga / Fitness / Wellness stay" },
    ],
  },
  {
    id: "C",
    title: { th: "ร้านอาหารสุขภาพ", en: "Healthy Restaurants" },
    intent: {
      th: "เชื่อม Meal Plan + Nutrition Target + Portion Level",
      en: "Meal plan + nutrition target + portion level integration.",
    },
    partners: [
      { name: "Vikasa Life Cafe", role: "Organic / Vegan-friendly / Gluten-free" },
      { name: "Wild Tribe Superfood Cafe", role: "Plant-based / Superfood" },
      { name: "The Hub Samui", role: "Brunch / Healthy / Vegan / Fruit shakes" },
      { name: "Samui Health Shop by Lamphu", role: "Organic / Natural products / Health cafe" },
      { name: "FitKoh Cafe", role: "Nutritionist-designed meal / Local ingredients" },
    ],
  },
  {
    id: "D",
    title: { th: "กิจกรรม Wellness", en: "Wellness Activities" },
    intent: {
      th: "Activity Plan · QR Activity · Service Queue",
      en: "Activity plan · QR activity · service queue.",
    },
    partners: [
      { name: "Vikasa Yoga Retreat", role: "Yoga / Retreat / Mindfulness" },
      { name: "Absolute Sanctuary", role: "Yoga / Pilates / Detox / Mental wellbeing" },
      { name: "Koh Fit Thailand", role: "Fitness holiday / Weight loss retreat / Coaching" },
      { name: "Six Senses Samui", role: "Mindfulness / Holistic therapies / Fitness" },
      { name: "The Ritz-Carlton Spa Village", role: "Spa / Yoga pavilion / Holistic rejuvenation" },
      { name: "Four Seasons Spa", role: "Personalized spa / Immersive wellness retreat" },
    ],
  },
  {
    id: "E",
    title: { th: "คลินิก / ผู้เชี่ยวชาญ", en: "Clinics / Experts" },
    intent: {
      th: "Expert Review · Medical Suitability · Preventive Wellness (ไม่ใช่การวินิจฉัยโรค)",
      en: "Expert review · medical suitability · preventive wellness (not diagnosis).",
    },
    partners: [
      { name: "Bangkok Hospital Samui", role: "Medical support / Health package / Referral" },
      { name: "BDMS Wellness Clinic @ Celes Samui", role: "Preventive wellness treatment supervision" },
      { name: "Koh Samui Hospital", role: "Travel medicine / Vaccination / Public health" },
      { name: "Physiotherapy Dept., Bangkok Hospital Samui", role: "Physical therapy / Mobility care" },
    ],
  },
  {
    id: "F",
    title: { th: "Wellness Travel", en: "Wellness Travel" },
    intent: {
      th: "ตัวช่วยขายแพ็กเกจให้ลูกค้าต่างชาติ",
      en: "Channels to international wellness travellers.",
    },
    partners: [
      { name: "Travel Agency สมุย", role: "Samui Recharge Journey" },
      { name: "Wellness Travel Agency", role: "International Wellness Quest" },
      { name: "Hotel Concierge", role: "Pre-arrival Quest funnel" },
      { name: "Airport Transfer / Private Driver", role: "Premium transfer" },
      { name: "Corporate Retreat Organizer", role: "Org / Executive retreat package" },
    ],
  },
  {
    id: "G",
    title: { th: "พาร์ทเนอร์เสริม", en: "Add-on Partners" },
    intent: {
      th: "ทำให้แพ็กเกจน่าซื้อขึ้น · Reward / Welcome Kit / Memory",
      en: "Make packages more compelling · rewards / welcome kits / memory.",
    },
    partners: [
      { name: "Herbal product / สมุนไพร", role: "Welcome Kit / Herbal tea / Spa product" },
      { name: "ร้านของฝากสุขภาพ", role: "Reward / Calm Credits redemption" },
      { name: "ช่างภาพ / Content creator", role: "Wellness journey photo report" },
      { name: "ครูสอนทำอาหารไทย", role: "Thai healthy cooking class" },
      { name: "Local experience provider", role: "Beach walk / Temple mindful trip / Nature therapy" },
    ],
  },
];

export const outreachOrder = [
  "Celes Samui + BDMS Wellness Clinic",
  "Vikasa Life Cafe / Vikasa Yoga Retreat",
  "Absolute Sanctuary",
  "The Spa Resorts Samui",
  "Wild Tribe Superfood Cafe / The Hub Samui",
  "Bangkok Hospital Samui",
  "Six Senses / Kamalaya / Ritz-Carlton / Four Seasons",
];