import { createFileRoute, Outlet, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getMyRoles } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Calendar,
  Package,
  Users,
  Settings,
  LogOut,
  Star,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  User,
  Shield,
  Bell,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const roles = await getMyRoles();
    if (!roles.includes("admin") && !roles.includes("staff")) {
      throw redirect({ to: "/" });
    }
    return { roles };
  },
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Goodfill Care" },
      { name: "description", content: "ระบบจัดการหลังบ้าน Goodfill Care" },
    ],
  }),
});

const navItems = [
  { to: "/admin", label: "ภาพรวม", labelEn: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/bookings", label: "การจอง", labelEn: "Bookings", icon: Calendar },
  { to: "/admin/programs", label: "โปรแกรม", labelEn: "Programs", icon: Package },
  { to: "/admin/reviews", label: "รีวิว", labelEn: "Reviews", icon: Star },
  { to: "/admin/users", label: "ผู้ใช้และสิทธิ์", labelEn: "Users & Roles", icon: Users },
  { to: "/admin/line", label: "LINE เมนู", labelEn: "LINE Menu", icon: MessageSquare },
  { to: "/admin/settings", label: "ตั้งค่า", labelEn: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const { roles } = Route.useRouteContext();
  const nav = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("ออกจากระบบสำเร็จ");
      nav({ to: "/" });
    } catch (error) {
      toast.error("ออกจากระบบไม่สำเร็จ");
    }
  };

  const roleLabels: Record<string, string> = {
    admin: "ผู้ดูแลระบบ",
    staff: "เจ้าหน้าที่",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream/30 via-white to-cream/20">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-emerald-deep to-emerald text-white flex-col fixed inset-y-0 left-0 z-30 shadow-xl">
        {/* Logo */}
        <div className="p-5 border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gold/20 flex items-center justify-center">
              <Sparkles size={16} className="text-gold" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold">Goodfill Care</div>
              <div className="text-[9px] uppercase tracking-wider opacity-70">Admin Console</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/admin" }}
              activeProps={{ className: "bg-white/20 text-white shadow-md" }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 group"
            >
              <n.icon size={18} className="opacity-80 group-hover:opacity-100" />
              <span className="text-sm font-medium">{n.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{userEmail || "Admin"}</div>
              <div className="text-[10px] opacity-70">{roles.map((r) => roleLabels[r] || r).join(", ")}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/30 transition text-sm"
          >
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-mint/30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-gold" />
            <span className="font-display font-semibold text-navy">Goodfill Care</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-cream transition"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-14 left-0 right-0 bg-white rounded-b-2xl shadow-xl mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-mint/30">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-emerald/10 flex items-center justify-center">
                  <User size={18} className="text-emerald" />
                </div>
                <div>
                  <div className="text-sm font-medium text-navy">{userEmail || "Admin"}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {roles.map((r) => roleLabels[r] || r).join(", ")}
                  </div>
                </div>
              </div>
            </div>
            <nav className="p-2">
              {navItems.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileMenuOpen(false)}
                  activeOptions={{ exact: n.to === "/admin" }}
                  activeProps={{ className: "bg-emerald/10 text-emerald" }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-cream transition"
                >
                  <n.icon size={18} />
                  <span className="text-sm">{n.label}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-mint/30">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition"
              >
                <LogOut size={16} /> ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-mint/30 z-40">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/admin" }}
              activeProps={{ className: "text-emerald" }}
              className="flex flex-col items-center gap-1 px-3 py-1.5 text-navy/70 hover:text-emerald transition"
            >
              <n.icon size={18} />
              <span className="text-[9px]">{n.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
