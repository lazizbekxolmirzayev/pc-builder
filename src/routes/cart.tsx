import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MAX_QTY, useCart } from "@/lib/cart";
import { money } from "@/lib/build";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart | PC Builder" },
      { name: "description", content: "Review the parts in your cart and proceed to checkout." },
      { property: "og:title", content: "Cart | PC Builder" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { t } = useI18n();
  const { lines, count, total, setQty, remove, clear } = useCart();

  return (
    <div className="app-grid mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="eyebrow">{t("cart.eyebrow")}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{t("cart.title")}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("cart.sub")}</p>
      </div>

      {lines.length ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="space-y-3">
            {lines.map(({ part, qty }) => (
              <article
                key={part.id}
                className="flex gap-4 rounded-xl border border-border/80 bg-card/80 p-4 transition-colors hover:border-primary/40"
              >
                <Link
                  to="/components/$id"
                  params={{ id: part.id }}
                  className="h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-media"
                >
                  <img src={part.image} alt={part.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand/80">
                        {part.brand} · {t(`cat.${part.category}`)}
                      </p>
                      <h2 className="mt-1 line-clamp-2 font-bold leading-snug">{part.name}</h2>
                    </div>
                    <button
                      onClick={() => remove(part.id)}
                      aria-label={`${t("cart.remove")}: ${part.name}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div
                      className="flex items-center rounded-lg border border-border"
                      role="group"
                      aria-label={t("cart.qty")}
                    >
                      <button
                        onClick={() => setQty(part.id, qty - 1)}
                        aria-label="-"
                        className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-brand"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold tabular-nums">{qty}</span>
                      <button
                        onClick={() => setQty(part.id, qty + 1)}
                        disabled={qty >= MAX_QTY}
                        aria-label="+"
                        className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-brand disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      {qty > 1 && (
                        <div className="text-xs text-muted-foreground">
                          {money(part.price)} × {qty}
                        </div>
                      )}
                      <div className="text-lg font-black text-foreground">
                        {money(part.price * qty)}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
            <div className="flex items-center justify-between pt-1">
              <Button asChild variant="ghost" size="sm">
                <Link to="/components">{t("cart.continue")}</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={clear}>
                <Trash2 />
                {t("cart.clear")}
              </Button>
            </div>
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <section className="surface rounded-xl p-5">
              <h2 className="text-xl font-black">{t("checkout.summary")}</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{t("cart.items")}</span>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="flex justify-between gap-3 border-t border-border/60 pt-3">
                  <span className="text-muted-foreground">{t("cart.total")}</span>
                  <span className="text-xl font-black text-foreground">{money(total)}</span>
                </div>
              </div>
              <Button asChild className="mt-5 w-full" size="lg">
                <Link to="/checkout">
                  {t("cart.checkout")}
                  <ArrowRight />
                </Link>
              </Button>
            </section>
          </aside>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-brand" />
          <h2 className="mt-4 text-2xl font-black">{t("cart.empty")}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {t("cart.emptyHint")}
          </p>
          <Button asChild className="mt-6">
            <Link to="/components">
              {t("cart.browse")} <ArrowRight />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
