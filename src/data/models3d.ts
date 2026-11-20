import type { Category, Part } from "@/data/parts";

/**
 * Photoreal 3D model library.
 *
 * Every GLB under /public/models was normalized by scripts/normalize-models.mjs:
 *  - real-world meters (GPU 313 mm, DIMM 133 mm, 27" monitor 615 mm ...)
 *  - "installed" orientation in case-local axes: glass side = -X, front = +Z, up = +Y
 *    (motherboard faces -X, GPU fans face down, bracket at the rear -Z)
 *  - peripherals stand on y = 0 and face the user (+Z)
 *  - WebP textures + meshopt geometry (decoded by drei's useGLTF out of the box)
 */
export type Model3D = {
  id: string;
  url: string;
  label: string;
  /** Short credit line. CC-BY models MUST keep their attribution visible. */
  author?: string;
  source?: string;
  license: string;
};

const SKETCHFAB = "https://sketchfab.com/3d-models/";
const CC_BY = "CC BY 4.0";

export const MODELS = {
  // GPUs
  gpuRtx: {
    id: "gpuRtx",
    url: "/models/gpus/rtx-founders.glb",
    label: "GeForce RTX Founders Edition",
    author: "Muhammad Kholis",
    source: SKETCHFAB + "nvidia-geforce-rtx-3090-gpu-22158616a1a44455917ee8e1e8fc4b09",
    license: CC_BY,
  },
  gpuRadeon: {
    id: "gpuRadeon",
    url: "/models/gpus/radeon-dual-fan.glb",
    label: "Radeon dual-fan card",
    author: "Igor.Jop",
    source: SKETCHFAB + "rx-480-gpu-61e69f50bcd44c7284bef31a8f21c6a7",
    license: CC_BY,
  },
  // CPUs
  cpuRyzen5: {
    id: "cpuRyzen5",
    url: "/models/cpus/ryzen-5.glb",
    label: "AMD Ryzen 5",
    author: "Fochdog",
    source: SKETCHFAB + "cpu-ryzen-5-3600-249fb5e8c1e94686a2c2b1cd6df72bc5",
    license: CC_BY,
  },
  cpuRyzen9: {
    id: "cpuRyzen9",
    url: "/models/cpus/ryzen-9.glb",
    label: "AMD Ryzen 9",
    author: "Igor.Jop",
    source: SKETCHFAB + "am4-cpu-free-912c9c42d2dc40fe95574345aae51ea0",
    license: CC_BY,
  },
  cpuIntel: {
    id: "cpuIntel",
    url: "/models/cpus/intel-core.glb",
    label: "Intel Core",
    author: "Kuat-Entralla 3D Engineering",
    source: SKETCHFAB + "intel-cpu-ec11f729b05848488522ba6f8c6f254f",
    license: CC_BY,
  },
  cpuIntelUltra: {
    id: "cpuIntelUltra",
    url: "/models/cpus/intel-core-ultra.glb",
    label: "Intel Core Ultra",
    author: "Moonway 3D",
    source: SKETCHFAB + "free-intel-cpu-fe534a3cae7c4e66b6131da9b5dae6ff",
    license: CC_BY,
  },
  // Board / memory / storage / power
  motherboard: {
    id: "motherboard",
    url: "/models/motherboards/am4-board.glb",
    label: "Gigabyte B450M motherboard",
    author: "Temoor",
    source: SKETCHFAB + "motherboard-am4-783d063a29424571bfb4c9b7b490b75f",
    license: CC_BY,
  },
  ramFury: {
    id: "ramFury",
    url: "/models/ram/hyperx-fury.glb",
    label: "HyperX Fury DIMM",
    author: "Astrien",
    source: SKETCHFAB + "kingston-hyperx-fury-black-ram-module-3d9499b5337f475d8bbb1eccdb20e73d",
    license: CC_BY,
  },
  ramCrucial: {
    id: "ramCrucial",
    url: "/models/ram/crucial-ddr4.glb",
    label: "Crucial DDR4 DIMM",
    author: "BlackCube",
    source: SKETCHFAB + "crucial-8-gb-ddr4-2133-ram-6fa0d3b8c5684741be7d7e396e01bc9f",
    license: CC_BY,
  },
  nvme: {
    id: "nvme",
    url: "/models/storage/nvme-m2.glb",
    label: "Samsung 970 EVO Plus M.2",
    author: "Igor.Jop",
    source: SKETCHFAB + "m2ssd-painter-ccda7c201091445087c02692444641c2",
    license: CC_BY,
  },
  sata: {
    id: "sata",
    url: "/models/storage/sata-ssd.glb",
    label: '2.5" SATA SSD',
    author: "jcbinet",
    source: SKETCHFAB + "samsung-ssd-25in-dirty-dcc1150ede274cccb7f2ddc0f2345dcb",
    license: CC_BY,
  },
  psu: {
    id: "psu",
    url: "/models/psu/atx-psu.glb",
    label: "ATX power supply",
    author: "nofurion",
    source: SKETCHFAB + "power-supply-aerocool-kcas-500w-atx-bfb1f77fffb0410f9ee0d0be6fb5fc88",
    license: CC_BY,
  },
  // Cooling
  coolerSilver: {
    id: "coolerSilver",
    url: "/models/coolers/hyper-212.glb",
    label: "Cooler Master tower cooler",
    author: "wanderer",
    source: SKETCHFAB + "cooler-master-cpu-cooler-e54651982f524644a2144b52a6b36e89",
    license: CC_BY,
  },
  coolerBlack: {
    id: "coolerBlack",
    url: "/models/coolers/black-tower.glb",
    label: "Black tower cooler",
    author: "Fochdog",
    source: SKETCHFAB + "cpu-cooler-672a0a74a98c452a862016bee99f3579",
    license: CC_BY,
  },
  fan: {
    id: "fan",
    url: "/models/fans/argb-120.glb",
    label: "120 mm ARGB fan",
    author: "PC Builder (Blender)",
    license: "Original",
  },
  // Cases
  caseGlass: {
    id: "caseGlass",
    url: "/models/cases/glass-tower.glb",
    label: "Tempered-glass mid tower",
    author: "Harit",
    source: SKETCHFAB + "cabinet-836290a5491b4d67b3e2594813f44f3f",
    license: CC_BY,
  },
  case4000d: {
    id: "case4000d",
    url: "/models/cases/corsair-4000d.glb",
    label: "Corsair 4000D",
    author: "user-provided",
    license: "royalty-free",
  },
  // Desk setup
  monitor: {
    id: "monitor",
    url: "/models/setup/monitor-27.glb",
    label: "ASUS TUF gaming monitor",
    author: "Artik",
    source: SKETCHFAB + "asus-pc-gaming-monitor-941ce968c30a42d0a640a5c9d7f56128",
    license: CC_BY,
  },
  keyboard: {
    id: "keyboard",
    url: "/models/setup/keyboard-rgb.glb",
    label: "AORUS K1 RGB keyboard",
    author: "Yolala1232",
    source: SKETCHFAB + "gigabyte-aorus-k1-rgb-gaming-keyboard-d5b913461f8d4e0abf012aaf6f00ec9e",
    license: CC_BY,
  },
  mouse: {
    id: "mouse",
    url: "/models/setup/mouse-gaming.glb",
    label: "Gaming mouse",
    author: "zhe_kan",
    source: SKETCHFAB + "computer-mouse-6e7940d9e2144efeae3468a906f27e07",
    license: CC_BY,
  },
  deskMat: {
    id: "deskMat",
    url: "/models/setup/desk-mat.glb",
    label: "Damascus desk mat",
    author: "supahot",
    source: SKETCHFAB + "damascus-mousepad-42dc83c9a40a49bfaaccd0ea50762f85",
    license: CC_BY,
  },
  desk: {
    id: "desk",
    url: "/models/setup/desk-walnut.glb",
    label: "Walnut steel-frame desk",
    author: "PC Builder (Blender)",
    license: "Original",
  },
  chair: {
    id: "chair",
    url: "/models/setup/gaming-chair.glb",
    label: "Gaming chair",
    author: "user-provided",
    license: "royalty-free",
  },
  plant: {
    id: "plant",
    url: "/models/decor/ficus-plant.glb",
    label: "Ficus lyrata",
    author: "LadyCris",
    source: SKETCHFAB + "ficus-lyrata-plants-161df9b2f7124549a2cfa4c33104046e",
    license: CC_BY,
  },
} satisfies Record<string, Model3D>;

