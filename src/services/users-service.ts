import { db } from "../db.ts";
import { users } from "../schema.ts";
import { eq } from "drizzle-orm";

export class UserService {
  static async registerUser(body: any) {
    const { name, email, password } = body;

    if (!name || !email || !password) {
      throw new Error("Data tidak lengkap");
    }

    // Check if email exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser.length > 0) {
      throw new Error("email sudah terdaftar");
    }

    // Hash password using Bun's built-in password hasher with bcrypt
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // Save user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });
  }
}
