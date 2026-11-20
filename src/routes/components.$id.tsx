import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bolt,
  Boxes,
  Check,
  Gauge,
  Image as ImageIcon,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

import { ComponentScene } from "@/components/site/ComponentScene";
import { PartCard } from "@/components/site/PartCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getPart, partsByCategory } from "@/data/parts";
import { money, useBuild } from "@/lib/build";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/components/$id")({
  head: ({ params }) => {
    const part = getPart(params.id);
    const title = part ? `${part.name} Specs | PC Builder` : "Component Not Found | PC Builder";
    const description = part
      ? `${part.brand} ${part.name}: price, power draw, performance score, and detailed specifications.`
      : "The requested PC component could not be found in the catalog.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ComponentDetailPage,
});

function ComponentDetailPage() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const { selection, setPart } = useBuild();
  const [viewMode, setViewMode] = useState<"3d" | "photo">("3d");
  const part = getPart(id);

  if (!part) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-4xl font-black">{t("details.notFound")}</h1>
        <Button asChild className="mt-6">
          <Link to="/components">{t("details.back")}</Link>
        </Button>
      </div>
    );
  }

  const similar = partsByCategory(part.category)
    .filter((item) => item.id !== part.id)
    .slice(0, 4);
  const selected = selection[part.category] === part.id;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/components">
          <ArrowLeft />
          {t("details.back")}
        </Link>
      </Button>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border bg-secondary/40 p-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {viewMode === "3d" ? t("details.rotateHint") : t(`cat.${part.category}`)}
            </span>
            <div className="flex items-center gap-1.5 rounded-lg bg-background/80 p-1 border border-border">
              <Button
                variant={viewMode === "3d" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => setViewMode("3d")}
              >
                <Boxes className="h-3.5 w-3.5" />
                {t("details.view3d")}
              </Button>
              <Button
                variant={viewMode === "photo" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => setViewMode("photo")}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                {t("details.viewPhoto")}
              </Button>
            </div>
          </div>

          {viewMode === "3d" ? (
            <div className="h-[24rem] w-full sm:h-[30rem]">
              <ComponentScene part={part} accent="#22d3ee" spin={true} />
            </div>
          ) : (
            <img src={part.image} alt={part.name} className="aspect-[4/3] w-full object-cover" />
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {t(`cat.${part.category}`)} · {part.brand}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{part.name}</h1>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingCart className="h-4 w-4 text-primary" />
                {t("details.price")}
              </div>
              <div className="text-2xl font-black text-primary">{money(part.price)}</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Bolt className="h-4 w-4 text-primary" />
                {t("details.power")}
              </div>
              <div className="text-2xl font-black">{part.watts}W</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Gauge className="h-4 w-4 text-primary" />
                {t("details.perf")}
              </div>
              <div className="text-2xl font-black">{part.perf}/100</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between text-sm font-semibold">
              <span>{t("details.perf")}</span>
              <span className="text-primary">{part.perf}/100</span>
            </div>
            <Progress value={part.perf} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 text-xl font-black">{t("details.specs")}</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              {Object.entries(part.specs).map(([label, value]) => (
                <div key={label} className="rounded-xl bg-secondary p-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Button size="lg" className="w-full" onClick={() => setPart(part.category, part.id)}>
            {selected ? <Check /> : <ShoppingCart />}
            {selected ? t("details.inBuild") : t("details.addToBuild")}
          </Button>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-5 text-3xl font-black tracking-tight">{t("details.similar")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((item) => (
            <PartCard
              key={item.id}
              part={item}
              selected={selection[item.category] === item.id}
              onAdd={() => setPart(item.category, item.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
