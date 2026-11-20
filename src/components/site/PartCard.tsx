import { Link } from "@tanstack/react-router";
import { Check, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Part } from "@/data/parts";
import { money } from "@/lib/build";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { INSTALLMENT_MONTHS } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function PartCard({
  part,
  selected,
  onAdd,
}: {
  part: Part;
  selected?: boolean;
  onAdd?: () => void;
  showDetails?: boolean;
}) {
  const { t } = useI18n();
  const { add } = useCart();
  const [inCart, setInCart] = useState(false);
  const specs = Object.entries(part.specs).slice(0, 3);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
        selected
          ? "border-primary ring-2 ring-primary/40"
          : "border-border hover:border-primary/70",
      )}
    >
      <Link
        to="/components/$id"
        params={{ id: part.id }}
        className="relative block aspect-[4/3] overflow-hidden bg-media"
        aria-label={part.name}
      >
        <img
          src={part.image}
          alt={part.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-primary-foreground">
          {t(`cat.${part.category}`)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {part.brand}
          </p>
          <Link
            to="/components/$id"
            params={{ id: part.id }}
            className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug hover:text-brand"
          >
            {part.name}
          </Link>
        </div>

        <ul className="space-y-1 text-xs text-muted-foreground">
          {specs.map(([k, v]) => (
            <li key={k} className="flex justify-between gap-2">
              <span className="truncate">{k}</span>
              <span className="shrink-0 font-medium text-foreground/80">{v}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-2.5 border-t border-border pt-3">
          <div>
            <div className="text-xl font-black tracking-tight">{money(part.price)}</div>
            {INSTALLMENT_MONTHS > 0 && (
              <div className="mt-1 inline-block rounded-md bg-primary/20 px-2 py-0.5 text-[11px] font-bold text-foreground">
                {money(part.price / INSTALLMENT_MONTHS)} × {INSTALLMENT_MONTHS}{" "}
                {t("card.monthShort")}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                add(part.id);
                setInCart(true);
                window.setTimeout(() => setInCart(false), 1500);
              }}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-extrabold text-primary-foreground transition-all hover:brightness-95 active:scale-[0.98]"
            >
              {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              {inCart ? t("cart.added") : t("cart.add")}
            </button>
            {onAdd && (
              <button
                onClick={onAdd}
                title={selected ? t("builder.selected") : t("details.addToBuild")}
                aria-label={selected ? t("builder.selected") : t("details.addToBuild")}
                aria-pressed={selected}
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors active:scale-95",
                  selected
                    ? "border-primary bg-primary/20 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
                )}
              >
                {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
