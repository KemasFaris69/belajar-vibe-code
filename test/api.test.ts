import { describe, it, expect, beforeEach, beforeAll } from "bun:test";
import { app } from "../src/server.ts";
import { db } from "../src/db.ts";
import { users } from "../src/schema.ts";

// Helper for doing fetch requests to the app
const req = (path: string, options?: RequestInit) => {
  return app.handle(new Request(`http://localhost${path}`, options));
};

describe("API Tests", () => {
  beforeEach(async () => {
    // Clean up database before every test
    await db.delete(users);
  });

  describe("POST /api/users (Registrasi User)", () => {
    it("harus berhasil mendaftar dengan data lengkap", async () => {
      const body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const res = await req("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toBe("OK");
      expect(json.token).toBeDefined();
    });

    it("harus gagal jika email sudah terdaftar", async () => {
      const body = {
        name: "Test User",
        email: "duplicate@example.com",
        password: "password123",
      };

      // First request
      await req("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // Second request
      const res2 = await req("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res2.json();
      expect(res2.status).toBe(400);
      expect(json.error).toBe("email sudah terdaftar");
    });

    it("harus gagal jika data tidak lengkap", async () => {
      const body = {
        name: "Test User",
        email: "test@example.com",
      };

      const res = await req("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.error).toBe("Data tidak lengkap");
    });
  });

  describe("GET /api/users/current (Get Current User)", () => {
    let validToken = "";

    beforeEach(async () => {
      const res = await req("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Current User",
          email: "current@example.com",
          password: "password123",
        }),
      });
      const data = await res.json();
      validToken = data.token;
    });

    it("harus berhasil mendapatkan data profil dengan token yang valid", async () => {
      const res = await req("/api/users/current", {
        method: "GET",
        headers: { Authorization: `Bearer ${validToken}` },
      });

      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data.name).toBe("Current User");
      expect(json.data.email).toBe("current@example.com");
    });

    it("harus gagal tanpa token", async () => {
      const res = await req("/api/users/current", {
        method: "GET",
      });

      const json = await res.json();
      expect(res.status).toBe(401);
      expect(json.error).toBe("Unauthorized");
    });

    it("harus gagal dengan token yang tidak valid", async () => {
      const res = await req("/api/users/current", {
        method: "GET",
        headers: { Authorization: "Bearer invalid_token" },
      });

      const json = await res.json();
      expect(res.status).toBe(401);
      expect(json.error).toBe("Unauthorized");
    });
  });

  describe("DELETE /api/users/logout (Logout User)", () => {
    let validToken = "";

    beforeEach(async () => {
      const res = await req("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Logout User",
          email: "logout@example.com",
          password: "password123",
        }),
      });
      const data = await res.json();
      validToken = data.token;
    });

    it("harus berhasil logout dengan token yang valid", async () => {
      const res = await req("/api/users/logout", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${validToken}` },
      });

      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.data).toBe("OK");
    });

    it("harus gagal logout dengan token yang tidak valid", async () => {
      const res = await req("/api/users/logout", {
        method: "DELETE",
        headers: { Authorization: "Bearer invalid_token" },
      });

      const json = await res.json();
      expect(res.status).toBe(401);
      expect(json.error).toBe("Unauthorized");
    });

    it("harus gagal jika melakukan logout dua kali", async () => {
      // First logout
      await req("/api/users/logout", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${validToken}` },
      });

      // Second logout
      const res = await req("/api/users/logout", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${validToken}` },
      });

      const json = await res.json();
      expect(res.status).toBe(401);
      expect(json.error).toBe("Unauthorized");
    });
  });

  describe("General Endpoints (/, /health, CRUD Users)", () => {
    it("harus berhasil memanggil GET /", async () => {
      const res = await req("/");
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.status).toBe("ok");
    });

    it("harus berhasil memanggil GET /health", async () => {
      const res = await req("/health");
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.status).toBe("healthy");
    });

    describe("CRUD Operations on /users", () => {
      let createdUserId: string;

      beforeEach(async () => {
        // We can just use the /api/users to create one
        await req("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "CRUD User",
            email: "crud@example.com",
            password: "password123",
          }),
        });

        // Get the list to find the ID
        const resList = await req("/users");
        const list = await resList.json();
        createdUserId = list[0].id.toString();
      });

      it("GET /users harus mengembalikan array list user", async () => {
        const res = await req("/users");
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(Array.isArray(json)).toBe(true);
        expect(json.length).toBeGreaterThan(0);
      });

      it("GET /users/:id harus mengembalikan user spesifik", async () => {
        const res = await req(`/users/${createdUserId}`);
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(json.name).toBe("CRUD User");
      });

      it("GET /users/:id harus gagal jika id tidak ada", async () => {
        const res = await req("/users/999999");
        expect(res.status).toBe(404);
      });

      it("PUT /users/:id harus berhasil mengupdate data user", async () => {
        const res = await req(`/users/${createdUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Updated User",
            email: "updated@example.com",
          }),
        });

        const json = await res.json();
        expect(res.status).toBe(200);
        expect(json.success).toBe(true);

        // Verify update
        const resVerify = await req(`/users/${createdUserId}`);
        const jsonVerify = await resVerify.json();
        expect(jsonVerify.name).toBe("Updated User");
        expect(jsonVerify.email).toBe("updated@example.com");
      });

      it("DELETE /users/:id harus berhasil menghapus user", async () => {
        const res = await req(`/users/${createdUserId}`, {
          method: "DELETE",
        });

        const json = await res.json();
        expect(res.status).toBe(200);
        expect(json.success).toBe(true);

        // Verify deletion
        const resVerify = await req(`/users/${createdUserId}`);
        expect(resVerify.status).toBe(404);
      });
    });
  });
});
