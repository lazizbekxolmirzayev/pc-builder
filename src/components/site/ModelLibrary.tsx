import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { ModelStage } from "@/components/site/ComponentScene";
import type { Category } from "@/data/parts";
import { MODELS, type ModelKey } from "@/data/models3d";
import { cn } from "@/lib/utils";

// Which display pose each library entry uses.
const ENTRIES: { key: ModelKey; category: Category; group: string }[] = [
  { key: "gpuRtx", category: "gpu", group: "Graphics cards" },
  { key: "gpuRadeon", category: "gpu", group: "Graphics cards" },
  { key: "cpuRyzen9", category: "cpu", group: "Processors" },
  { key: "cpuRyzen5", category: "cpu", group: "Processors" },
  { key: "cpuIntel", category: "cpu", group: "Processors" },
  { key: "cpuIntelUltra", category: "cpu", group: "Processors" },
  { key: "motherboard", category: "motherboard", group: "Motherboards" },
  { key: "ramFury", category: "ram", group: "Memory" },
  { key: "ramCrucial", category: "ram", group: "Memory" },
  { key: "coolerSilver", category: "cooler", group: "Cooling" },
  { key: "coolerBlack", category: "cooler", group: "Cooling" },
  { key: "fan", category: "case", group: "Cooling" },
  { key: "nvme", category: "storage", group: "Storage" },
  { key: "sata", category: "storage", group: "Storage" },
  { key: "psu", category: "psu", group: "Power" },
  { key: "caseGlass", category: "case", group: "Cases" },
  { key: "case4000d", category: "case", group: "Cases" },
  { key: "monitor", category: "monitor", group: "Desk setup" },
  { key: "keyboard", category: "keyboard", group: "Desk setup" },
  { key: "mouse", category: "mouse", group: "Desk setup" },
  { key: "deskMat", category: "keyboard", group: "Desk setup" },
  { key: "desk", category: "desk", group: "Desk setup" },
  { key: "chair", category: "chair", group: "Desk setup" },
  { key: "plant", category: "chair", group: "Desk setup" },
];

export function ModelLibrary() {
  const [active, setActive] = useState(ENTRIES[0]!);
  const model = MODELS[active.key];
  const groups = Array.from(new Set(ENTRIES.map((e) => e.group)));

  return (
    <section className="mt-10">
      <div className="mb-4">
        <p className="eyebrow">3D library</p>
        <h2 className="mt-1 text-3xl font-black tracking-tight">Photoreal 3D models</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every part in the viewer is a real, textured GLB model scaled to real-world millimetres.
          Click a model to inspect it.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="max-h-[34rem] space-y-4 overflow-y-auto rounded-xl border border-border bg-card p-3">
          {groups.map((g) => (
            <div key={g}>
              <div className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {g}
              </div>
              {ENTRIES.filter((e) => e.group === g).map((e) => (
                <button
                  key={e.key}
                  onClick={() => setActive(e)}
                  className={cn(
                    "block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                    active.key === e.key
                      ? "bg-primary/15 font-semibold text-brand"
                      : "hover:bg-secondary",
                  )}
                >
                  {MODELS[e.key].label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="h-[28rem] w-full">
            <ModelStage url={model.url} category={active.category} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border p-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{model.label}</span>
            <span>
              {model.author ? `by ${model.author} · ` : ""}
              {model.license}
              {"source" in model && model.source && (
                <a
                  href={model.source}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-brand hover:underline"
                >
                  source <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
