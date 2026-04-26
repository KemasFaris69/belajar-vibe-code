import "dotenv/config";
import { Elysia, NotFoundError } from "elysia";
import { db } from "./db.ts";
import { users } from "./schema.ts";
import { eq } from "drizzle-orm";
import { usersRoute } from "./routes/users-route.ts";
import { swagger } from "@elysiajs/swagger";
type UserBody = {
  name: string;
  email: string;
};

const app = new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: "Belajar Vibe Code API",
        version: "1.0.0",
        description: "Dokumentasi API untuk aplikasi belajar-vibe-code"
      }
    }
  }))
  .use(usersRoute)
  .get("/", () => ({ status: "ok", uptime: process.uptime() }), {
    detail: {
      tags: ["General"],
      summary: "Status server",
      description: "Mengecek status uptime server."
    }
  })
  .get("/health", () => ({ status: "healthy" }), {
    detail: {
      tags: ["General"],
      summary: "Health check",
      description: "Mengecek kesehatan sistem server."
    }
  })
  .get("/users", async () => db.select().from(users), {
    detail: {
      tags: ["CRUD Users"],
      summary: "Mendapatkan semua user",
      description: "Mengambil daftar seluruh user dari database."
    }
  })
  .get("/users/:id", async ({ params }: { params: { id: string } }) => {
    const user = await db.select().from(users).where(eq(users.id, Number(params.id)));

    if (!user.length) {
      throw new NotFoundError("User not found");
    }

    return user[0];
  }, {
    detail: {
      tags: ["CRUD Users"],
      summary: "Mendapatkan user berdasarkan ID",
      description: "Mengambil data detail user spesifik menggunakan ID."
    }
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
  }, {
    detail: {
      tags: ["CRUD Users"],
      summary: "Update data user",
      description: "Memperbarui data name dan email user berdasarkan ID."
    }
  })
  .delete("/users/:id", async ({ params }: { params: { id: string } }) => {
    await db.delete(users).where(eq(users.id, Number(params.id)));
    return { success: true };
  }, {
    detail: {
      tags: ["CRUD Users"],
      summary: "Hapus user berdasarkan ID",
      description: "Menghapus data user secara permanen dari database."
    }
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
