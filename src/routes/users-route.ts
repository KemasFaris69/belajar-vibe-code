import { Elysia } from "elysia";
import { UserService } from "../services/users-service.ts";

export const usersRoute = new Elysia()
  .post("/api/users", async ({ body, set }: any) => {
    try {
      await UserService.registerUser(body);
      return { data: "OK" };
    } catch (e: any) {
      set.status = 400;
      // return exactly { error: "email sudah terdaftar" } if that error was thrown
      return { error: e.message };
    }
  });
