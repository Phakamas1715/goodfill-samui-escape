import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, createContext, useContext } from "react";
import { Loader2, AlertCircle } from "lucide-react";

// Create user context for child routes
interface UserContextType {
  user: any;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({ user: null, isLoading: true });

export function useAuth() {
  return useContext(UserContext);
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    return { user: data.user };
  },
  component: AuthenticatedLayout,
  pendingComponent: () => (
    <div className="min-h-screen bg-gradient-to-br from-ivory to-cream flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={40} className="animate-spin text-emerald mx-auto mb-4" />
        <p className="text-muted-foreground">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => {
    const navigate = useNavigate();
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory to-cream flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="size-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="font-display text-2xl text-navy mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-sm text-muted-foreground mb-4">{error.message || "ไม่สามารถตรวจสอบสิทธิ์ผู้ใช้ได้"}</p>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="btn-emerald rounded-full px-6 py-2.5 text-sm font-medium"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  },
});

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const [sessionLoading, setSessionLoading] = useState(true);

  // Listen for auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate({ to: "/login" });
      }
      setSessionLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory to-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-emerald mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, isLoading: false }}>
      <Outlet />
    </UserContext.Provider>
  );
}
