import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Boxes,
  CheckCircle2,
  Cpu,
  Gauge,
  Save,
  ShoppingCart,
  Trash2,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Filters, applyFilters, type FilterState } from "@/components/site/Filters";
import { PartCard } from "@/components/site/PartCard";
import { RealPcScene } from "@/components/site/RealPcScene";
import { SetupsSection } from "@/components/site/SetupsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES, getPart, partsByCategory, type Category } from "@/data/parts";
import {
  money,
  overallLevel,
  pcPrice,
  performance,
  runChecks,
  selectedParts,
  setupPrice,
  totalPower,
  totalPrice,
  useBuild,
} from "@/lib/build";
import { useCart } from "@/lib/cart";
import { CATEGORY_ICONS } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "PC Builder | Custom PC Configurator" },
      {
        name: "description",
        content:
          "Select PC components and instantly calculate price, power draw, and compatibility.",
      },
      { property: "og:title", content: "PC Builder | Custom PC Configurator" },
      {
        property: "og:description",
        content:
          "Build a custom desktop PC with live compatibility checks and performance estimates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuilderPage,
});

function BuilderPage() {
  const { t } = useI18n();
  const { selection, setPart, removePart, clear, saveBuild } = useBuild();
  const { addMany } = useCart();
  const navigate = useNavigate();
  const [active, setActive] = useState<Category>("cpu");
  const [buildName, setBuildName] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    q: "",
    brand: "all",
    maxPrice: 2200,
    sort: "perf",
  });

  const categoryParts = partsByCategory(active);
  const brands = useMemo(
    () => Array.from(new Set(categoryParts.map((p) => p.brand))).sort(),
    [categoryParts],
  );
  const parts = applyFilters(categoryParts, filters);
  const chosen = selectedParts(selection);
  const checks = runChecks(selection);
  const level = overallLevel(checks);
  const perf = performance(selection);

  const save = () => {
    const saved = saveBuild(buildName);
    if (saved) setBuildName("");
  };

  return (
    <div className="app-grid mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">{t("nav.builder")}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {t("builder.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("builder.sub")}</p>
        </div>
        <Button variant="outline" className="border-border/80 bg-card/50" onClick={clear}>
          <Trash2 />
          {t("summary.clear")}
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)_21rem]">
        <aside className="space-y-2 lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="eyebrow">{t("builder.components")}</span>
            <span className="text-[10px] font-bold text-muted-foreground">
              {CATEGORIES.length} {t("builder.slots")}
            </span>
          </div>
          {CATEGORIES.map((category) => {
            const selectedId = selection[category];
            const part = selectedId ? getPart(selectedId) : undefined;
            return (
              <Button
                key={category}
                variant={active === category ? "secondary" : "ghost"}
                className="h-auto w-full justify-start rounded-lg border border-transparent px-3 py-3 text-left hover:border-border/80 hover:bg-card/70"
                onClick={() => setActive(category)}
              >
                {(() => {
                  const Icon = CATEGORY_ICONS[category];
                  return (
                    <Icon
                      className={cn(active === category ? "text-brand" : "text-muted-foreground")}
                    />
                  );
                })()}
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-bold">{t(`cat.${category}`)}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {part?.name ?? t("builder.empty")}
                  </span>
                </span>
              </Button>
            );
          })}
        </aside>

        <section className="min-w-0 space-y-4">
          <SetupsSection />
          <div className="surface rounded-xl p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">{t("builder.pick")}</p>
                <h2 className="text-2xl font-black">{t(`cat.${active}`)}</h2>
              </div>
              {selection[active] && (
                <Button variant="ghost" size="sm" onClick={() => removePart(active)}>
                  {t("builder.remove")}
                </Button>
              )}
            </div>
            <Filters state={filters} onChange={setFilters} brands={brands} priceCap={2200} />
          </div>

          {parts.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {parts.map((part) => (
                <PartCard
                  key={part.id}
                  part={part}
                  selected={selection[active] === part.id}
                  onAdd={() => setPart(active, part.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
              {t("builder.noResults")}
            </div>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="surface rounded-xl p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">{t("summary.live")}</p>
                <h2 className="mt-1 text-xl font-black">{t("summary.title")}</h2>
              </div>
              <Activity className="h-5 w-5 text-brand" />
            </div>
            <div className="mt-5 space-y-3">
              {setupPrice(selection) > 0 && (
                <>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{t("summary.pc")}</span>
                    <span className="font-bold">{money(pcPrice(selection))}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{t("summary.setup")}</span>
                    <span className="font-bold">{money(setupPrice(selection))}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{t("summary.total")}</span>
                <span className="font-black text-foreground">{money(totalPrice(selection))}</span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{t("summary.power")}</span>
                <span className="font-black">{totalPower(selection)}W</span>
              </div>
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{t("summary.compat")}</span>
                <span
                  className={cn(
                    "font-black",
                    level === "ok"
                      ? "text-brand"
                      : level === "warn"
                        ? "text-chart-5"
                        : "text-destructive",
                  )}
                >
                  {t(`compat.${level}`)}
                </span>
              </div>
            </div>

            {perf && (
              <div className="my-5 flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div className="metric-ring grid h-20 w-20 shrink-0 place-items-center rounded-full p-1 shadow-[0_0_30px_-12px_var(--glow)]">
                  <div className="grid h-full w-full place-items-center rounded-full bg-card text-center">
                    <span className="text-xl font-black text-brand">
                      {perf.score}
                      <small className="text-[10px] text-muted-foreground">/100</small>
                    </span>
                  </div>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    <Gauge className="h-3.5 w-3.5 text-brand" /> {t("perf.label")}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{t("perf.note")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {perf.fps1440} {t("perf.fpsAt")}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 space-y-2">
              <Input
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder={t("summary.name")}
              />
              <Button className="w-full" onClick={save} disabled={!chosen.length}>
                <Save />
                {t("summary.save")}
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                disabled={!chosen.length}
                onClick={() => {
                  addMany(chosen.map((p) => p.id));
                  void navigate({ to: "/cart" });
                }}
              >
                <ShoppingCart />
                {t("cart.addBuild")}
              </Button>
              <Button asChild variant="secondary" className="w-full" disabled={!chosen.length}>
                <Link to="/view3d">
                  <Boxes />
                  {t("v3d.open")}
                </Link>
              </Button>
            </div>
          </section>

          {/* Live 3D Assembly Preview Box */}
          {chosen.length > 0 && (
            <section className="overflow-hidden rounded-xl border border-border/80 bg-card">
              <div className="flex items-center justify-between border-b border-border bg-card/60 p-3.5">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
                  <Boxes className="h-4 w-4" />
                  {t("v3d.livePreview")}
                </span>
                <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                  <Link to="/view3d">{t("v3d.open")}</Link>
                </Button>
              </div>
              <div className="h-72 w-full">
                <RealPcScene
                  selection={selection}
                  accent="#22d3ee"
                  spin={true}
                  mode="pc"
                  lite
                  onSelectPart={(cat) => setActive(cat)}
                />
              </div>
            </section>
          )}

          <section className="rounded-xl border border-border/80 bg-card/80 p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-xl font-black">{t("summary.compat")}</h2>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {t("summary.autoCheck")}
              </span>
            </div>
            <div className="space-y-3">
              {checks.length ? (
                checks.map((check) => {
                  const Icon =
                    check.level === "ok"
                      ? CheckCircle2
                      : check.level === "warn"
                        ? TriangleAlert
                        : XCircle;
                  return (
                    <div key={check.id} className="flex gap-3 rounded-xl bg-secondary p-3 text-sm">
                      <Icon
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          check.level === "bad" ? "text-destructive" : "text-brand",
                        )}
                      />
                      <span className="text-muted-foreground">{t(check.messageKey)}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">{t("summary.empty")}</p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-border/80 bg-card/80 p-5">
            <h2 className="mb-4 text-xl font-black">{t("perf.title")}</h2>
            {perf ? (
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm font-semibold">
                    <span>{t("perf.score")}</span>
                    <span className="text-brand">{perf.score}/100</span>
                  </div>
                  <Progress value={perf.score} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-xl bg-secondary p-2">
                    <b>{perf.fps1080}</b>
                    <br />
                    1080p
                  </div>
                  <div className="rounded-xl bg-secondary p-2">
                    <b>{perf.fps1440}</b>
                    <br />
                    1440p
                  </div>
                  <div className="rounded-xl bg-secondary p-2">
                    <b>{perf.fps4k}</b>
                    <br />
                    4K
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("perf.need")}</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
