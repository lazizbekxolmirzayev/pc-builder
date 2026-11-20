import type { Category } from "@/data/parts";

export type Setup = {
  id: string;
  name: string;
  brand: string;
  price: number;
  perf: number;
  model: string;
  tagline: string;
  specs: Record<string, string>;
  parts: Partial<Record<Category, string>>;
};

// Ready-made full desk setups. Selecting one auto-fills every builder slot.
export const SETUPS: Setup[] = [
  {
    id: "setup-aorus",
    name: "AORUS RGB Masterpiece",
    brand: "Gigabyte",
    price: 2899,
    perf: 78,
    model: "/models/setups/aorus-setup.glb",
    tagline: "Full AORUS gaming desk — glass tower, RGB fans, monitor and peripherals.",
    specs: { Edition: "AORUS Elite", Lighting: "Full RGB", Desk: "Included", Warranty: "3 years" },
    parts: {
      cpu: "cpu-6",
      gpu: "gpu-5",
      motherboard: "mb-4",
      ram: "ram-7",
      storage: "st-5",
      psu: "psu-4",
      cooler: "cl-3",
      case: "cs-10",
      monitor: "mn-6",
      keyboard: "kb-6",
      mouse: "ms-3",
      desk: "dk-1",
      chair: "ch-1",
    },
  },
  {
    id: "setup-rgb-tower",
    name: "RGB Tower Complete Set",
    brand: "PC Builder Studio",
    price: 3799,
    perf: 88,
    model: "/models/setups/aorus-setup.glb",
    tagline: "High-end prebuilt with 240 Hz OLED and flagship peripherals.",
    specs: { Edition: "Studio Pro", Lighting: "Full RGB", Desk: "Included", Warranty: "3 years" },
    parts: {
      cpu: "cpu-2",
      gpu: "gpu-7",
      motherboard: "mb-2",
      ram: "ram-1",
      storage: "st-2",
      psu: "psu-2",
      cooler: "cl-6",
      case: "cs-1",
      monitor: "mn-1",
      keyboard: "kb-10",
      mouse: "ms-9",
      desk: "dk-3",
      chair: "ch-2",
    },
  },
];

export const getSetup = (id: string) => SETUPS.find((s) => s.id === id);
