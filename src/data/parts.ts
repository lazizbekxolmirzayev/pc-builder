import cpuImg from "@/assets/cpu.jpg";
import gpuImg from "@/assets/gpu.jpg";
import mbImg from "@/assets/motherboard.jpg";
import ramImg from "@/assets/ram.jpg";
import storageImg from "@/assets/storage.jpg";
import psuImg from "@/assets/psu.jpg";
import coolerImg from "@/assets/cooler.jpg";
import caseImg from "@/assets/case.jpg";
import monitorImg from "@/assets/monitor.jpg";
import keyboardImg from "@/assets/keyboard.jpg";
import mouseImg from "@/assets/mouse.jpg";
import deskImg from "@/assets/desk.png";
import chairImg from "@/assets/chair.png";

export type Category =
  | "cpu"
  | "gpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "cooler"
  | "case"
  | "monitor"
  | "keyboard"
  | "mouse"
  | "desk"
  | "chair";

export type Part = {
  id: string;
  category: Category;
  name: string;
  brand: string;
  price: number;
  perf: number; // 0-100
  watts: number; // power draw (or 0 for peripherals)
  image: string;
  specs: Record<string, string>;
  socket?: string;
  ramType?: "DDR4" | "DDR5";
  formFactor?: "ATX" | "Micro-ATX" | "Mini-ITX";
  supports?: ("ATX" | "Micro-ATX" | "Mini-ITX")[];
  gpuLength?: number; // mm
  maxGpuLength?: number; // mm
  wattage?: number; // PSU output
  sockets?: string[]; // cooler: supported CPU sockets
  coolingW?: number; // cooler: rated cooling capacity (W)
};

export const CATEGORY_IMAGE: Record<Category, string> = {
  cpu: cpuImg,
  gpu: gpuImg,
  motherboard: mbImg,
  ram: ramImg,
  storage: storageImg,
  psu: psuImg,
  cooler: coolerImg,
  case: caseImg,
  monitor: monitorImg,
  keyboard: keyboardImg,
  mouse: mouseImg,
  desk: deskImg,
  chair: chairImg,
};

export const CATEGORIES: Category[] = [
  "cpu",
  "gpu",
  "motherboard",
  "ram",
  "storage",
  "psu",
  "cooler",
  "case",
  "monitor",
  "keyboard",
  "mouse",
  "desk",
  "chair",
];

const cpu = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  watts: number,
  socket: string,
  cores: string,
  clock: string,
): Part => ({
  id,
  category: "cpu",
  brand,
  name,
  price,
  perf,
  watts,
  socket,
  image: cpuImg,
  specs: { Cores: cores, "Boost clock": clock, Socket: socket, TDP: `${watts}W` },
});

export const cpus: Part[] = [
  cpu("cpu-1", "AMD", "Ryzen 5 7600X", 209, 66, 105, "AM5", "6C / 12T", "5.3 GHz"),
  cpu("cpu-2", "AMD", "Ryzen 7 7800X3D", 379, 88, 120, "AM5", "8C / 16T", "5.0 GHz"),
  cpu("cpu-3", "AMD", "Ryzen 9 7950X", 549, 92, 170, "AM5", "16C / 32T", "5.7 GHz"),
  cpu("cpu-4", "AMD", "Ryzen 9 9950X", 649, 97, 170, "AM5", "16C / 32T", "5.7 GHz"),
  cpu("cpu-5", "AMD", "Ryzen 5 5600", 129, 52, 65, "AM4", "6C / 12T", "4.4 GHz"),
  cpu("cpu-6", "AMD", "Ryzen 7 5800X3D", 249, 72, 105, "AM4", "8C / 16T", "4.5 GHz"),
  cpu("cpu-7", "Intel", "Core i5-13600K", 289, 78, 125, "LGA1700", "14C / 20T", "5.1 GHz"),
  cpu("cpu-8", "Intel", "Core i7-14700K", 399, 89, 125, "LGA1700", "20C / 28T", "5.6 GHz"),
  cpu("cpu-9", "Intel", "Core i9-14900K", 569, 95, 253, "LGA1700", "24C / 32T", "6.0 GHz"),
  cpu("cpu-10", "Intel", "Core i5-12400F", 149, 58, 65, "LGA1700", "6C / 12T", "4.4 GHz"),
  cpu("cpu-11", "Intel", "Core Ultra 9 285K", 629, 96, 250, "LGA1851", "24C / 24T", "5.7 GHz"),
];

