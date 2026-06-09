import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login/partner")({
  ssr: false,
  component: () => <Navigate to="/login" search={{ channel: "partner" }} replace />,
  head: () => ({ meta: [{ title: "พาร์ทเนอร์เข้าสู่ระบบ — Goodfill Care" }] }),
});