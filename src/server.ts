import "dotenv/config";
import { Elysia, NotFoundError } from "elysia";
import { db } from "./db.ts";
import { users } from "./schema.ts";
import { eq } from "drizzle-orm";
import { usersRoute } from "./routes/users-route.ts";
type UserBody = {
  name: string;
  email: string;
};

const app = new Elysia();

app
  .use(usersRoute)
  .get("/", () => ({ status: "ok", uptime: process.uptime() }))
  .get("/health", () => ({ status: "healthy" }))
  .get("/users", async () => db.select().from(users))
  .get("/users/:id", async ({ params }: { params: { id: string } }) => {
    const user = await db.select().from(users).where(eq(users.id, Number(params.id)));

    if (!user.length) {
      throw new NotFoundError("User not found");
    }

    return user[0];
  })
  .put("/users/:id", async (context: any) => {
    const body = context.body as UserBody;
    const params = context.params as { id: string };

    await db.update(users)
      .set({
        name: body.name,
        email: body.email
      })
      .where(eq(users.id, Number(params.id)));

    return { success: true };
  })
  .delete("/users/:id", async ({ params }: { params: { id: string } }) => {
    await db.delete(users).where(eq(users.id, Number(params.id)));
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
