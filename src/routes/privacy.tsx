import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Goodfill Care" },
      { name: "description", content: "How Goodfill Care handles your personal data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 prose prose-sm">
      <h1>Privacy Policy</h1>
      <p>
        Goodfill Care collects only the information needed to deliver retreat bookings and personalized
        wellness recommendations. We never sell personal data. Contact us at
        hello@goodfillcare-samui.com for access, correction, or deletion requests.
      </p>
    </main>
  );
}