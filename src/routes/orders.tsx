import { Link, createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { money } from "@/lib/build";
import { useI18n } from "@/lib/i18n";
import { listOrders, type Order } from "@/lib/orders";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My orders | PC Builder" },
      { name: "description", content: "Orders placed from this browser." },
      { property: "og:title", content: "My orders | PC Builder" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => setOrders(listOrders()), []);

  return (
    <div className="app-grid mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="eyebrow">{t("cart.eyebrow")}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{t("orders.title")}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("orders.sub")}</p>
      </div>

      {orders.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {orders.map((o) => (
            <article key={o.id} className="rounded-xl border border-border/80 bg-card/80 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">{o.id}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-foreground">{money(o.total)}</div>
                  <span className="mt-1 inline-block rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
                    {t(`orders.status.${o.status}`)}
                  </span>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm">
                {o.lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-3">
                    <span className="min-w-0 truncate text-muted-foreground">
                      {l.qty} × {l.name}
                    </span>
                    <span className="shrink-0 font-medium">{money(l.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                {t(`checkout.${o.delivery}`)} · {t(`checkout.pay.${o.payment}`)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <Package className="mx-auto h-10 w-10 text-brand" />
          <h2 className="mt-4 text-2xl font-black">{t("orders.empty")}</h2>
          <Button asChild className="mt-6">
            <Link to="/components">{t("cart.browse")}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
