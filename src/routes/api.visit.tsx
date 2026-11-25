import { createFileRoute } from "@tanstack/react-router";
import { upsertUser } from "@/server/users-store";

// Ro'yxatdan o'tgan foydalanuvchi saytga qayta kirganda chaqiriladi (kirish vaqtini yangilaydi).
export const Route = createFileRoute("/api/visit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({}));
        const user = upsertUser(body, true);
        if (!user) return Response.json({ error: "invalid user" }, { status: 400 });
        return Response.json(user);
      },
    },
  },
});
