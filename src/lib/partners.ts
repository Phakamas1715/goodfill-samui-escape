// Goodfill Care — Target partner directory (prospects, not signed)
// Used on /partners route.

// ============================================================================
// Types
// ============================================================================

export type PartnerStatus = "prospect" | "outreach" | "pilot" | "signed";

export interface Partner {
  name: string;
  role: string;
  status?: PartnerStatus;
  website?: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  tags?: string[];
  priority?: number;
}

export interface PartnerGroup {
  id: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  title: { th: string; en: string };
  intent: { th: string; en: string };
  description?: { th: string; en: string };
  icon?: string;
  partners: Partner[];
}

// ============================================================================
// Partner Groups Data
// ============================================================================

export const partnerGroups: PartnerGroup[] = [
  {
    id: "A",
    title: { th: "Anchor Wellness", en: "Anchor Wellness" },
    intent: {
      th: "พาร์ทเนอร์แม่เหล็ก ภาพลักษณ์ Wellness · Luxury · International",
      en: "Magnet partners — Wellness · Luxury · International image.",
    },
    description: {
      th: "พาร์ทเนอร์ระดับโลกที่สร้างภาพลักษณ์และความน่าเชื่อถือให้กับ Goodfill Care",
      en: "World-class partners that establish credibility and brand image for Goodfill Care",
    },
    icon: "🏆",
    partners: [
      {
        name: "Kamalaya Koh Samui",
        role: "Wellness Retreat / Premium Program / Expert-reviewed Journey",
        website: "https://kamalaya.com",
        location: "Laem Set, Koh Samui",
        priority: 1,
        tags: ["luxury", "wellness", "retreat", "international"],
      },
      {
        name: "Six Senses Samui",
        role: "Luxury Wellness Package / Pre-arrival Quest / Personalized Wellness",
        website: "https://sixsenses.com/samui",
        location: "Choeng Mon, Koh Samui",
        priority: 1,
        tags: ["luxury", "sustainability", "spa", "international"],
      },
      {
        name: "Absolute Sanctuary",
        role: "Detox / Yoga / Pilates / Lifestyle Reset",
        website: "https://absolutesanctuary.com",
        location: "Choeng Mon, Koh Samui",
        priority: 2,
        tags: ["detox", "yoga", "pilates", "wellness"],
      },
      {
        name: "Celes Samui + BDMS Wellness Clinic",
        role: "Scientific Wellness / Preventive Wellness / Premium Health Package",
        website: "https://celessamui.com",
        location: "Bophut, Koh Samui",
        priority: 1,
        tags: ["medical", "preventive", "luxury", "healthcare"],
      },
      {
        name: "The Ritz-Carlton, Koh Samui",
        role: "Luxury Spa / Premium Resort Wellness / High-end Customer Journey",
        website: "https://ritzcarlton.com/samui",
        location: "Chaweng Noi, Koh Samui",
        priority: 1,
        tags: ["luxury", "spa", "resort", "international"],
      },
      {
        name: "Four Seasons Resort Koh Samui",
        role: "Luxury Spa / Immersive Wellness Retreat / Premium International Guests",
        website: "https://fourseasons.com/samui",
        location: "Laem Set, Koh Samui",
        priority: 1,
        tags: ["luxury", "spa", "retreat", "international"],
      },
    ],
  },
  {
    id: "B",
    title: { th: "โรงแรม / รีสอร์ท", en: "Hotels / Resorts" },
    intent: {
      th: "Wellness Package Solution + LINE Partner Board",
      en: "Wellness package solution + LINE Partner Board.",
    },
    description: {
      th: "โรงแรมและรีสอร์ทที่ร่วมเป็นพันธมิตรในการให้บริการ Wellness Package",
      en: "Hotels and resorts partnering for Wellness Package delivery",
    },
    icon: "🏨",
    partners: [
      {
        name: "Celes Samui",
        role: "Wellness Retreat + BDMS link",
        website: "https://celessamui.com",
        location: "Bophut, Koh Samui",
        tags: ["resort", "wellness", "luxury"],
      },
      {
        name: "Six Senses Samui",
        role: "Luxury wellness stay + personalized package",
        website: "https://sixsenses.com/samui",
        location: "Choeng Mon, Koh Samui",
        tags: ["luxury", "resort", "sustainability"],
      },
      {
        name: "The Ritz-Carlton, Koh Samui",
        role: "Premium guest journey + spa service",
        website: "https://ritzcarlton.com/samui",
        location: "Chaweng Noi, Koh Samui",
        tags: ["luxury", "resort", "spa"],
      },
      {
        name: "Four Seasons Resort Koh Samui",
        role: "Luxury wellness retreat",
        website: "https://fourseasons.com/samui",
        location: "Laem Set, Koh Samui",
        tags: ["luxury", "resort", "retreat"],
      },
      {
        name: "Absolute Sanctuary",
        role: "Specialized wellness resort",
        website: "https://absolutesanctuary.com",
        location: "Choeng Mon, Koh Samui",
        tags: ["wellness", "retreat", "detox"],
      },
      {
        name: "The Spa Resorts Samui",
        role: "Spa / Yoga / Fitness / Wellness stay",
        tags: ["spa", "yoga", "fitness"],
      },
    ],
  },
  {
    id: "C",
    title: { th: "ร้านอาหารสุขภาพ", en: "Healthy Restaurants" },
    intent: {
      th: "เชื่อม Meal Plan + Nutrition Target + Portion Level",
      en: "Meal plan + nutrition target + portion level integration.",
    },
    description: {
      th: "ร้านอาหารที่สามารถรองรับ Meal Plan ของ Goodfill Care",
      en: "Restaurants that can accommodate Goodfill Care's Meal Plan",
    },
    icon: "🥗",
    partners: [
      {
        name: "Vikasa Life Cafe",
        role: "Organic / Vegan-friendly / Gluten-free",
        website: "https://vikasa.com/cafe",
        location: "Lamai, Koh Samui",
        tags: ["vegan", "organic", "healthy"],
      },
      {
        name: "Wild Tribe Superfood Cafe",
        role: "Plant-based / Superfood",
        location: "Bangrak, Koh Samui",
        tags: ["plant-based", "superfood", "healthy"],
      },
      {
        name: "The Hub Samui",
        role: "Brunch / Healthy / Vegan / Fruit shakes",
        location: "Fisherman's Village, Koh Samui",
        tags: ["brunch", "vegan", "healthy"],
      },
      {
        name: "Samui Health Shop by Lamphu",
        role: "Organic / Natural products / Health cafe",
        tags: ["organic", "natural", "health-food"],
      },
      {
        name: "FitKoh Cafe",
        role: "Nutritionist-designed meal / Local ingredients",
        tags: ["nutrition", "local", "healthy"],
      },
    ],
  },
  {
    id: "D",
    title: { th: "กิจกรรม Wellness", en: "Wellness Activities" },
    intent: {
      th: "Activity Plan · QR Activity · Service Queue",
      en: "Activity plan · QR activity · service queue.",
    },
    description: {
      th: "กิจกรรมที่ช่วยเสริมสร้างสุขภาพกายและใจ",
      en: "Activities that enhance physical and mental wellbeing",
    },
    icon: "🧘",
    partners: [
      {
        name: "Vikasa Yoga Retreat",
        role: "Yoga / Retreat / Mindfulness",
        website: "https://vikasa.com",
        location: "Lamai, Koh Samui",
        tags: ["yoga", "retreat", "mindfulness"],
      },
      {
        name: "Absolute Sanctuary",
        role: "Yoga / Pilates / Detox / Mental wellbeing",
        website: "https://absolutesanctuary.com",
        location: "Choeng Mon, Koh Samui",
        tags: ["yoga", "pilates", "detox", "wellbeing"],
      },
      {
        name: "Koh Fit Thailand",
        role: "Fitness holiday / Weight loss retreat / Coaching",
        tags: ["fitness", "weight-loss", "coaching"],
      },
      {
        name: "Six Senses Samui",
        role: "Mindfulness / Holistic therapies / Fitness",
        website: "https://sixsenses.com/samui",
        location: "Choeng Mon, Koh Samui",
        tags: ["mindfulness", "holistic", "fitness"],
      },
      {
        name: "The Ritz-Carlton Spa Village",
        role: "Spa / Yoga pavilion / Holistic rejuvenation",
        website: "https://ritzcarlton.com/samui",
        location: "Chaweng Noi, Koh Samui",
        tags: ["spa", "yoga", "holistic"],
      },
      {
        name: "Four Seasons Spa",
        role: "Personalized spa / Immersive wellness retreat",
        website: "https://fourseasons.com/samui",
        location: "Laem Set, Koh Samui",
        tags: ["spa", "luxury", "retreat"],
      },
    ],
  },
  {
    id: "E",
    title: { th: "คลินิก / ผู้เชี่ยวชาญ", en: "Clinics / Experts" },
    intent: {
      th: "Expert Review · Medical Suitability · Preventive Wellness (ไม่ใช่การวินิจฉัยโรค)",
      en: "Expert review · medical suitability · preventive wellness (not diagnosis).",
    },
    description: {
      th: "ผู้เชี่ยวชาญทางการแพทย์ที่ให้คำปรึกษาด้านสุขภาพ",
      en: "Medical experts providing health consultations",
    },
    icon: "🏥",
    partners: [
      {
        name: "Bangkok Hospital Samui",
        role: "Medical support / Health package / Referral",
        website: "https://bangkokhospitalsamui.com",
        location: "Chaweng, Koh Samui",
        tags: ["medical", "hospital", "healthcare"],
      },
      {
        name: "BDMS Wellness Clinic @ Celes Samui",
        role: "Preventive wellness treatment supervision",
        website: "https://bdms.co.th",
        location: "Bophut, Koh Samui",
        tags: ["preventive", "wellness", "healthcare"],
      },
      {
        name: "Koh Samui Hospital",
        role: "Travel medicine / Vaccination / Public health",
        location: "Bophut, Koh Samui",
        tags: ["public-health", "vaccination", "travel-medicine"],
      },
      {
        name: "Physiotherapy Dept., Bangkok Hospital Samui",
        role: "Physical therapy / Mobility care",
        tags: ["physiotherapy", "rehabilitation", "healthcare"],
      },
    ],
  },
  {
    id: "F",
    title: { th: "Wellness Travel", en: "Wellness Travel" },
    intent: {
      th: "ตัวช่วยขายแพ็กเกจให้ลูกค้าต่างชาติ",
      en: "Channels to international wellness travellers.",
    },
    description: {
      th: "ตัวแทนท่องเที่ยวที่ช่วยจำหน่ายแพ็กเกจ Wellness",
      en: "Travel agents helping to sell Wellness packages",
    },
    icon: "✈️",
    partners: [
      {
        name: "Travel Agency สมุย",
        role: "Samui Recharge Journey",
        tags: ["travel", "agency", "local"],
      },
      {
        name: "Wellness Travel Agency",
        role: "International Wellness Quest",
        tags: ["travel", "wellness", "international"],
      },
      {
        name: "Hotel Concierge",
        role: "Pre-arrival Quest funnel",
        tags: ["hotel", "concierge", "service"],
      },
      {
        name: "Airport Transfer / Private Driver",
        role: "Premium transfer",
        tags: ["transport", "premium", "service"],
      },
      {
        name: "Corporate Retreat Organizer",
        role: "Org / Executive retreat package",
        tags: ["corporate", "retreat", "executive"],
      },
    ],
  },
  {
    id: "G",
    title: { th: "พาร์ทเนอร์เสริม", en: "Add-on Partners" },
    intent: {
      th: "ทำให้แพ็กเกจน่าซื้อขึ้น · Reward / Welcome Kit / Memory",
      en: "Make packages more compelling · rewards / welcome kits / memory.",
    },
    description: {
      th: "พาร์ทเนอร์ที่ช่วยเพิ่มมูลค่าให้กับแพ็กเกจ",
      en: "Partners that add value to packages",
    },
    icon: "🎁",
    partners: [
      {
        name: "Herbal product / สมุนไพร",
        role: "Welcome Kit / Herbal tea / Spa product",
        tags: ["herbal", "products", "welcome-kit"],
      },
      {
        name: "ร้านของฝากสุขภาพ",
        role: "Reward / Calm Credits redemption",
        tags: ["souvenir", "rewards", "redemption"],
      },
      {
        name: "ช่างภาพ / Content creator",
        role: "Wellness journey photo report",
        tags: ["photography", "content", "memory"],
      },
      {
        name: "ครูสอนทำอาหารไทย",
        role: "Thai healthy cooking class",
        tags: ["cooking", "thai", "class"],
      },
      {
        name: "Local experience provider",
        role: "Beach walk / Temple mindful trip / Nature therapy",
        tags: ["experience", "nature", "mindfulness"],
      },
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

export const outreachOrder = [
  "Celes Samui + BDMS Wellness Clinic",
  "Vikasa Life Cafe / Vikasa Yoga Retreat",
  "Absolute Sanctuary",
  "The Spa Resorts Samui",
  "Wild Tribe Superfood Cafe / The Hub Samui",
  "Bangkok Hospital Samui",
  "Six Senses / Kamalaya / Ritz-Carlton / Four Seasons",
];

// Get all partners from all groups
export function getAllPartners(): Array<Partner & { groupId: string; groupTitle: { th: string; en: string } }> {
  const all: Array<Partner & { groupId: string; groupTitle: { th: string; en: string } }> = [];

  for (const group of partnerGroups) {
    for (const partner of group.partners) {
      all.push({
        ...partner,
        groupId: group.id,
        groupTitle: group.title,
      });
    }
  }

  return all;
}

// Get partners by tag
export function getPartnersByTag(tag: string): Array<Partner & { groupId: string }> {
  const matches: Array<Partner & { groupId: string }> = [];

  for (const group of partnerGroups) {
    for (const partner of group.partners) {
      if (partner.tags?.includes(tag)) {
        matches.push({ ...partner, groupId: group.id });
      }
    }
  }

  return matches;
}

// Get partners by group
export function getPartnersByGroup(groupId: PartnerGroup["id"]): Partner[] {
  const group = partnerGroups.find((g) => g.id === groupId);
  return group?.partners ?? [];
}

// Search partners by name or role
export function searchPartners(
  query: string,
  lang: "th" | "en" = "th",
): Array<Partner & { groupId: string; groupTitle: string }> {
  const lowerQuery = query.toLowerCase();
  const results: Array<Partner & { groupId: string; groupTitle: string }> = [];

  for (const group of partnerGroups) {
    const groupTitle = group.title[lang];

    for (const partner of group.partners) {
      if (
        partner.name.toLowerCase().includes(lowerQuery) ||
        partner.role.toLowerCase().includes(lowerQuery) ||
        partner.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      ) {
        results.push({ ...partner, groupId: group.id, groupTitle });
      }
    }
  }

  return results;
}

// Get partner count by group
export function getPartnerCountByGroup(): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const group of partnerGroups) {
    counts[group.id] = group.partners.length;
  }

  return counts;
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();

  for (const group of partnerGroups) {
    for (const partner of group.partners) {
      partner.tags?.forEach((tag) => tags.add(tag));
    }
  }

  return Array.from(tags).sort();
}

// Get partners by priority
export function getPartnersByPriority(maxPriority: number = 2): Array<Partner & { groupId: string }> {
  const results: Array<Partner & { groupId: string }> = [];

  for (const group of partnerGroups) {
    for (const partner of group.partners) {
      if ((partner.priority ?? 3) <= maxPriority) {
        results.push({ ...partner, groupId: group.id });
      }
    }
  }

  return results.sort((a, b) => (a.priority ?? 3) - (b.priority ?? 3));
}

// Get outreach priority list with metadata
export function getOutreachPriorityList(): Array<{ name: string; groups: string[]; priority: number }> {
  return [
    { name: "Celes Samui + BDMS Wellness Clinic", groups: ["A", "B", "E"], priority: 1 },
    { name: "Vikasa Life Cafe / Vikasa Yoga Retreat", groups: ["C", "D"], priority: 1 },
    { name: "Absolute Sanctuary", groups: ["A", "B", "D"], priority: 2 },
    { name: "The Spa Resorts Samui", groups: ["B"], priority: 2 },
    { name: "Wild Tribe Superfood Cafe / The Hub Samui", groups: ["C"], priority: 2 },
    { name: "Bangkok Hospital Samui", groups: ["E"], priority: 3 },
    { name: "Six Senses / Kamalaya / Ritz-Carlton / Four Seasons", groups: ["A", "B", "D"], priority: 3 },
  ];
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  partnerGroups,
  outreachOrder,
  getAllPartners,
  getPartnersByTag,
  getPartnersByGroup,
  searchPartners,
  getPartnerCountByGroup,
  getAllTags,
  getPartnersByPriority,
  getOutreachPriorityList,
};
