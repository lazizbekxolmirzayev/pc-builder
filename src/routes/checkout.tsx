import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { money } from "@/lib/build";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { createOrder, validateOrder, type Order, type OrderInput } from "@/lib/orders";
import { DELIVERY_METHODS, PAYMENT_METHODS } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | PC Builder" },
      { name: "description", content: "Enter your contact details and place your order." },
      { property: "og:title", content: "Checkout | PC Builder" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CheckoutPage,
});

const EMPTY: OrderInput = {
  name: "",
  phone: "",
  address: "",
  comment: "",
  delivery: "pickup",
  payment: "cash",
};

function CheckoutPage() {
  const { t } = useI18n();
  const { items, lines, count, total, clear } = useCart();
  const [form, setForm] = useState<OrderInput>(EMPTY);
  const [errors, setErrors] = useState<string[]>([]);
  const [placed, setPlaced] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof OrderInput>(key: K, value: OrderInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => e.filter((x) => x !== key));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const bad = validateOrder(form);
    setErrors(bad);
    if (bad.length || !lines.length) return;
    setBusy(true);
    try {
      const order = await createOrder(form, items);
      clear();
      setPlaced(order);
    } catch {
      setErrors(["submit"]);
    } finally {
      setBusy(false);
    }
  }

  if (placed) {
    return (
      <div className="app-grid mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="surface rounded-2xl p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-black">{t("checkout.successTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{t("checkout.successText")}</p>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {t("checkout.orderNo")}
          </p>
          <p className="text-2xl font-black text-primary">{placed.id}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/orders">{t("orders.title")}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/components">{t("cart.continue")}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="app-grid mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-black">{t("cart.empty")}</h1>
        <p className="mt-2 text-muted-foreground">{t("cart.emptyHint")}</p>
        <Button asChild className="mt-6">
          <Link to="/components">{t("cart.browse")}</Link>
        </Button>
      </div>
    );
  }

  const err = (k: string) => errors.includes(k);
  const label = "mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground";
  const choice = (active: boolean) =>
    cn(
      "rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors",
      active
        ? "border-primary bg-primary/10 text-primary"
        : "border-border text-muted-foreground hover:border-primary/50",
    );

  return (
    <div className="app-grid mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="eyebrow">{t("cart.eyebrow")}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
          {t("checkout.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("checkout.sub")}</p>
      </div>

      <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="space-y-5 rounded-xl border border-border/80 bg-card/80 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="co-name">
                {t("checkout.name")}
              </label>
              <Input
                id="co-name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={err("name")}
                className={cn(err("name") && "border-destructive")}
              />
              {err("name") && (
                <p className="mt-1 text-xs text-destructive">{t("checkout.errName")}</p>
              )}
            </div>
            <div>
              <label className={label} htmlFor="co-phone">
                {t("checkout.phone")}
              </label>
              <Input
                id="co-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+998 90 123 45 67"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                aria-invalid={err("phone")}
                className={cn(err("phone") && "border-destructive")}
              />
              {err("phone") && (
                <p className="mt-1 text-xs text-destructive">{t("checkout.errPhone")}</p>
              )}
            </div>
          </div>

          <div>
            <p className={label}>{t("checkout.delivery")}</p>
            <div className="flex flex-wrap gap-2">
              {DELIVERY_METHODS.map((m) => (
                <button
                  type="button"
                  key={m}
                  aria-pressed={form.delivery === m}
                  onClick={() => set("delivery", m)}
                  className={choice(form.delivery === m)}
                >
                  {t(`checkout.${m}`)}
                </button>
              ))}
            </div>
          </div>

          {form.delivery === "courier" && (
            <div>
              <label className={label} htmlFor="co-address">
                {t("checkout.address")}
              </label>
              <Input
                id="co-address"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                aria-invalid={err("address")}
                className={cn(err("address") && "border-destructive")}
              />
              {err("address") && (
                <p className="mt-1 text-xs text-destructive">{t("checkout.errAddress")}</p>
              )}
            </div>
          )}

          <div>
            <p className={label}>{t("checkout.payment")}</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  type="button"
                  key={m}
                  aria-pressed={form.payment === m}
                  onClick={() => set("payment", m)}
                  className={choice(form.payment === m)}
                >
                  {t(`checkout.pay.${m}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={label} htmlFor="co-comment">
              {t("checkout.comment")}
            </label>
            <Textarea
              id="co-comment"
              rows={3}
              maxLength={500}
              value={form.comment}
              onChange={(e) => set("comment", e.target.value)}
            />
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <section className="surface rounded-xl p-5">
            <h2 className="text-xl font-black">{t("checkout.summary")}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {lines.map(({ part, qty }) => (
                <li key={part.id} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate text-muted-foreground">
                    {qty} × {part.name}
                  </span>
                  <span className="shrink-0 font-semibold">{money(part.price * qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between gap-3 border-t border-border/60 pt-4">
              <span className="text-muted-foreground">
                {t("cart.total")} ({count})
              </span>
              <span className="text-xl font-black text-primary">{money(total)}</span>
            </div>
            {err("submit") && (
              <p className="mt-3 text-xs text-destructive">{t("checkout.errSubmit")}</p>
            )}
            <Button type="submit" size="lg" className="mt-5 w-full" disabled={busy}>
              {t("checkout.place")}
            </Button>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">{t("checkout.notice")}</p>
          </section>
        </aside>
      </form>
    </div>
  );
}
