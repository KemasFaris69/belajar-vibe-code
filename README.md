# Belajar Vibe Code

Backend starter project using Bun, Elysia, Drizzle ORM, and MySQL.

## Install

1. Copy environment settings to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

## Run

```bash
bun run src/server.ts
```

## Database setup

Set `MYSQL_URL` in `.env` to a valid MySQL connection string, for example:

```env
MYSQL_URL=mysql://root:password@127.0.0.1:3306/belajar_vibe_code
```

Then initialize the schema:

```bash
bun run src/migrate.ts
```

## API Endpoints

- `GET /health` - health check
- `GET /users` - list users
- `GET /users/:id` - get user by ID
- `POST /users` - create user
- `PUT /users/:id` - update user
- `DELETE /users/:id` - delete user

## Notes

- This project uses `drizzle-orm` with `mysql2`.
- The server is built with ElysiaJS and runs on Bun.
