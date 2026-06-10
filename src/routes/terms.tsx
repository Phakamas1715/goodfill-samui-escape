import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Goodfill Care" },
      { name: "description", content: "Terms governing use of Goodfill Care services." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 prose prose-sm">
      <h1>Terms of Service</h1>
      <p>
        By booking a Goodfill Care retreat you agree to follow program guidelines and our cancellation
        policy. Full terms are provided at the time of booking confirmation.
      </p>
    </main>
  );
}