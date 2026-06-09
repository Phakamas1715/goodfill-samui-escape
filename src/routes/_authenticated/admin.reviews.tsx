import { createFileRoute } from "@tanstack/react-router";
import { Star, MessageCircle, Calendar, Clock, Sparkles, Shield, Users, ThumbsUp, Award } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: ReviewsPage,
  head: () => ({
    meta: [
      { title: "Reviews Management | Goodfill Care Admin" },
      { name: "description", content: "จัดการรีวิวจากลูกค้าและผู้เชี่ยวชาญ" },
    ],
  }),
});

function ReviewsPage() {
  const [showRoadmap, setShowRoadmap] = useState(true);

  const features = [
    {
      icon: Star,
      title: "Customer Reviews",
      titleTh: "รีวิวจากลูกค้า",
      description: "ให้คะแนนและรีวิวหลังจบโปรแกรม",
      status: "planned",
      phase: "Phase 4",
    },
    {
      icon: Shield,
      title: "Expert Review Board",
      titleTh: "คณะกรรมการผู้เชี่ยวชาญ",
      description: "ผู้เชี่ยวชาญตรวจสอบและให้คะแนน",
      status: "planned",
      phase: "Phase 4",
    },
    {
      icon: MessageCircle,
      title: "Testimonials Gallery",
      titleTh: "แกลเลอรี่รีวิว",
      description: "แสดงรีวิวพร้อมรูปภาพ",
      status: "planned",
      phase: "Phase 5",
    },
    {
      icon: Award,
      title: "Verified Badges",
      titleTh: "ปุ่มยืนยันตัวตน",
      description: "รีวิวจากลูกค้าที่จริง",
      status: "planned",
      phase: "Phase 5",
    },
  ];

  const stats = {
    totalReviews: 0,
    averageRating: 0,
    expertReviews: 0,
    customerReviews: 0,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-navy">จัดการรีวิว</h1>
          <p className="text-sm text-muted-foreground mt-1">ระบบรีวิวและคำนิยมจากลูกค้าและผู้เชี่ยวชาญ</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-cream/50 rounded-xl px-3 py-1.5 text-center">
            <div className="text-xs text-muted-foreground">Phase 4-5</div>
            <div className="text-[10px] text-emerald">กำลังพัฒนา</div>
          </div>
        </div>
      </header>

      {/* Stats Preview (Coming Soon) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-mint/20">
          <Star className="mx-auto text-gold mb-2" size={20} />
          <div className="text-2xl font-bold text-navy">{stats.totalReviews}</div>
          <div className="text-[10px] text-muted-foreground">รีวิวทั้งหมด</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-mint/20">
          <div className="flex items-center justify-center gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={16} className="text-gray-300" fill="currentColor" />
            ))}
          </div>
          <div className="text-2xl font-bold text-navy">{stats.averageRating}</div>
          <div className="text-[10px] text-muted-foreground">คะแนนเฉลี่ย</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-mint/20">
          <Users className="mx-auto text-emerald mb-2" size={20} />
          <div className="text-2xl font-bold text-navy">{stats.customerReviews}</div>
          <div className="text-[10px] text-muted-foreground">รีวิวลูกค้า</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-mint/20">
          <Shield className="mx-auto text-gold mb-2" size={20} />
          <div className="text-2xl font-bold text-navy">{stats.expertReviews}</div>
          <div className="text-[10px] text-muted-foreground">รีวิวผู้เชี่ยวชาญ</div>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-gold/10 via-emerald/5 to-transparent rounded-2xl p-5 border border-gold/20">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-gold" />
          </div>
          <div>
            <h2 className="font-display text-lg text-navy">ระบบรีวิวกำลังจะมาเร็วๆ นี้!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              เรากำลังพัฒนาระบบรีวิวที่จะช่วยให้ลูกค้าแชร์ประสบการณ์และผู้เชี่ยวชาญให้คะแนนโปรแกรม
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald bg-emerald/10 px-2.5 py-1 rounded-full">
                <Calendar size={12} /> คาดว่า Q2 2025
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] text-gold bg-gold/10 px-2.5 py-1 rounded-full">
                <Clock size={12} /> Phase 4-5
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Roadmap */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-navy flex items-center gap-2">
            <Award size={16} className="text-gold" />
            ฟีเจอร์ที่จะมาในอนาคต
          </h2>
          <button
            onClick={() => setShowRoadmap(!showRoadmap)}
            className="text-[10px] text-muted-foreground hover:text-gold transition"
          >
            {showRoadmap ? "ซ่อน" : "แสดง"}
          </button>
        </div>

        {showRoadmap && (
          <div className="grid sm:grid-cols-2 gap-3">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-4 border border-mint/30 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <feature.icon size={16} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-navy text-sm">{feature.titleTh}</div>
                        <div className="text-[10px] text-muted-foreground">{feature.title}</div>
                      </div>
                      <span className="text-[9px] font-medium text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">
                        {feature.phase}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty State (Current) */}
      <div className="card-cream rounded-2xl p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-cream mb-4">
          <MessageCircle size={32} className="text-muted-foreground/50" />
        </div>
        <h3 className="font-display text-xl text-navy mb-2">ยังไม่มีรีวิวในระบบ</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          เมื่อลูกค้าเริ่มให้รีวิวหลังจบโปรแกรม รีวิวจะแสดงที่นี่
        </p>
        <div className="mt-4 text-[11px] text-muted-foreground">
          <ThumbsUp size={14} className="inline mr-1" />
          Expert Review Board + Customer Reviews จะเปิดใน Phase 4
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] text-muted-foreground pt-4">
        ระบบรีวิวจะเชื่อมต่อกับ Notification Engine และระบบคะแนนความพึงพอใจ
      </div>
    </div>
  );
}
