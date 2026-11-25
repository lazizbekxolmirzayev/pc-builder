/**
 * Mock API klienti. Server tomoni: src/routes/api.*.tsx + src/server/users-store.ts
 * (xotirada saqlanadigan mock baza). Server javob bermasa, ilova localStorage bilan
 * ishlashda davom etadi.
 *
 *   registerUser -> POST /api/register
 *   touchVisit   -> POST /api/visit     (qayta kirganda "oxirgi kirish" vaqtini yangilaydi)
 *   fetchUsers   -> GET  /api/users     (admin kalit bilan, /admin sahifasi uchun)
 */
export type User = { id: string; firstName: string; lastName: string; registeredAt: string };
export type AdminUser = User & { lastLoginAt: string; visits: number };

const USER_KEY = "pcb.user";

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getMe(): Promise<User | null> {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as User;
    if (!u?.firstName || !u?.lastName) return null;
    // Kirish vaqtini serverga yozamiz (server xotirasi tozalangan bo'lsa ham foydalanuvchi qayta tiklanadi).
    post("/api/visit", u).catch(() => {});
    return u;
  } catch {
    return null;
  }
}

export async function registerUser(input: { firstName: string; lastName: string }): Promise<User> {
  const draft: User = {
    id: crypto.randomUUID(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    registeredAt: new Date().toISOString(),
  };
  let user = draft;
  try {
    user = { ...draft, ...(await post("/api/register", draft)) };
  } catch {
    // server yo'q: lokal rejimda davom etamiz
  }
  localStorage.setItem(USER_KEY, JSON.stringify({ id: user.id, firstName: user.firstName, lastName: user.lastName, registeredAt: user.registeredAt }));
  return user;
}

export async function logoutUser(): Promise<void> {
  localStorage.removeItem(USER_KEY);
}

export async function fetchUsers(adminKey: string): Promise<AdminUser[]> {
  const res = await fetch("/api/users", { headers: { "x-admin-key": adminKey } });
  if (res.status === 401) throw new Error("Kalit noto'g'ri");
  if (!res.ok) throw new Error(`Server xatosi (${res.status})`);
  return res.json();
}