const gpu = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  watts: number,
  vram: string,
  length: number,
  pcie: string,
): Part => ({
  id,
  category: "gpu",
  brand,
  name,
  price,
  perf,
  watts,
  gpuLength: length,
  image: gpuImg,
  specs: { VRAM: vram, "Board power": `${watts}W`, Length: `${length} mm`, Interface: pcie },
});

export const gpus: Part[] = [
  gpu("gpu-1", "NVIDIA", "GeForce RTX 5090", 1999, 100, 575, "32 GB GDDR7", 358, "PCIe 5.0 x16"),
  gpu("gpu-2", "NVIDIA", "GeForce RTX 5080", 1199, 90, 360, "16 GB GDDR7", 330, "PCIe 5.0 x16"),
  gpu("gpu-3", "NVIDIA", "GeForce RTX 5070 Ti", 799, 80, 300, "16 GB GDDR7", 310, "PCIe 5.0 x16"),
  gpu(
    "gpu-4",
    "NVIDIA",
    "GeForce RTX 4070 Super",
    599,
    72,
    220,
    "12 GB GDDR6X",
    285,
    "PCIe 4.0 x16",
  ),
  gpu("gpu-5", "NVIDIA", "GeForce RTX 4060", 299, 52, 115, "8 GB GDDR6", 245, "PCIe 4.0 x8"),
  gpu("gpu-6", "AMD", "Radeon RX 7900 XTX", 899, 86, 355, "24 GB GDDR6", 340, "PCIe 4.0 x16"),
  gpu("gpu-7", "AMD", "Radeon RX 7800 XT", 499, 70, 263, "16 GB GDDR6", 300, "PCIe 4.0 x16"),
  gpu("gpu-8", "AMD", "Radeon RX 7600", 259, 48, 165, "8 GB GDDR6", 240, "PCIe 4.0 x8"),
  gpu("gpu-9", "AMD", "Radeon RX 9070 XT", 649, 78, 304, "16 GB GDDR6", 325, "PCIe 5.0 x16"),
  gpu("gpu-10", "Intel", "Arc B580", 249, 46, 190, "12 GB GDDR6", 272, "PCIe 4.0 x8"),
  gpu("gpu-11", "Intel", "Arc A770", 219, 42, 225, "16 GB GDDR6", 280, "PCIe 4.0 x16"),
];

const mb = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  socket: string,
  ramType: "DDR4" | "DDR5",
  formFactor: "ATX" | "Micro-ATX" | "Mini-ITX",
): Part => ({
  id,
  category: "motherboard",
  brand,
  name,
  price,
  perf,
  watts: 40,
  socket,
  ramType,
  formFactor,
  image: mbImg,
  specs: { Socket: socket, Memory: ramType, "Form factor": formFactor, "M.2 slots": "3" },
});

export const motherboards: Part[] = [
  mb("mb-1", "ASUS", "ROG Strix X670E-E", 429, 92, "AM5", "DDR5", "ATX"),
  mb("mb-2", "ASUS", "TUF Gaming B650-Plus", 199, 76, "AM5", "DDR5", "ATX"),
  mb("mb-3", "MSI", "MAG B650M Mortar", 179, 72, "AM5", "DDR5", "Micro-ATX"),
  mb("mb-4", "Gigabyte", "B550 AORUS Elite V2", 139, 60, "AM4", "DDR4", "ATX"),
  mb("mb-5", "ASRock", "B450M Steel Legend", 89, 48, "AM4", "DDR4", "Micro-ATX"),
  mb("mb-6", "ASUS", "ROG Maximus Z790 Hero", 599, 95, "LGA1700", "DDR5", "ATX"),
  mb("mb-7", "MSI", "PRO Z790-A WiFi", 229, 80, "LGA1700", "DDR5", "ATX"),
  mb("mb-8", "Gigabyte", "B760M DS3H", 129, 62, "LGA1700", "DDR4", "Micro-ATX"),
  mb("mb-9", "ASUS", "ROG Strix B760-I", 249, 74, "LGA1700", "DDR5", "Mini-ITX"),
  mb("mb-10", "MSI", "MPG Z890 Carbon", 499, 94, "LGA1851", "DDR5", "ATX"),
  mb("mb-11", "ASRock", "B650E PG-ITX", 269, 75, "AM5", "DDR5", "Mini-ITX"),
];

