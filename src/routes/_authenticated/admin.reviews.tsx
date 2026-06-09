import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/reviews")({ component: ReviewsPage });

function ReviewsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-3xl text-navy">Reviews</h1>
        <p className="text-sm text-muted-foreground">ระบบรีวิวจะเปิดใน Phase 4</p>
      </header>
      <div className="card-cream rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">⭐</div>
        <p className="text-sm text-muted-foreground">ยังไม่มีรีวิวในระบบ</p>
        <p className="text-[11px] text-muted-foreground mt-2">Expert Review Board + Customer Review จะเพิ่มใน Phase 4 (Notification Engine)</p>
      </div>
    </div>
  );
}