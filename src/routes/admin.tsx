import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchUsers, type Visitor } from "@/lib/api";
import { fmtMinutes, remoteVisitors } from "@/lib/visitors";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | PC Builder" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const fmt = (ms: number | null) =>
  ms === null
    ? "—"
    : new Date(ms).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "medium" });

function AdminPage() {
  const [key, setKey] = useState("");
  const [rows, setRows] = useState<Visitor[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      setRows(await fetchUsers(key));
    } catch (err) {
      setRows(null);
      setError(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-grid mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight">Ro'yxat</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        PC Builder va WHAT IF uchun umumiy ro'yxat (bitta mockapi manzili).
      </p>
      {!remoteVisitors && (
        <p className="mt-2 text-sm text-amber-500">
          Umumiy ro'yxat ulanmagan (VITE_VISITORS_API yo'q): faqat shu brauzerdagi yozuvlar
          ko'rsatilmoqda.
        </p>
      )}

      {!rows ? (
        <form onSubmit={load} className="mt-6 flex max-w-sm gap-2">
          <Input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin kalit"
            autoFocus
          />
          <Button type="submit" disabled={loading || !key}>
            {loading ? "..." : "Kirish"}
          </Button>
        </form>
      ) : (
        <>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Jami: <b className="text-foreground">{rows.length}</b>
            </p>
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
                  <th className="px-4 py-3">Kirgan</th>
                  <th className="px-4 py-3 text-right">Saytda</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((v, i) => (
                  <tr key={`${v.id}-${i}`} className="border-t border-border/60">
                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold">{v.name}</td>
                    <td className="px-4 py-3">{fmt(v.at)}</td>
                    <td className="px-4 py-3 text-right">{fmtMinutes(v.minutes)}</td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      Hozircha hech kim yo'q
                    </td>
                  </tr>
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
