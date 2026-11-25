/**
 * Foydalanuvchi sessiyasi (shu brauzerda) va umumiy ro'yxat bilan aloqa.
 * Ro'yxat PC Builder va WHAT IF saytlari uchun bitta mockapi.io manzilida turadi (qarang: visitors.ts).
 *
 *   registerUser -> foydalanuvchini shu brauzerda saqlaydi va ro'yxatga yozadi
 *   getMe        -> qayta kirganda har sessiyada bir marta ro'yxatga yozadi
 *   fetchUsers   -> /admin sahifasi uchun umumiy ro'yxatni o'qiydi (admin kalit bilan)
 */
import { listVisitors, logSessionVisit, retryPending, type Visitor } from "@/lib/visitors";

export type User = { id: string; firstName: string; lastName: string; registeredAt: string };
export type { Visitor };

const USER_KEY = "pcb.user";

/** Admin kalit: faqat sahifani ochish uchun (ro'yxatning o'zi mockapi'da ochiq turadi). */
const ADMIN_KEY = String(import.meta.env["VITE_ADMIN_KEY"] ?? "") || "pcbuilder-admin";

const nameOf = (u: Pick<User, "firstName" | "lastName">) => `${u.firstName} ${u.lastName}`;

export async function getMe(): Promise<User | null> {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as User;
    if (!u?.firstName || !u?.lastName) return null;
    // Yetib bormagan oldingi yozuvni qayta yuboramiz, so'ng shu sessiyadagi kirishni yozamiz.
    void retryPending();
    logSessionVisit(nameOf(u));
    return u;
  } catch {
    return null;
  }
}

export async function registerUser(input: { firstName: string; lastName: string }): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    registeredAt: new Date().toISOString(),
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  logSessionVisit(nameOf(user));
  return user;
}

export async function logoutUser(): Promise<void> {
  localStorage.removeItem(USER_KEY);
}

export async function fetchUsers(adminKey: string): Promise<Visitor[]> {
  if (adminKey !== ADMIN_KEY) throw new Error("Kalit noto'g'ri");
  return listVisitors();
}
