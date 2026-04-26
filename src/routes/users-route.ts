import { Elysia } from "elysia";
import { UserService } from "../services/users-service.ts";

export const usersRoute = new Elysia()
  .post("/api/users", async ({ body, set }: any) => {
    try {
      const result = await UserService.registerUser(body);
      return { data: "OK", token: result.token };
    } catch (e: any) {
      set.status = 400;
      // return exactly { error: "email sudah terdaftar" } if that error was thrown
      return { error: e.message };
    }
  })
  .get("/api/users/current", async ({ headers, set }: any) => {
    try {
      const authorization = headers["authorization"] || "";
      const token = authorization.replace("Bearer ", "");

      const user = await UserService.getCurrentUser(token);
      return { data: user };
    } catch (e: any) {
      set.status = 401;
      return { error: e.message };
    }
  });