const ram = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  ramType: "DDR4" | "DDR5",
  cap: string,
  speed: string,
): Part => ({
  id,
  category: "ram",
  brand,
  name,
  price,
  perf,
  watts: 10,
  ramType,
  image: ramImg,
  specs: { Capacity: cap, Type: ramType, Speed: speed, Kit: "2 modules" },
});

export const rams: Part[] = [
  ram("ram-1", "Corsair", "Vengeance RGB 32GB", 119, 82, "DDR5", "32 GB (2x16)", "6000 MT/s"),
  ram("ram-2", "G.Skill", "Trident Z5 RGB 32GB", 139, 88, "DDR5", "32 GB (2x16)", "6400 MT/s"),
  ram("ram-3", "Kingston", "Fury Beast 16GB", 69, 68, "DDR5", "16 GB (2x8)", "5600 MT/s"),
  ram("ram-4", "Crucial", "Pro 64GB", 209, 90, "DDR5", "64 GB (2x32)", "5600 MT/s"),
  ram("ram-5", "TeamGroup", "T-Force Delta 32GB", 109, 80, "DDR5", "32 GB (2x16)", "6000 MT/s"),
  ram("ram-6", "Corsair", "Vengeance LPX 16GB", 44, 52, "DDR4", "16 GB (2x8)", "3200 MT/s"),
  ram("ram-7", "G.Skill", "Ripjaws V 32GB", 74, 60, "DDR4", "32 GB (2x16)", "3600 MT/s"),
  ram("ram-8", "Kingston", "Fury Renegade 32GB", 89, 64, "DDR4", "32 GB (2x16)", "4000 MT/s"),
  ram("ram-9", "Patriot", "Viper Steel 16GB", 49, 54, "DDR4", "16 GB (2x8)", "3600 MT/s"),
  ram("ram-10", "ADATA", "XPG Lancer 32GB", 114, 84, "DDR5", "32 GB (2x16)", "6000 MT/s"),
  ram("ram-11", "Crucial", "Ballistix 16GB", 54, 56, "DDR4", "16 GB (2x8)", "3600 MT/s"),
];

const st = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  cap: string,
  read: string,
  type: string,
): Part => ({
  id,
  category: "storage",
  brand,
  name,
  price,
  perf,
  watts: 8,
  image: storageImg,
  specs: {
    Capacity: cap,
    "Read speed": read,
    Type: type,
    Interface: type.includes("NVMe") ? "PCIe" : "SATA",
  },
});

export const storages: Part[] = [
  st("st-1", "Samsung", "990 PRO 2TB", 189, 96, "2 TB", "7450 MB/s", "NVMe Gen4"),
  st("st-2", "Samsung", "990 PRO 1TB", 109, 92, "1 TB", "7450 MB/s", "NVMe Gen4"),
  st("st-3", "WD", "Black SN850X 2TB", 179, 94, "2 TB", "7300 MB/s", "NVMe Gen4"),
  st("st-4", "Crucial", "T700 2TB", 229, 99, "2 TB", "12400 MB/s", "NVMe Gen5"),
  st("st-5", "Kingston", "KC3000 1TB", 94, 90, "1 TB", "7000 MB/s", "NVMe Gen4"),
  st("st-6", "Crucial", "P3 Plus 1TB", 64, 78, "1 TB", "5000 MB/s", "NVMe Gen4"),
  st("st-7", "Samsung", "870 EVO 1TB", 79, 55, "1 TB", "560 MB/s", "SATA SSD"),
  st("st-8", "WD", "Blue SA510 500GB", 44, 50, "500 GB", "560 MB/s", "SATA SSD"),
  st("st-9", "Seagate", "FireCuda 530 2TB", 199, 95, "2 TB", "7300 MB/s", "NVMe Gen4"),
  st("st-10", "Seagate", "Barracuda 4TB HDD", 89, 25, "4 TB", "190 MB/s", "HDD 5400rpm"),
  st("st-11", "Toshiba", "X300 8TB HDD", 159, 30, "8 TB", "210 MB/s", "HDD 7200rpm"),
];

