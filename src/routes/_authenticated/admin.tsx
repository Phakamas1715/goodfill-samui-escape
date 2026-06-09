import { createFileRoute, Outlet, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getMyRoles } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Calendar, Package, Users, Settings, LogOut, Star, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const roles = await getMyRoles();
    if (!roles.includes("admin") && !roles.includes("staff")) {
      throw redirect({ to: "/" });
    }
    return { roles };
  },
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — Goodfill Care" }] }),
});

const navItems = [
  { to: "/admin", label: "ภาพรวม", icon: LayoutDashboard },
  { to: "/admin/bookings", label: "Bookings", icon: Calendar },
  { to: "/admin/programs", label: "Programs", icon: Package },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/users", label: "Users & Roles", icon: Users },
  { to: "/admin/line", label: "LINE Menu", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const { roles } = Route.useRouteContext();
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-cream/30 flex">
      <aside className="w-56 bg-emerald text-ivory hidden md:flex flex-col p-4 sticky top-0 h-screen">
        <div className="font-display text-xl mb-1">Goodfill</div>
        <div className="text-[10px] uppercase tracking-widest opacity-70 mb-6">Admin Console</div>
        <nav className="flex-1 space-y-1 text-sm">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/admin" }}
              activeProps={{ className: "bg-mint/30 text-ivory" }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-mint/20 transition"
            >
              <n.icon size={16} />
              <span>{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="text-[10px] opacity-70 mb-2">Role: {roles.join(", ") || "—"}</div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            nav({ to: "/login" });
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/30 text-sm"
        >
          <LogOut size={16} /> ออกจากระบบ
        </button>
      </aside>
      <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-auto">
        <div className="md:hidden mb-4 flex gap-2 overflow-x-auto pb-2">
          {navItems.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/admin" }}
              activeProps={{ className: "bg-emerald text-ivory" }}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-cream border border-mint/40">
              {n.label}
            </Link>
          ))}
        </div>
        <Outlet />
      </main>
    </div>
  );
}