import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Boxes,
  Eye,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Sparkles,
  Maximize2,
  Rotate3D,
  Move3D,
} from "lucide-react";
import { useState } from "react";

import { RealPcScene } from "@/components/site/RealPcScene";
import { ModelLibrary } from "@/components/site/ModelLibrary";
import type { RealPcSceneProps } from "@/components/site/RealPcScene";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CATEGORIES, getPart, type Category } from "@/data/parts";
import {
  money,
  overallLevel,
  performance,
  runChecks,
  selectedParts,
  totalPower,
  totalPrice,
  useBuild,
} from "@/lib/build";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ACCENTS: string[] = ["#22d3ee", "#a855f7", "#ef4444", "#22c55e", "#f59e0b", "#ffffff"];
const DEFAULT_ACCENT = "#22d3ee";

export const Route = createFileRoute("/view3d")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "3D Build Viewer | PC Builder" },
      {
        name: "description",
        content:
          "See your assembled PC in interactive 3D — rotate, zoom and inspect every selected component.",
      },
      { property: "og:title", content: "3D Build Viewer | PC Builder" },
      {
        property: "og:description",
        content: "Interactive 3D preview of your custom PC build with RGB lighting and live specs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: View3DPage,
});

function View3DPage() {
  const { t } = useI18n();
  const { selection } = useBuild();
  const [accent, setAccent] = useState<string>(DEFAULT_ACCENT);
  const [spin, setSpin] = useState(false);
  const [exploded, setExploded] = useState<number>(0);
  const [glassOpen, setGlassOpen] = useState(false);
  const [focusPart, setFocusPart] = useState<NonNullable<RealPcSceneProps["focusPart"]>>("all");
  const [customColor, setCustomColor] = useState("#111827");
  const [sceneMode, setSceneMode] = useState<"desk" | "pc">("desk");

  const chosen = selectedParts(selection);
  const perf = performance(selection);
  const level = overallLevel(runChecks(selection));

  if (!chosen.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <Boxes className="mx-auto mb-6 h-14 w-14 text-primary" />
        <h1 className="text-4xl font-black tracking-tight">{t("v3d.title")}</h1>
        <p className="mt-3 text-muted-foreground">{t("v3d.empty")}</p>
        <Button asChild className="mt-6">
          <Link to="/builder">{t("v3d.goBuilder")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="app-grid mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">{t("v3d.kicker")}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{t("v3d.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("v3d.sub")}</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/builder">
            <ArrowLeft />
            {t("v3d.goBuilder")}
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="surface overflow-hidden rounded-xl shadow-xl">
          <div className="grid grid-cols-3 border-b border-border bg-black/20 text-center">
            <div className="border-r border-border px-3 py-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {t("v3d.partsCount")}
              </div>
              <div className="mt-1 text-sm font-black">{chosen.length}</div>
            </div>
            <div className="border-r border-border px-3 py-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {t("v3d.power")}
              </div>
              <div className="mt-1 text-sm font-black">{totalPower(selection)}W</div>
            </div>
            <div className="px-3 py-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {t("v3d.mode")}
              </div>
              <div className="mt-1 text-sm font-black text-primary">{t("v3d.interactive")}</div>
            </div>
          </div>

          {/* Main 3D Canvas Viewport */}
          <div className="relative h-[31rem] w-full sm:h-[43rem] lg:h-[47rem]">
            <RealPcScene
              key={sceneMode}
              selection={selection}
              accent={accent}
              spin={spin}
              exploded={exploded}
              glassOpen={glassOpen}
              focusPart={focusPart}
              onSelectPart={(cat) => setFocusPart(cat)}
              customColor={customColor}
              mode={sceneMode}
            />

            {/* Floating inspection HUD */}
            <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
              <div className="rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/75 backdrop-blur-xl">
                3D VIEW · LIVE
              </div>
              <div className="rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[11px] font-medium text-white/60 backdrop-blur-xl">
                {t("v3d.inspectHint")}
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-2 rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/55 backdrop-blur-xl sm:flex">
              <Rotate3D className="h-3.5 w-3.5" /> Drag to rotate
              <Move3D className="ml-2 h-3.5 w-3.5" /> Pan
              <Maximize2 className="ml-2 h-3.5 w-3.5" /> Scroll to zoom
            </div>

            {/* Focus Reset Pill if a part is focused */}
            {focusPart !== "all" && (
              <div className="absolute right-4 top-4 z-10">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full shadow-lg backdrop-blur-md"
                  onClick={() => setFocusPart("all")}
                >
                  <Eye className="h-3.5 w-3.5" />
                  {t("v3d.focusAll")}
                </Button>
              </div>
            )}
          </div>

          {/* Interactive Controls Bar below the 3D Canvas */}
          <div className="space-y-4 border-t border-border bg-card/60 p-4 sm:p-5">
            {/* Top row: Exploded View Slider & Glass Panel Toggle */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 rounded-xl bg-secondary/50 p-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    {t("v3d.exploded")}
                  </span>
                  <span className="font-mono text-primary">{Math.round(exploded * 100)}%</span>
                </div>
                <Slider
                  value={[exploded * 100]}
                  max={100}
                  step={1}
                  onValueChange={(vals) => setExploded((vals[0] ?? 0) / 100)}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={glassOpen ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGlassOpen((g) => !g)}
                    className="gap-1.5"
                  >
                    {glassOpen ? (
                      <PanelLeftOpen className="h-4 w-4" />
                    ) : (
                      <PanelLeftClose className="h-4 w-4" />
                    )}
                    {glassOpen ? t("v3d.glassClose") : t("v3d.glassOpen")}
                  </Button>
                  <Button
                    variant={spin ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSpin((s) => !s)}
                    className="gap-1.5"
                  >
                    <RotateCcw className={cn("h-4 w-4", spin && "animate-spin")} />
                    {spin ? t("v3d.stop") : t("v3d.spin")}
                  </Button>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
                  {(["desk", "pc"] as const).map((m) => (
                    <Button
                      key={m}
                      size="sm"
                      variant={sceneMode === m ? "default" : "ghost"}
                      className="h-7 px-2.5 text-xs"
                      onClick={() => setSceneMode(m)}
                    >
                      {m === "desk" ? t("v3d.deskMode") : t("v3d.pcOnly")}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <label
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    htmlFor="pc-color"
                  >
                    {t("v3d.caseTint")}
                  </label>
                  <input
                    id="pc-color"
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-7 w-9 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
                    title={t("v3d.caseTintHint")}
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                  {ACCENTS.map((c) => (
                    <button
                      key={c}
                      aria-label={`RGB ${c}`}
                      onClick={() => setAccent(c)}
                      className={cn(
                        "h-6 w-6 rounded-full border-2 transition-transform hover:scale-110",
                        accent === c
                          ? "border-foreground ring-2 ring-primary/50"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Component Focus Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="mr-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("v3d.focus")}:
              </span>
              <Button
                variant={focusPart === "all" ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setFocusPart("all")}
              >
                {t("v3d.focusAll")}
              </Button>
              {CATEGORIES.filter((c) => Boolean(selection[c])).map((c) => (
                <Button
                  key={c}
                  variant={focusPart === c ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-7 text-xs",
                    focusPart === c && "border border-primary font-bold text-primary",
                  )}
                  onClick={() => setFocusPart(c)}
                >
                  {t(`cat.${c}`)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Build Summary & Clickable Installed Parts list */}
        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-xl font-black">{t("summary.title")}</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">{t("summary.total")}</span>
                <span className="font-black text-primary">{money(totalPrice(selection))}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">{t("summary.power")}</span>
                <span className="font-black">{totalPower(selection)}W</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">{t("summary.compat")}</span>
                <span
                  className={cn(
                    "font-black",
                    level === "ok"
                      ? "text-primary"
                      : level === "warn"
                        ? "text-chart-5"
                        : "text-destructive",
                  )}
                >
                  {t(`compat.${level}`)}
                </span>
              </div>
              {perf && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">{t("perf.score")}</span>
                  <span className="font-black text-primary">{perf.score}/100</span>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">{t("v3d.parts")}</h2>
              <span className="text-xs text-muted-foreground">
                {chosen.length} {t("saved.parts")}
              </span>
            </div>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((c) => {
                const id = selection[c];
                const part = id ? getPart(id) : undefined;
                const isFocused = focusPart === c;
                return (
                  <li
                    key={c}
                    onClick={() => part && setFocusPart(c)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 rounded-xl p-2.5 transition-colors",
                      isFocused
                        ? "bg-primary/15 ring-1 ring-primary/40"
                        : part
                          ? "hover:bg-secondary/70"
                          : "opacity-50",
                    )}
                  >
                    <span className="font-medium text-muted-foreground">{t(`cat.${c}`)}</span>
                    <span
                      className={cn(
                        "min-w-0 truncate text-right font-semibold",
                        isFocused && "text-primary",
                      )}
                    >
                      {part?.name ?? "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>
      <ModelLibrary />
    </div>
  );
}
