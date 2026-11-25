import { createFileRoute } from "@tanstack/react-router";
import { ADMIN_KEY, listUsers } from "@/server/users-store";

export const Route = createFileRoute("/api/users")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (request.headers.get("x-admin-key") !== ADMIN_KEY()) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }
        return Response.json(listUsers());
      },
    },
  },
});
