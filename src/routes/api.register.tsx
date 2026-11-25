import { createFileRoute } from "@tanstack/react-router";
import { upsertUser } from "@/server/users-store";

export const Route = createFileRoute("/api/register")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => ({}));
        const user = upsertUser(body, false);
        if (!user) return Response.json({ error: "firstName and lastName are required" }, { status: 400 });
        return Response.json(user);
      },
    },
  },
});
