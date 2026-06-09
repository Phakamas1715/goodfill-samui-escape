import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listUsersWithRoles, assignRole } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/users")({ component: UsersPage });

const ROLES = ["admin", "staff", "expert", "partner", "user"] as const;

function UsersPage() {
  const fetchFn = useServerFn(listUsersWithRoles);
  const assignFn = useServerFn(assignRole);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin", "users"], queryFn: () => fetchFn() });
  const toggle = useMutation({
    mutationFn: (input: any) => assignFn({ data: input }),
    onSuccess: () => {
      toast.success("อัปเดต role แล้ว");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: any) => toast.error(e.message ?? "ผิดพลาด"),
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-3xl text-navy">Users & Roles</h1>
        <p className="text-sm text-muted-foreground">{q.data?.length ?? 0} ผู้ใช้ในระบบ</p>
      </header>
      <div className="card-cream rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-emerald text-ivory text-left">
            <tr>
              <th className="px-3 py-2 font-normal">Email</th>
              <th className="px-3 py-2 font-normal">LINE</th>
              <th className="px-3 py-2 font-normal">สร้างเมื่อ</th>
              <th className="px-3 py-2 font-normal">Roles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mint/20">
            {(q.data ?? []).map((u: any) => (
              <tr key={u.id} className="hover:bg-cream/30 align-top">
                <td className="px-3 py-2 font-mono text-[10px] max-w-[200px] truncate">{u.email}</td>
                <td className="px-3 py-2 text-[10px]">
                  {u.line.map((l: any) => (
                    <div key={l.line_user_id}>
                      <span className="pill bg-pale-mint text-emerald text-[9px] mr-1">{l.channel}</span>
                      {l.display_name ?? l.line_user_id.slice(0, 12)}
                    </div>
                  ))}
                </td>
                <td className="px-3 py-2 text-muted-foreground text-[10px]">{new Date(u.created_at).toLocaleDateString("th-TH")}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {ROLES.map((r) => {
                      const has = u.roles.includes(r);
                      return (
                        <button
                          key={r}
                          onClick={() => toggle.mutate({ userId: u.id, role: r, grant: !has })}
                          className={`text-[10px] px-2 py-1 rounded-full transition ${has ? "bg-emerald text-ivory" : "bg-cream text-muted-foreground hover:bg-pale-mint"}`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
            {q.data?.length === 0 && !q.isLoading && (
              <tr><td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">ยังไม่มีผู้ใช้</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-[11px] text-muted-foreground card-cream rounded-2xl p-3">
        💡 <strong>วิธีตั้ง admin คนแรก:</strong> เข้าระบบด้วย LINE ผ่าน <code className="font-mono">/login</code> ครั้งแรกเพื่อสร้าง user แล้วให้คนที่มี service role (Lovable Cloud → SQL) รัน: <br />
        <code className="font-mono text-emerald">INSERT INTO user_roles (user_id, role) VALUES ('&lt;your-user-id&gt;', 'admin');</code>
      </div>
    </div>
  );
}