const psu = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  wattage: number,
  cert: string,
  modular: string,
): Part => ({
  id,
  category: "psu",
  brand,
  name,
  price,
  perf,
  watts: 0,
  wattage,
  image: psuImg,
  specs: { Output: `${wattage}W`, Efficiency: cert, Modular: modular, Warranty: "10 years" },
});

export const psus: Part[] = [
  psu("psu-1", "Corsair", "RM1000x", 199, 94, 1000, "80+ Gold", "Full"),
  psu("psu-2", "Corsair", "RM850x", 149, 88, 850, "80+ Gold", "Full"),
  psu("psu-3", "Seasonic", "Vertex GX-1200", 249, 97, 1200, "80+ Gold", "Full"),
  psu("psu-4", "Seasonic", "Focus GX-750", 119, 84, 750, "80+ Gold", "Full"),
  psu("psu-5", "be quiet!", "Pure Power 12 M 650W", 99, 78, 650, "80+ Gold", "Full"),
  psu("psu-6", "MSI", "MPG A1000G", 179, 92, 1000, "80+ Gold", "Full"),
  psu("psu-7", "ASUS", "ROG Thor 1000P2", 329, 98, 1000, "80+ Platinum", "Full"),
  psu("psu-8", "Cooler Master", "MWE 600 Bronze", 59, 60, 600, "80+ Bronze", "Non"),
  psu("psu-9", "EVGA", "SuperNOVA 750 GT", 109, 82, 750, "80+ Gold", "Full"),
  psu("psu-10", "Thermaltake", "Toughpower GF3 1350W", 279, 96, 1350, "80+ Gold", "Full"),
  psu("psu-11", "Gigabyte", "UD550N", 54, 55, 550, "80+ Bronze", "Non"),
];

// LGA1851 keeps the LGA1700 mounting hole spacing, so these coolers fit both Intel sockets.
const COOLER_SOCKETS = ["AM5", "AM4", "LGA1700", "LGA1851"];

const cooler = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  type: string,
  tdp: string,
  fans: string,
): Part => ({
  id,
  category: "cooler",
  brand,
  name,
  price,
  perf,
  watts: 12,
  image: coolerImg,
  sockets: COOLER_SOCKETS,
  coolingW: parseInt(tdp, 10),
  specs: { Type: type, "Cooling capacity": tdp, Fans: fans, Sockets: COOLER_SOCKETS.join(" / ") },
});

export const coolers: Part[] = [
  cooler("cl-1", "Noctua", "NH-D15 chromax", 119, 90, "Air tower", "250W", "2x 140mm"),
  cooler("cl-2", "be quiet!", "Dark Rock Pro 5", 109, 88, "Air tower", "270W", "135mm + 120mm"),
  cooler("cl-3", "Thermalright", "Peerless Assassin 120", 39, 82, "Air tower", "240W", "2x 120mm"),
  cooler("cl-4", "Cooler Master", "Hyper 212 Black", 29, 60, "Air tower", "150W", "1x 120mm"),
  cooler(
    "cl-5",
    "Arctic",
    "Liquid Freezer III 360",
    129,
    96,
    "AIO liquid 360mm",
    "350W",
    "3x 120mm ARGB",
  ),
  cooler(
    "cl-6",
    "Corsair",
    "iCUE H150i Elite",
    189,
    94,
    "AIO liquid 360mm",
    "330W",
    "3x 120mm RGB",
  ),
  cooler("cl-7", "NZXT", "Kraken 240 RGB", 149, 88, "AIO liquid 240mm", "280W", "2x 120mm RGB"),
  cooler("cl-8", "Lian Li", "Galahad II 360", 169, 93, "AIO liquid 360mm", "330W", "3x 120mm ARGB"),
  cooler("cl-9", "DeepCool", "AK620 Digital", 69, 85, "Air tower", "260W", "2x 120mm"),
  cooler(
    "cl-10",
    "MSI",
    "MAG Coreliquid E240",
    99,
    84,
    "AIO liquid 240mm",
    "250W",
    "2x 120mm ARGB",
  ),
  cooler("cl-11", "ID-Cooling", "SE-224-XT", 25, 55, "Air tower", "180W", "1x 120mm"),
];

