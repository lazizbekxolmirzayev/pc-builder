import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getMe, logoutUser, registerUser, type User } from "@/lib/api";

export type { User };

type UserCtx = {
  user: User | null;
  /** false until the session has been loaded (avoids a flash of the form on reload) */
  ready: boolean;
  register: (firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<UserCtx>({
  user: null,
  ready: false,
  register: async () => {},
  logout: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getMe().then((u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  const register = useCallback(async (firstName: string, lastName: string) => {
    setUser(await registerUser({ firstName, lastName }));
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, ready, register, logout }}>{children}</Ctx.Provider>;
}

export const useUser = () => useContext(Ctx);

export const fullName = (u: User) => `${u.firstName} ${u.lastName}`;
