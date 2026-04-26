import "dotenv/config";
import { Elysia } from "elysia";
import { db } from "./db.ts";
import { users } from "./schema.ts";

const app = new Elysia();

app
  .get("/", () => ({ status: "ok", uptime: process.uptime() }))
  .get("/health", () => ({ status: "healthy" }))
  .get("/users", async () => {
    return await db.select().from(users);
  })
  .get("/users/:id", async ({ params }) => {
    const user = await db.select().from(users).where(users.id.equals(Number(params.id)));

    if (!user.length) {
      return app.error("User not found", { status: 404 });
    }

    return user[0];
  })
  .post("/users", async ({ body }) => {
    const created = await db.insert(users).values({
      name: body.name,
      email: body.email
    }).returning();

    return created[0];
  })
  .put("/users/:id", async ({ params, body }) => {
    const updated = await db.update(users)
      .set({
        name: body.name,
        email: body.email
      })
      .where(users.id.equals(Number(params.id)))
      .returning();

    if (!updated.length) {
      return app.error("User not found", { status: 404 });
    }

    return updated[0];
  })
  .delete("/users/:id", async ({ params }) => {
    const deleted = await db.delete(users)
      .where(users.id.equals(Number(params.id)))
      .returning();

    if (!deleted.length) {
      return app.error("User not found", { status: 404 });
    }

    return { success: true };
  });

const port = Number(process.env.PORT) || 3000;

(async () => {
  try {
    await app.listen({ port });
    console.log(`Server running on http://localhost:${port}`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