const pcCase = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  supports: ("ATX" | "Micro-ATX" | "Mini-ITX")[],
  maxGpu: number,
  size: string,
): Part => ({
  id,
  category: "case",
  brand,
  name,
  price,
  perf,
  watts: 15,
  supports,
  maxGpuLength: maxGpu,
  image: caseImg,
  specs: {
    Size: size,
    "Max GPU length": `${maxGpu} mm`,
    Supports: supports.join(", "),
    Side: "Tempered glass",
  },
});

export const cases: Part[] = [
  pcCase(
    "cs-1",
    "Lian Li",
    "O11 Dynamic EVO",
    169,
    94,
    ["ATX", "Micro-ATX", "Mini-ITX"],
    420,
    "Mid tower",
  ),
  pcCase(
    "cs-2",
    "Fractal",
    "North XL",
    159,
    92,
    ["ATX", "Micro-ATX", "Mini-ITX"],
    413,
    "Mid tower",
  ),
  pcCase("cs-3", "NZXT", "H7 Flow", 129, 90, ["ATX", "Micro-ATX", "Mini-ITX"], 400, "Mid tower"),
  pcCase(
    "cs-4",
    "Corsair",
    "4000D Airflow",
    104,
    88,
    ["ATX", "Micro-ATX", "Mini-ITX"],
    360,
    "Mid tower",
  ),
  pcCase(
    "cs-5",
    "be quiet!",
    "Pure Base 500DX",
    109,
    84,
    ["ATX", "Micro-ATX", "Mini-ITX"],
    369,
    "Mid tower",
  ),
  pcCase(
    "cs-6",
    "Cooler Master",
    "MasterBox Q300L",
    49,
    62,
    ["Micro-ATX", "Mini-ITX"],
    360,
    "Micro tower",
  ),
  pcCase("cs-7", "Fractal", "Ridge ITX", 179, 80, ["Mini-ITX"], 325, "Small form factor"),
  pcCase("cs-8", "NZXT", "H1 V2", 359, 78, ["Mini-ITX"], 324, "Small form factor"),
  pcCase(
    "cs-9",
    "Phanteks",
    "Enthoo Pro 2",
    149,
    91,
    ["ATX", "Micro-ATX", "Mini-ITX"],
    503,
    "Full tower",
  ),
  pcCase(
    "cs-10",
    "Thermaltake",
    "View 51 TG",
    189,
    89,
    ["ATX", "Micro-ATX", "Mini-ITX"],
    440,
    "Full tower",
  ),
  pcCase("cs-11", "Deepcool", "CH370 Micro", 59, 65, ["Micro-ATX", "Mini-ITX"], 320, "Micro tower"),
];

const monitor = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  res: string,
  hz: string,
  panel: string,
  size: string,
): Part => ({
  id,
  category: "monitor",
  brand,
  name,
  price,
  perf,
  watts: 0,
  image: monitorImg,
  specs: { Resolution: res, "Refresh rate": hz, Panel: panel, Size: size },
});

