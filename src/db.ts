import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

const mysqlUrl = process.env.MYSQL_URL ?? "mysql://root:password@127.0.0.1:3306/belajar_vibe_code";
const pool = mysql.createPool(mysqlUrl);
export const db = drizzle(pool);

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      email VARCHAR(191) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}
