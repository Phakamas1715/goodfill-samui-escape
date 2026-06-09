import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login/customer")({
  ssr: false,
  component: () => <Navigate to="/login" search={{ channel: "customer" }} replace />,
  head: () => ({ meta: [{ title: "ลูกค้าเข้าสู่ระบบ — Goodfill Care" }] }),
});