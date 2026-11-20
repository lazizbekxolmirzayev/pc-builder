import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CATEGORIES, getPart, type Category, type Part } from "@/data/parts";
import { type Setup } from "@/data/setups";
import { CURRENCY, USD_TO_UZS } from "@/lib/site-config";

export type Selection = Partial<Record<Category, string>>;

export type SavedBuild = {
  id: string;
  name: string;
  parts: Selection;
  total: number;
  score: number;
  createdAt: string;
};

export type CheckLevel = "ok" | "warn" | "bad";
export type Check = { id: string; level: CheckLevel; messageKey: string };

const SEL_KEY = "pcb.current";
const SAVED_KEY = "pcb.saved";
const SETUP_KEY = "pcb.setup";

function readSaved(): SavedBuild[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as SavedBuild[]) : [];
  } catch {
    return [];
  }
}

export function selectedParts(sel: Selection): Part[] {
  return CATEGORIES.map((c) => {
    const id = sel[c];
    return id ? getPart(id) : undefined;
  }).filter((part): part is Part => Boolean(part));
}

/** Parts that live inside the computer itself; everything else is desk set-up. */
export const PC_CATEGORIES: Category[] = [
  "cpu",
  "gpu",
  "motherboard",
  "ram",
  "storage",
  "psu",
  "cooler",
  "case",
];
const isPcPart = (p: Part) => PC_CATEGORIES.includes(p.category);

export function totalPrice(sel: Selection) {
  return selectedParts(sel).reduce((s, p) => s + p.price, 0);
}

/** Price of the computer only (without monitor, peripherals, desk and chair). */
export function pcPrice(sel: Selection) {
  return selectedParts(sel)
    .filter(isPcPart)
    .reduce((s, p) => s + p.price, 0);
}

/** Price of the desk set-up: monitor, keyboard, mouse, desk, chair. */
export function setupPrice(sel: Selection) {
  return totalPrice(sel) - pcPrice(sel);
}

export function totalPower(sel: Selection) {
  return selectedParts(sel).reduce((s, p) => s + p.watts, 0);
}

export function runChecks(sel: Selection): Check[] {
  const cpu = sel.cpu ? getPart(sel.cpu) : undefined;
  const mb = sel.motherboard ? getPart(sel.motherboard) : undefined;
  const ram = sel.ram ? getPart(sel.ram) : undefined;
  const gpu = sel.gpu ? getPart(sel.gpu) : undefined;
  const pcCase = sel.case ? getPart(sel.case) : undefined;
  const psu = sel.psu ? getPart(sel.psu) : undefined;
  const cooler = sel.cooler ? getPart(sel.cooler) : undefined;
  const checks: Check[] = [];

  const hasPcPart = PC_CATEGORIES.some((c) => sel[c]);
  if (hasPcPart && PC_CATEGORIES.some((c) => !sel[c]))
    checks.push({ id: "missing", level: "warn", messageKey: "compat.missing" });

  if (cpu && mb)
    checks.push(
      cpu.socket === mb.socket
        ? { id: "socket", level: "ok", messageKey: "compat.socketOk" }
        : { id: "socket", level: "bad", messageKey: "compat.socket" },
    );

  if (ram && mb)
    checks.push(
      ram.ramType === mb.ramType
        ? { id: "ram", level: "ok", messageKey: "compat.ramOk" }
        : { id: "ram", level: "bad", messageKey: "compat.ram" },
    );

  if (gpu && pcCase) {
    const max = pcCase.maxGpuLength ?? 0;
    const len = gpu.gpuLength ?? 0;
    checks.push(
      len > max
        ? { id: "gpuCase", level: "bad", messageKey: "compat.gpuCase" }
        : max - len < 15
          ? { id: "gpuCase", level: "warn", messageKey: "compat.gpuCaseTight" }
          : { id: "gpuCase", level: "ok", messageKey: "compat.gpuCaseOk" },
    );
  }

  if (mb && pcCase)
    checks.push(
      mb.formFactor && pcCase.supports?.includes(mb.formFactor)
        ? { id: "mbCase", level: "ok", messageKey: "compat.mbCaseOk" }
        : { id: "mbCase", level: "bad", messageKey: "compat.mbCase" },
    );

  if (cpu && cooler) {
    checks.push(
      cooler.sockets?.includes(cpu.socket ?? "")
        ? { id: "coolerSocket", level: "ok", messageKey: "compat.coolerSocketOk" }
        : { id: "coolerSocket", level: "bad", messageKey: "compat.coolerSocket" },
    );
    checks.push(
      (cooler.coolingW ?? 0) >= cpu.watts
        ? { id: "coolerCap", level: "ok", messageKey: "compat.coolerCapOk" }
        : { id: "coolerCap", level: "warn", messageKey: "compat.coolerCap" },
    );
  }

  if (psu) {
    const need = totalPower(sel);
    const out = psu.wattage ?? 0;
    checks.push(
      out < need
        ? { id: "psu", level: "bad", messageKey: "compat.psu" }
        : out < need * 1.2
          ? { id: "psu", level: "warn", messageKey: "compat.psuTight" }
          : { id: "psu", level: "ok", messageKey: "compat.psuOk" },
    );
  }

  return checks;
}