export const monitors: Part[] = [
  monitor("mn-1", "LG", "UltraGear 27GR95QE", 799, 95, "2560x1440", "240 Hz", "OLED", '27"'),
  monitor("mn-2", "Samsung", "Odyssey OLED G8", 999, 97, "3840x2160", "240 Hz", "QD-OLED", '32"'),
  monitor("mn-3", "ASUS", "ROG Swift PG27AQDM", 899, 96, "2560x1440", "240 Hz", "OLED", '27"'),
  monitor("mn-4", "Dell", "Alienware AW3423DWF", 899, 94, "3440x1440", "165 Hz", "QD-OLED", '34"'),
  monitor("mn-5", "Gigabyte", "M27Q X", 349, 84, "2560x1440", "240 Hz", "IPS", '27"'),
  monitor("mn-6", "MSI", "MAG 274QRF QD", 279, 80, "2560x1440", "170 Hz", "Rapid IPS", '27"'),
  monitor("mn-7", "AOC", "24G2SP", 149, 66, "1920x1080", "165 Hz", "IPS", '24"'),
  monitor("mn-8", "Acer", "Nitro XV272U", 229, 76, "2560x1440", "170 Hz", "IPS", '27"'),
  monitor("mn-9", "ViewSonic", "XG2431", 249, 78, "1920x1080", "240 Hz", "IPS", '24"'),
  monitor("mn-10", "BenQ", "Mobiuz EX2710Q", 379, 82, "2560x1440", "165 Hz", "IPS", '27"'),
  monitor("mn-11", "LG", "UltraGear 32GR93U", 649, 90, "3840x2160", "144 Hz", "IPS", '32"'),
];

const kb = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  sw: string,
  layout: string,
  conn: string,
): Part => ({
  id,
  category: "keyboard",
  brand,
  name,
  price,
  perf,
  watts: 0,
  image: keyboardImg,
  specs: { Switches: sw, Layout: layout, Connection: conn, Backlight: "RGB" },
});

export const keyboards: Part[] = [
  kb("kb-1", "Wooting", "60HE+", 195, 97, "Hall effect", "60%", "USB-C"),
  kb("kb-2", "Logitech", "G Pro X TKL", 199, 92, "GX Optical", "TKL", "Wireless"),
  kb("kb-3", "Razer", "Huntsman V3 Pro", 249, 95, "Analog optical", "Full", "USB-C"),
  kb("kb-4", "Keychron", "Q1 Pro", 199, 90, "Gateron mechanical", "75%", "Wireless"),
  kb("kb-5", "SteelSeries", "Apex Pro TKL", 219, 93, "OmniPoint 2.0", "TKL", "USB-C"),
  kb("kb-6", "Corsair", "K70 RGB Pro", 159, 86, "Cherry MX Red", "Full", "USB-C"),
  kb("kb-7", "HyperX", "Alloy Origins Core", 89, 78, "HyperX Red", "TKL", "USB-C"),
  kb("kb-8", "Ducky", "One 3 SF", 129, 84, "Cherry MX Brown", "65%", "USB-C"),
  kb("kb-9", "Redragon", "K552 Kumara", 39, 58, "Outemu Blue", "TKL", "USB"),
  kb("kb-10", "ASUS", "ROG Azoth", 249, 94, "ROG NX Snow", "75%", "Wireless"),
  kb("kb-11", "Glorious", "GMMK 2", 99, 80, "Fox linear", "65%", "USB-C"),
];

const mouse = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  dpi: string,
  weight: string,
  conn: string,
): Part => ({
  id,
  category: "mouse",
  brand,
  name,
  price,
  perf,
  watts: 0,
  image: mouseImg,
  specs: { Sensor: dpi, Weight: weight, Connection: conn, Buttons: "6" },
});

export const mice: Part[] = [
  mouse("ms-1", "Logitech", "G Pro X Superlight 2", 159, 97, "32000 DPI", "60 g", "Wireless"),
  mouse("ms-2", "Razer", "Viper V3 Pro", 159, 96, "35000 DPI", "54 g", "Wireless"),
  mouse("ms-3", "Pulsar", "X2V2 Mini", 89, 92, "26000 DPI", "52 g", "Wireless"),
  mouse("ms-4", "Zowie", "EC2-CW", 129, 88, "3200 DPI", "77 g", "Wireless"),
  mouse("ms-5", "SteelSeries", "Aerox 3", 69, 82, "18000 DPI", "59 g", "Wired"),
  mouse("ms-6", "Glorious", "Model O 2", 59, 80, "26000 DPI", "58 g", "Wired"),
  mouse("ms-7", "Corsair", "M65 RGB Ultra", 79, 78, "26000 DPI", "97 g", "Wired"),
  mouse("ms-8", "HyperX", "Pulsefire Haste 2", 49, 76, "26000 DPI", "53 g", "Wired"),
  mouse("ms-9", "ASUS", "ROG Keris II Ace", 149, 94, "42000 DPI", "54 g", "Wireless"),
  mouse("ms-10", "Endgame Gear", "OP1 8k", 79, 90, "26000 DPI", "50 g", "Wired"),
  mouse("ms-11", "Cooler Master", "MM712", 59, 79, "19000 DPI", "59 g", "Wireless"),
];

