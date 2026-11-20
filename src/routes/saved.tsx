import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FolderOpen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPart } from "@/data/parts";
import { money, useBuild } from "@/lib/build";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved PC Builds | PC Builder" },
      {
        name: "description",
        content: "Review saved custom PC configurations and reload them into the builder.",
      },
      { property: "og:title", content: "Saved PC Builds | PC Builder" },
      {
        property: "og:description",
        content: "Keep and revisit your custom desktop PC builds in the browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { t } = useI18n();
  const { saved, loadSelection, deleteBuild } = useBuild();

  return (
    <div className="app-grid mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="eyebrow">{t("cart.eyebrow")}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{t("saved.title")}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("saved.sub")}</p>
      </div>

      {saved.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {saved.map((build) => (
            <article
              key={build.id}
              className="rounded-xl border border-border/80 bg-card/80 p-5 transition-all hover:border-primary/50 hover:shadow-[0_24px_55px_-34px_var(--glow)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">{build.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("saved.created")}: {new Date(build.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-foreground">{money(build.total)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {t("saved.score")}:{" "}
                    <span className="font-bold text-foreground">{build.score}</span>
                  </div>
                </div>
              </div>

              <ul className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {Object.values(build.parts).map((id) => {
                  if (!id) return null;
                  const part = getPart(id);
                  return part ? (
                    <li key={id} className="truncate rounded-lg bg-secondary px-3 py-2">
                      {part.name}
                    </li>
                  ) : null;
                })}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild onClick={() => loadSelection(build.parts)}>
                  <Link to="/builder">
                    <FolderOpen />
                    {t("saved.view")}
                  </Link>
                </Button>
                <Button variant="destructive" onClick={() => deleteBuild(build.id)}>
                  <Trash2 />
                  {t("saved.delete")}
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="surface rounded-xl p-10 text-center">
          <FolderOpen className="mx-auto h-10 w-10 text-brand" />
          <h2 className="mt-4 text-2xl font-black">{t("saved.empty")}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{t("saved.hint")}</p>
          <Button asChild className="group mt-6">
            <Link to="/builder">
              {t("saved.goBuild")}{" "}
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
