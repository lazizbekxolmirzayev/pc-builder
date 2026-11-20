import {
  Armchair,
  CircuitBoard,
  Cpu,
  Fan,
  Gpu,
  HardDrive,
  Keyboard,
  LampDesk,
  MemoryStick,
  Monitor,
  Mouse,
  PcCase,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/data/parts";

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  cpu: Cpu,
  gpu: Gpu,
  motherboard: CircuitBoard,
  ram: MemoryStick,
  storage: HardDrive,
  psu: Zap,
  cooler: Fan,
  case: PcCase,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  desk: LampDesk,
  chair: Armchair,
};