const desk = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  size: string,
  material: string,
  feature: string,
): Part => ({
  id,
  category: "desk",
  brand,
  name,
  price,
  perf,
  watts: 0,
  image: deskImg,
  specs: { Size: size, Material: material, Feature: feature },
});

export const desks: Part[] = [
  desk("dk-1", "IKEA", "UPPSPEL 1400", 149, 82, "1400x600 mm", "Walnut veneer", "Cable management"),
  desk("dk-2", "Autonomous", "SmartDesk 2", 299, 90, "1200x600 mm", "Bamboo", "Electric standing"),
  desk("dk-3", "Cougar", "TUGRA ST400", 249, 86, "1400x700 mm", "Carbon steel", "RGB light bar"),
  desk(
    "dk-4",
    "Secretlab",
    "MAGNUS PRO",
    439,
    94,
    "1680x780 mm",
    "E1 steel",
    "Magnetic accessories",
  ),
];

const chair = (
  id: string,
  brand: string,
  name: string,
  price: number,
  perf: number,
  style: string,
  adjust: string,
  material: string,
): Part => ({
  id,
  category: "chair",
  brand,
  name,
  price,
  perf,
  watts: 0,
  image: chairImg,
  specs: { Style: style, Adjustment: adjust, Material: material, Recline: "90-165 deg" },
});

export const chairs: Part[] = [
  chair(
    "ch-1",
    "Secretlab",
    "TITAN Evo 2024 Red",
    499,
    96,
    "Racing esports",
    "4D armrests + lumbar",
    "NEO Hybrid Leatherette",
  ),
  chair("ch-2", "Cougar", "Commander LE", 279, 84, "Gaming", "3D armrests", "PU leather"),
  chair(
    "ch-3",
    "Herman Miller",
    "Aeron",
    1395,
    98,
    "Ergonomic office",
    "Full tilt + lumbar",
    "8Z Pellicle mesh",
  ),
  chair(
    "ch-4",
    "Noble",
    "Herculean Viper",
    349,
    88,
    "Gaming",
    "4D armrests + headrest",
    "Breathable mesh",
  ),
];

export const ALL_PARTS: Part[] = [
  ...cpus,
  ...gpus,
  ...motherboards,
  ...rams,
  ...storages,
  ...psus,
  ...coolers,
  ...cases,
  ...monitors,
  ...keyboards,
  ...mice,
  ...desks,
  ...chairs,
];

export const partsByCategory = (c: Category) => ALL_PARTS.filter((p) => p.category === c);
export const getPart = (id: string) => ALL_PARTS.find((p) => p.id === id);
export const BRANDS = Array.from(new Set(ALL_PARTS.map((p) => p.brand))).sort();

export const FEATURED_BUILDS = [
  {
    key: "starter",
    parts: {
      cpu: "cpu-10",
      gpu: "gpu-5",
      motherboard: "mb-8",
      ram: "ram-6",
      storage: "st-6",
      psu: "psu-8",
      cooler: "cl-4",
      case: "cs-6",
    },
  },
  {
    key: "sweet",
    parts: {
      cpu: "cpu-7",
      gpu: "gpu-7",
      motherboard: "mb-7",
      ram: "ram-1",
      storage: "st-2",
      psu: "psu-4",
      cooler: "cl-3",
      case: "cs-4",
    },
  },
  {
    key: "extreme",
    parts: {
      cpu: "cpu-4",
      gpu: "gpu-1",
      motherboard: "mb-1",
      ram: "ram-4",
      storage: "st-4",
      psu: "psu-3",
      cooler: "cl-5",
      case: "cs-1",
    },
  },
] as const;
