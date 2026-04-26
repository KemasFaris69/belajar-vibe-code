import mysql from "mysql2/promise";

const passwords = ["", "root", "password", "admin", "123456", "mysql"];
const users = ["root", "admin"];

async function testConnection() {
  for (const u of users) {
    for (const p of passwords) {
      try {
        const conn = await mysql.createConnection({
          host: "localhost",
          user: u,
          password: p
        });
        console.log(`Success! User: ${u}, Password: ${p}`);
        await conn.end();
        return;
      } catch (e) {
        // ignore
      }
    }
  }
  console.log("Failed to connect with any common password.");
}

testConnection();
