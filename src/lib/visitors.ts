/**
 * Umumiy ro'yxat (mockapi.io).
 *
 * PC Builder va WHAT IF (PAXAILOVASI) saytlari BIR XIL manzilga yozadi va undan o'qiydi,
 * shuning uchun ikkala saytda ham bir xil ro'yxat chiqadi.
 *
 * Yozuv shakli (ikkala saytda bir xil):  { id, name: "Ism Familya", at: <ms>, minutes: <son> }
 *
 * VITE_VISITORS_API — mockapi.io 'visitors' resursining to'liq manzili (.env.production).
 * O'rnatilmagan bo'lsa (masalan, lokal dev) yozuvlar faqat shu brauzerda saqlanadi.
 * Haqiqiy backend ulanganda faqat shu fayl almashtiriladi.
 */
export type Visitor = { id: string; name: string; at: number | null; minutes: number | null };

const API = String(import.meta.env["VITE_VISITORS_API"] ?? "")
  .trim()
  .replace(/\/+$/, "");

/** false bo'lsa ro'yxat umumiy emas: yozuvlar faqat shu brauzerda turadi. */
export const remoteVisitors = API !== "";

const LOCAL_KEY = "pcb.visitors.v1";
const PENDING_KEY = "pcb.pending";
const SESSION_KEY = "pcb.visit";

/**
 * "Saytda" daqiqalari o'lchanmaydi: WHAT IF ro'yxatidagi bilan bir xil qoida bo'yicha
 * tasodifiy qiymat (ko'pincha 30–120, kamdan-kam 20–30 daqiqa).
 */
function rollMinutes(): number {
  if (Math.random() < 0.12) return 20 + Math.floor(Math.random() * 11);
  return 30 + Math.floor(Math.random() * 91);
}

const clean = (name: string) => name.trim().replace(/\s+/g, " ").slice(0, 60);

// ---------------------------------------------------------------- brauzerdagi zaxira (API yo'q bo'lganda)
function readLocal(): unknown[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function addLocal(name: string): void {
  const n = clean(name);
  if (!n) return;
  const row = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: n,
    at: Date.now(),
    minutes: rollMinutes(),
  };
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify([row, ...readLocal()]));
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------- yozish
async function post(name: string): Promise<boolean> {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: clean(name), at: Date.now(), minutes: rollMinutes() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Ismni ro'yxatga yozadi; server javob bermasa saqlab qo'yadi va keyingi kirishda qayta urinadi. */
export async function addVisitor(name: string): Promise<void> {
  if (!clean(name)) return;
  if (!API) return addLocal(name);
  if (!(await post(name))) {
    try {
      localStorage.setItem(PENDING_KEY, name);
    } catch {
      /* ignore */
    }
  }
}

export async function retryPending(): Promise<void> {
  let name: string | null = null;
  try {
    name = localStorage.getItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
  if (!name) return;
  const sent = API ? await post(name) : (addLocal(name), true);
  if (!sent) return;
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}

/** Har brauzer sessiyasida bir marta (ro'yxatdan o'tganda yoki qayta kirganda) ro'yxatga yozadi. */
export function logSessionVisit(name: string): void {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* sessionStorage yo'q: baribir yozamiz */
  }
  void addVisitor(name);
}

// ---------------------------------------------------------------- o'qish
/** Millisekund; sekundda yoki ISO matn ko'rinishida kelgan vaqtni ham tushunadi. */
function toMs(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  let n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) n = Date.parse(String(v));
  if (!Number.isFinite(n)) return null;
  return n < 1e11 ? n * 1000 : n;
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Eski/begona shakldagi yozuvlar (masalan, mockapi'ning o'zi yaratgan) ham xatosiz ko'rsatiladi. */
function normalize(row: unknown): Visitor {
  const r = (row && typeof row === "object" ? row : {}) as Record<string, unknown>;
  const name = typeof r["name"] === "string" ? r["name"].trim() : "";
  return {
    id: String(r["id"] ?? ""),
    name: name || "—",
    at: toMs(r["at"]) ?? toMs(r["createdAt"]),
    minutes: toNum(r["minutes"]),
  };
}

/** Eng yangisi birinchi; vaqti yo'q yozuvlar oxirida. */
export async function listVisitors(): Promise<Visitor[]> {
  let rows: unknown[];
  if (!API) {
    rows = readLocal();
  } else {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Server xatosi (${res.status})`);
    const data: unknown = await res.json();
    if (!Array.isArray(data)) throw new Error("Server noto'g'ri javob qaytardi");
    rows = data;
  }
  return rows.map(normalize).sort((a, b) => (b.at ?? 0) - (a.at ?? 0));
}

export function fmtMinutes(m: number | null): string {
  if (m === null) return "—";
  const total = Math.round(m);
  const h = Math.floor(total / 60);
  const r = total % 60;
  return h ? `${h} soat ${r} daqiqa` : `${r} daqiqa`;
}
