import { describe, expect, it } from "vitest";
import { ALL_PARTS, CATEGORIES, FEATURED_BUILDS, getPart, partsByCategory } from "@/data/parts";
import { SETUPS } from "@/data/setups";
import { DICTS } from "@/lib/i18n";
import { buildScore, overallLevel, pcPrice, runChecks, setupPrice, totalPrice } from "@/lib/build";

describe("catalog", () => {
  it("has unique ids and positive prices", () => {
    const ids = ALL_PARTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ALL_PARTS.every((p) => p.price > 0)).toBe(true);
  });

  it("every category has parts", () => {
    for (const c of CATEGORIES) expect(partsByCategory(c).length).toBeGreaterThan(0);
  });

  it("every part has the fields the compatibility engine needs", () => {
    for (const p of ALL_PARTS) {
      if (p.category === "cpu") expect(p.socket).toBeTruthy();
      if (p.category === "motherboard")
        expect([p.socket, p.ramType, p.formFactor].every(Boolean)).toBe(true);
      if (p.category === "ram") expect(p.ramType).toBeTruthy();
      if (p.category === "gpu") expect(p.gpuLength).toBeGreaterThan(0);
      if (p.category === "case") expect(p.maxGpuLength && p.supports?.length).toBeTruthy();
      if (p.category === "psu") expect(p.wattage).toBeGreaterThan(0);
      if (p.category === "cooler") expect(p.sockets?.length && p.coolingW).toBeTruthy();
    }
  });

  it("every CPU socket has at least one supporting cooler", () => {
    for (const cpu of partsByCategory("cpu"))
      expect(partsByCategory("cooler").some((c) => c.sockets?.includes(cpu.socket!))).toBe(true);
  });
});

describe("preset builds and set-ups", () => {
  it.each(FEATURED_BUILDS.map((b) => [b.key, b] as const))(
    "%s references real parts and is fully compatible",
    (_k, b) => {
      for (const id of Object.values(b.parts)) expect(getPart(id)).toBeDefined();
      const checks = runChecks(b.parts);
      expect(checks.filter((c) => c.level === "bad")).toEqual([]);
      expect(overallLevel(checks)).not.toBe("bad");
      expect(buildScore(b.parts)).toBeGreaterThan(0);
    },
  );

  it("set-up scenes reference real parts", () => {
    for (const s of SETUPS)
      for (const id of Object.values(s.parts)) expect(getPart(id as string)).toBeDefined();
  });
});

describe("compatibility engine", () => {
  const first = (
    c: Parameters<typeof partsByCategory>[0],
    f: (p: ReturnType<typeof getPart> & object) => boolean,
  ) => partsByCategory(c).find(f)!;

  it("flags socket and RAM mismatches", () => {
    const am5 = first("cpu", (p) => p.socket === "AM5");
    const lga = first("motherboard", (p) => p.socket === "LGA1700");
    const ids = runChecks({ cpu: am5.id, motherboard: lga.id }).filter((c) => c.level === "bad");
    expect(ids.map((c) => c.id)).toContain("socket");

    const ddr4 = first("ram", (p) => p.ramType === "DDR4");
    const ddr5mb = first("motherboard", (p) => p.ramType === "DDR5");
    expect(runChecks({ ram: ddr4.id, motherboard: ddr5mb.id }).map((c) => c.id)).toContain("ram");
  });

  it("warns when a cooler cannot dissipate the CPU's heat", () => {
    const hot = getPart("cpu-9")!; // 253 W
    const weak = getPart("cl-4")!; // 150 W rated
    const c = runChecks({ cpu: hot.id, cooler: weak.id }).find((x) => x.id === "coolerCap");
    expect(c?.level).toBe("warn");
  });

  it("warns when essential parts are missing, but not for an empty build", () => {
    expect(runChecks({})).toEqual([]);
    expect(runChecks({ cpu: "cpu-1" }).some((c) => c.id === "missing")).toBe(true);
  });

  it("separates PC price from desk set-up price", () => {
    const sel = { cpu: "cpu-1", monitor: "mn-1", chair: "ch-3" };
    expect(pcPrice(sel)).toBe(getPart("cpu-1")!.price);
    expect(setupPrice(sel)).toBe(getPart("mn-1")!.price + getPart("ch-3")!.price);
    expect(totalPrice(sel)).toBe(pcPrice(sel) + setupPrice(sel));
  });
});

describe("translations", () => {
  const en = Object.keys(DICTS.en);
  it.each(["ru", "uz"] as const)("%s has every English key", (lang) => {
    expect(en.filter((k) => !(k in DICTS[lang]))).toEqual([]);
  });
  it("uz has no Cyrillic letters mixed into Latin words", () => {
    const bad = Object.values(DICTS.uz).filter((v) => /[A-Za-z'][Ѐ-ӿ]|[Ѐ-ӿ][A-Za-z']/.test(v));
    expect(bad).toEqual([]);
  });
});
