# Belajar Vibe Code

Aplikasi backend sederhana yang dibangun menggunakan Bun, ElysiaJS, dan Drizzle ORM. Proyek ini mendemonstrasikan implementasi RESTful API dengan manajemen user, autentikasi berbasis token, dan pengujian unit.

## Teknologi Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Web Framework**: [ElysiaJS](https://elysiajs.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: MySQL (mendukung SQLite untuk testing lokal)
- **Language**: TypeScript

## Arsitektur Proyek

Proyek ini mengikuti struktur folder yang terorganisir untuk memisahkan tanggung jawab:

- `src/`: Folder utama kode sumber.
  - `routes/`: Definisi routing aplikasi (menggunakan ElysiaJS).
    - `users-route.ts`: Endpoint terkait user dan autentikasi.
  - `services/`: Logika bisnis aplikasi.
    - `users-service.ts`: Logika pendaftaran, pengambilan data user, dan logout.
  - `db.ts`: Konfigurasi koneksi database dan inisialisasi tabel.
  - `schema.ts`: Definisi skema tabel menggunakan Drizzle ORM.
  - `server.ts`: Entry point aplikasi.
  - `migrate.ts`: Script untuk menjalankan inisialisasi/migrasi database.
- `test/`: Folder berisi unit test.
  - `api.test.ts`: Pengujian unit untuk seluruh API menggunakan `bun:test`.

## Skema Database

### Tabel `users`
| Kolom | Tipe Data | Deskripsi |
|-------|-----------|-----------|
| `id` | `INT UNSIGNED` | Primary Key, Auto Increment |
| `name` | `VARCHAR(191)` | Nama lengkap user |
| `email` | `VARCHAR(191)` | Email unik user |
| `password` | `VARCHAR(255)` | Hash password (bcrypt) |
| `token` | `VARCHAR(255)` | Token sesi aktif |
| `created_at`| `TIMESTAMP` | Waktu pembuatan data |

## Cara Setup Project

### 1. Prasyarat
Pastikan Anda sudah menginstal [Bun](https://bun.sh/) di sistem Anda.

### 2. Instalasi Dependensi
Jalankan perintah berikut di direktori root proyek:
```bash
bun install
```

### 3. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:
```bash
cp .env.example .env
```

Isi file `.env`:
```env
MYSQL_URL=mysql://user:password@localhost:3306/nama_db
PORT=3000
```

### 4. Setup Database (MySQL)
Pastikan server MySQL Anda berjalan, lalu jalankan script inisialisasi tabel:
```bash
bun run migrate
```

## Cara Menjalankan Aplikasi

### Mode Pengembangan (Development)
Menjalankan aplikasi dengan mode hot-reload:
```bash
bun run dev
```

### Mode Produksi
```bash
bun run start
```

Aplikasi akan berjalan di `http://localhost:3000` (atau port yang didefinisikan di `.env`).

## API Endpoints

### Autentikasi & User (di bawah prefix `/api`)
- `POST /api/users`: Registrasi user baru.
- `GET /api/users/current`: Mendapatkan data user yang sedang login (membutuhkan Bearer Token).
- `DELETE /api/users/logout`: Logout user dan menghapus token (membutuhkan Bearer Token).

### CRUD User (di server utama)
- `GET /`: Status server.
- `GET /health`: Health check.
- `GET /users`: List semua user.
- `GET /users/:id`: Mendapatkan user berdasarkan ID.
- `PUT /users/:id`: Memperbarui data user.
- `DELETE /users/:id`: Menghapus user.

## Cara Menjalankan Unit Test

Proyek ini menggunakan `bun:test` untuk pengujian. Test dijalankan terhadap instance aplikasi tanpa perlu menjalankan server secara manual.

Untuk menjalankan seluruh test:
```bash
bun test
```

Untuk menjalankan test dengan environment khusus:
```bash
NODE_ENV=test bun test
```
