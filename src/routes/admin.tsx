import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchUsers, type AdminUser } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | PC Builder" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const fmt = (iso: string) => new Date(iso).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "medium" });

function AdminPage() {
  const [key, setKey] = useState("");
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      setUsers(await fetchUsers(key));
    } catch (err) {
      setUsers(null);
      setError(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-grid mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight">Ro'yxatdan o'tganlar</h1>

      {!users ? (
        <form onSubmit={load} className="mt-6 flex max-w-sm gap-2">
          <Input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Admin kalit" autoFocus />
          <Button type="submit" disabled={loading || !key}>{loading ? "..." : "Kirish"}</Button>
        </form>
      ) : (
        <>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Jami: <b className="text-foreground">{users.length}</b></p>
            <Button variant="outline" size="sm" onClick={() => load()} disabled={loading}>
              <RefreshCw /> Yangilash
            </Button>
          </div>
          <div className="mt-3 overflow-x-auto rounded-xl border border-border/80 bg-card/80">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Ism Familya</th>
                  <th className="px-4 py-3">Ro'yxatdan o'tgan</th>
                  <th className="px-4 py-3">Oxirgi kirish</th>
                  <th className="px-4 py-3 text-right">Kirishlar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className="border-t border-border/60">
                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold">{u.firstName} {u.lastName}</td>
                    <td className="px-4 py-3">{fmt(u.registeredAt)}</td>
                    <td className="px-4 py-3">{fmt(u.lastLoginAt)}</td>
                    <td className="px-4 py-3 text-right">{u.visits}</td>
                  </tr>
                ))}
                {!users.length && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Hozircha hech kim yo'q</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </div>
  );
}
