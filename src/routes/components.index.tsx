import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Boxes } from "lucide-react";
import { useEffect, useState } from "react";

import { Filters, applyFilters, type FilterState } from "@/components/site/Filters";
import { PartCard } from "@/components/site/PartCard";
import { SetupsSection } from "@/components/site/SetupsSection";
import { ALL_PARTS, BRANDS, CATEGORIES, type Category } from "@/data/parts";
import { CATEGORY_ICONS } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { useBuild } from "@/lib/build";
import { useI18n } from "@/lib/i18n";

type Search = { q?: string | undefined; cat?: Category | undefined };

export const Route = createFileRoute("/components/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s["q"] === "string" && s["q"].trim() ? s["q"].slice(0, 80) : undefined,
    cat:
      typeof s["cat"] === "string" && (CATEGORIES as string[]).includes(s["cat"])
        ? (s["cat"] as Category)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "PC Components Catalog | PC Builder" },
      {
        name: "description",
        content:
          "Browse CPUs, GPUs, motherboards, memory, storage, cases, monitors, and gaming peripherals.",
      },
      { property: "og:title", content: "PC Components Catalog | PC Builder" },
      {
        property: "og:description",
        content: "Search, filter, and compare PC components for your next custom build.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComponentsPage,
});

function ComponentsPage() {
  const { t } = useI18n();
  const { selection, setPart } = useBuild();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    q: search.q ?? "",
    brand: "all",
    maxPrice: 2200,
    sort: "perf",
    category: search.cat ?? "all",
  });
  // header search and the catalog menu change the URL; keep the filters in step with it
  useEffect(() => {
    setFilters((f) => ({ ...f, q: search.q ?? "", category: search.cat ?? "all" }));
  }, [search.q, search.cat]);
  const changeFilters = (next: FilterState) => {
    setFilters(next);
    void navigate({
      search: {
        q: next.q.trim() || undefined,
        cat: next.category && next.category !== "all" ? next.category : undefined,
      },
      replace: true,
    });
  };
  const parts = applyFilters(ALL_PARTS, filters);

  return (
    <div className="app-grid mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">{t("nav.catalog")}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {t("components.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("components.sub")}</p>
        </div>
        <Link
          to="/builder"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-foreground"
        >
          <Boxes className="h-4 w-4" /> Build with these parts <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {(["all", ...CATEGORIES] as const).map((c) => {
          const Icon = c === "all" ? null : CATEGORY_ICONS[c];
          const active = (filters.category ?? "all") === c;
          return (
            <button
              key={c}
              onClick={() => changeFilters({ ...filters, category: c })}
              aria-pressed={active}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground",
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {c === "all" ? t("catalog.all") : t(`cat.${c}`)}
            </button>
          );
        })}
      </div>

      <Filters
        state={filters}
        onChange={changeFilters}
        brands={BRANDS}
        withCategory
        priceCap={2200}
      />

      <div className="mt-5 text-sm font-semibold text-muted-foreground">
        {parts.length} {t("components.found")}
      </div>

      {parts.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
          {t("catalog.empty")}
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {parts.map((part) => (
          <PartCard
            key={part.id}
            part={part}
            selected={selection[part.category] === part.id}
            onAdd={() => setPart(part.category, part.id)}
          />
        ))}
      </div>

      {!filters.q.trim() && (filters.category ?? "all") === "all" && (
        <div className="mt-10">
          <SetupsSection />
        </div>
      )}
    </div>
  );
}
