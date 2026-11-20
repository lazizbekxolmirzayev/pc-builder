import { Link } from "@tanstack/react-router";
import { Check, Plus, Gauge, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Part } from "@/data/parts";
import { money } from "@/lib/build";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function PartCard({
  part,
  selected,
  onAdd,
  showDetails = true,
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
        "group flex flex-col overflow-hidden rounded-xl border bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_22px_55px_-25px_var(--glow)]",
        selected ? "border-primary/70 ring-1 ring-primary/40" : "border-border/80",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#080f1b]">
        <img
          src={part.image}
          alt={part.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-md border border-primary/20 bg-background/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary backdrop-blur">
          {t(`cat.${part.category}`)}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] font-bold backdrop-blur">
          <Gauge className="h-3 w-3 text-primary" />
          {part.perf}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#08101d] to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
            {part.brand}
          </p>
          <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug">{part.name}</h3>
        </div>

        <ul className="space-y-1 text-xs text-muted-foreground">
          {specs.map(([k, v]) => (
            <li key={k} className="flex justify-between gap-2">
              <span className="truncate">{k}</span>
              <span className="shrink-0 font-medium text-foreground/80">{v}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border/60 pt-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {t("details.price")}
            </p>
            <span className="text-lg font-black text-primary">{money(part.price)}</span>
          </div>
          <div className="flex gap-1.5">
            {showDetails && (
              <Link
                to="/components/$id"
                params={{ id: part.id }}
                className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                {t("components.details")}
              </Link>
            )}
            <button
              onClick={() => {
                add(part.id);
                setInCart(true);
                window.setTimeout(() => setInCart(false), 1500);
              }}
              aria-label={`${t("cart.add")}: ${part.name}`}
              title={t("cart.add")}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-lg border transition-colors active:scale-95",
                inCart
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary",
              )}
            >
              {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            </button>
            {onAdd && (
              <button
                onClick={onAdd}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95",
                  selected
                    ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                    : "bg-primary text-primary-foreground hover:brightness-110",
                )}
              >
                {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {selected ? t("builder.selected") : t("builder.add")}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
