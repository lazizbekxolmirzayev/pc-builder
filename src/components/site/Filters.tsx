import { Search } from "lucide-react";
import { BRANDS, CATEGORIES, type Category } from "@/data/parts";
import { money } from "@/lib/build";
import { useI18n } from "@/lib/i18n";

export type SortKey = "priceAsc" | "priceDesc" | "perf" | "name";

export type FilterState = {
  q: string;
  brand: string;
  maxPrice: number;
  sort: SortKey;
  category?: Category | "all";
};

const field =
  "h-10 w-full rounded-lg border border-border/80 bg-background/70 px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15";

export function Filters({
  state,
  onChange,
  brands = BRANDS,
  withCategory = false,
  priceCap = 2000,
}: {
  state: FilterState;
  onChange: (s: FilterState) => void;
  brands?: string[];
  withCategory?: boolean;
  priceCap?: number;
}) {
  const { t } = useI18n();
  const set = (patch: Partial<FilterState>) => onChange({ ...state, ...patch });

  return (
    <div className="grid gap-3 rounded-xl border border-border/80 bg-card/70 p-4 shadow-[0_18px_50px_-40px_var(--glow)] sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative sm:col-span-2 lg:col-span-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={state.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder={t("filters.search")}
          className={`${field} pl-9`}
        />
      </div>

      {withCategory && (
        <select
          value={state.category ?? "all"}
          onChange={(e) => set({ category: e.target.value as Category | "all" })}
          className={field}
        >
          <option value="all">{t("filters.allCategories")}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t(`cat.${c}`)}
            </option>
          ))}
        </select>
      )}

      <select
        value={state.brand}
        onChange={(e) => set({ brand: e.target.value })}
        className={field}
      >
        <option value="all">{t("filters.allBrands")}</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <select
        value={state.sort}
        onChange={(e) => set({ sort: e.target.value as SortKey })}
        className={field}
      >
        <option value="priceAsc">{t("sort.priceAsc")}</option>
        <option value="priceDesc">{t("sort.priceDesc")}</option>
        <option value="perf">{t("sort.perf")}</option>
        <option value="name">{t("sort.name")}</option>
      </select>

      <div className="flex flex-col justify-center gap-1">
        <label className="flex justify-between text-xs text-muted-foreground">
          <span>{t("filters.maxPrice")}</span>
          <span className="font-bold text-foreground">{money(state.maxPrice)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={priceCap}
          step={10}
          value={state.maxPrice}
          onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          className="accent-[var(--primary)]"
        />
      </div>
    </div>
  );
}

export function applyFilters<
  T extends { name: string; brand: string; price: number; perf: number; category: Category },
>(items: T[], s: FilterState): T[] {
  const q = s.q.trim().toLowerCase();
  const out = items.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)) &&
      (s.brand === "all" || p.brand === s.brand) &&
      p.price <= s.maxPrice &&
      (!s.category || s.category === "all" || p.category === s.category),
  );
  const sorters: Record<SortKey, (a: T, b: T) => number> = {
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    perf: (a, b) => b.perf - a.perf,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  return [...out].sort(sorters[s.sort]);
}