export type ModelKey = keyof typeof MODELS;

/** Picks the closest-looking real model for a specific catalogue part. */
export function modelFor(part: Part | undefined, category?: Category): Model3D {
  const cat = part?.category ?? category ?? "case";
  const name = `${part?.brand ?? ""} ${part?.name ?? ""}`.toLowerCase();
  switch (cat) {
    case "cpu":
      if (part?.brand === "Intel")
        return /ultra/.test(name) ? MODELS.cpuIntelUltra : MODELS.cpuIntel;
      return /ryzen 9/.test(name) ? MODELS.cpuRyzen9 : MODELS.cpuRyzen5;
    case "gpu":
      return part?.brand === "NVIDIA" ? MODELS.gpuRtx : MODELS.gpuRadeon;
    case "motherboard":
      return MODELS.motherboard;
    case "ram":
      return /crucial|ballistix|patriot|lpx/.test(name) ? MODELS.ramCrucial : MODELS.ramFury;
    case "storage":
      return /sata|hdd/i.test(part?.specs?.["Type"] ?? "") ? MODELS.sata : MODELS.nvme;
    case "psu":
      return MODELS.psu;
    case "cooler":
      return /cooler master|id-cooling|deepcool|thermalright/.test(name)
        ? MODELS.coolerSilver
        : MODELS.coolerBlack;
    case "case":
      return MODELS.caseGlass;
    case "monitor":
      return MODELS.monitor;
    case "keyboard":
      return MODELS.keyboard;
    case "mouse":
      return MODELS.mouse;
    case "desk":
      return MODELS.desk;
    case "chair":
      return MODELS.chair;
  }
}

/** Monitor diagonal in inches from the part specs (defaults to 27"). */
export function monitorInches(part: Part | undefined) {
  const raw = Object.values(part?.specs ?? {}).find((v) => /^\d+(\.\d+)?"$/.test(v));
  return raw ? parseFloat(raw) : 27;
}

export const ALL_MODELS: Model3D[] = Object.values(MODELS);
export const MODEL_CREDITS = ALL_MODELS.filter((m) => m.license === CC_BY);
export const HDRI = {
  studio: "/hdri/studio_small_03_1k.hdr",
  city: "/hdri/potsdamer_platz_1k.hdr",
};