export function overallLevel(checks: Check[]): CheckLevel {
  if (checks.some((c) => c.level === "bad")) return "bad";
  if (checks.some((c) => c.level === "warn")) return "warn";
  return "ok";
}

export function performance(sel: Selection) {
  const cpu = sel.cpu ? getPart(sel.cpu) : undefined;
  const gpu = sel.gpu ? getPart(sel.gpu) : undefined;
  const ram = sel.ram ? getPart(sel.ram) : undefined;
  const storage = sel.storage ? getPart(sel.storage) : undefined;
  if (!cpu || !gpu) return null;

  const cpuScore = cpu.perf;
  const gpuScore = gpu.perf;
  const support = ((ram?.perf ?? 60) + (storage?.perf ?? 60)) / 2;
  const score = Math.round(gpuScore * 0.55 + cpuScore * 0.3 + support * 0.15);

  const base = gpuScore * 0.75 + cpuScore * 0.25;
  const fps1080 = Math.round(Math.min(base * 3.1, cpuScore * 3.4));
  const fps1440 = Math.round(fps1080 * 0.72);
  const fps4k = Math.round(fps1080 * 0.42);

  return { score, cpuScore, gpuScore, fps1080, fps1440, fps4k };
}

export function buildScore(sel: Selection) {
  return performance(sel)?.score ?? 0;
}

type BuildCtx = {
  selection: Selection;
  setPart: (c: Category, id: string) => void;
  removePart: (c: Category) => void;
  clear: () => void;
  loadSelection: (sel: Selection) => void;
  setupId: string | null;
  applySetup: (setup: Setup) => void;
  saved: SavedBuild[];
  saveBuild: (name: string) => SavedBuild | null;
  deleteBuild: (id: string) => void;
};

const Ctx = createContext<BuildCtx | null>(null);

export function BuildProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>({});
  const [setupId, setSetupId] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedBuild[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SEL_KEY);
      if (raw) setSelection(JSON.parse(raw) as Selection);
      setSetupId(localStorage.getItem(SETUP_KEY));
    } catch {
      /* ignore */
    }
    setSaved(readSaved());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(SEL_KEY, JSON.stringify(selection));
    if (setupId) localStorage.setItem(SETUP_KEY, setupId);
    else localStorage.removeItem(SETUP_KEY);
  }, [selection, setupId, ready]);

  const setPart = useCallback((c: Category, id: string) => {
    setSetupId(null);
    setSelection((s) => ({ ...s, [c]: id }));
  }, []);

  const removePart = useCallback((c: Category) => {
    setSetupId(null);
    setSelection((s) => {
      const next = { ...s };
      delete next[c];
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSetupId(null);
    setSelection({});
  }, []);
  const loadSelection = useCallback((sel: Selection) => {
    setSetupId(null);
    setSelection({ ...sel });
  }, []);

  const applySetup = useCallback((setup: Setup) => {
    setSetupId(setup.id);
    setSelection({ ...setup.parts });
  }, []);

  const persistSaved = (next: SavedBuild[]) => {
    setSaved(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  };

  const saveBuild = useCallback(
    (name: string) => {
      if (selectedParts(selection).length === 0) return null;
      const build: SavedBuild = {
        id: `b-${Date.now()}`,
        name: name.trim() || "My build",
        parts: { ...selection },
        total: totalPrice(selection),
        score: buildScore(selection),
        createdAt: new Date().toISOString(),
      };
      persistSaved([build, ...readSaved()]);
      return build;
    },
    [selection],
  );

  const deleteBuild = useCallback((id: string) => {
    persistSaved(readSaved().filter((b) => b.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      selection,
      setPart,
      removePart,
      clear,
      loadSelection,
      setupId,
      applySetup,
      saved,
      saveBuild,
      deleteBuild,
    }),
    [
      selection,
      setPart,
      removePart,
      clear,
      loadSelection,
      setupId,
      applySetup,
      saved,
      saveBuild,
      deleteBuild,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBuild() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBuild must be used inside BuildProvider");
  return ctx;
}

export const money = (n: number) =>
  CURRENCY === "UZS"
    ? `${(Math.round((n * USD_TO_UZS) / 1000) * 1000).toLocaleString("en-US").replace(/,/g, " ")} so'm`
    : `$${n.toLocaleString("en-US")}`;
