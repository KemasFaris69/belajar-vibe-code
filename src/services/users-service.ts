import { db } from "../db.ts";
import { users } from "../schema.ts";
import { eq } from "drizzle-orm";
import { randomUUIDv7 } from "bun";

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

    // Generate token
    const token = randomUUIDv7();

    // Save user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      token,
    });

    return { token };
  }

  static async getCurrentUser(token: string) {
    if (!token) {
      throw new Error("Unauthorized");
    }

    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.token, token));

    if (result.length === 0) {
      throw new Error("Unauthorized");
    }

    return result[0];
  }
}
