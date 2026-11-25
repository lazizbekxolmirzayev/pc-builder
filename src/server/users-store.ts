// Mock database: xotirada saqlanadi (server ishlayotgan vaqt davomida).
// Haqiqiy DB ulanganda faqat shu fayl almashtiriladi.
export type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  registeredAt: string;
  lastLoginAt: string;
  visits: number;
};

const g = globalThis as unknown as { __pcbUsers?: Map<string, StoredUser> };
const db = (g.__pcbUsers ??= new Map<string, StoredUser>());

const clean = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, 40) : "");

/** Yangi foydalanuvchi qo'shadi yoki bor bo'lsa kirish vaqtini yangilaydi. */
export function upsertUser(input: { id?: unknown; firstName?: unknown; lastName?: unknown; registeredAt?: unknown }, isLogin: boolean) {
  const id = clean(input.id) || crypto.randomUUID();
  const firstName = clean(input.firstName);
  const lastName = clean(input.lastName);
  if (!firstName || !lastName) return null;

  const now = new Date().toISOString();
  const existing = db.get(id);
  if (existing) {
    existing.lastLoginAt = now;
    existing.visits += isLogin ? 1 : 0;
    return existing;
  }
  const regAt = typeof input.registeredAt === "string" && !Number.isNaN(Date.parse(input.registeredAt)) ? input.registeredAt : now;
  const user: StoredUser = { id, firstName, lastName, registeredAt: regAt, lastLoginAt: now, visits: 1 };
  db.set(id, user);
  return user;
}

export const listUsers = () =>
  [...db.values()].sort((a, b) => b.lastLoginAt.localeCompare(a.lastLoginAt));

export const ADMIN_KEY = () => process.env["ADMIN_KEY"] || "pcbuilder-admin";
