import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Boxes } from "lucide-react";
import { useState } from "react";

import { Filters, applyFilters, type FilterState } from "@/components/site/Filters";
import { PartCard } from "@/components/site/PartCard";
import { SetupsSection } from "@/components/site/SetupsSection";
import { ALL_PARTS, BRANDS } from "@/data/parts";
import { useBuild } from "@/lib/build";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/components/")({
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
  const [filters, setFilters] = useState<FilterState>({
    q: "",
    brand: "all",
    maxPrice: 2200,
    sort: "perf",
    category: "all",
  });
  const parts = applyFilters(ALL_PARTS, filters);

  return (
    <div className="app-grid mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">{t("catalog.eyebrow")}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {t("components.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("components.sub")}</p>
        </div>
        <Link
          to="/builder"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-foreground"
        >
          <Boxes className="h-4 w-4" /> {t("catalog.buildWith")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Filters state={filters} onChange={setFilters} brands={BRANDS} withCategory priceCap={2200} />

      <div className="mt-6">
        <SetupsSection />
      </div>

      <div className="mt-5 text-sm font-semibold text-muted-foreground">
        {parts.length} {t("components.found")}
      </div>

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
    </div>
  );
}
