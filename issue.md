# Planning: User Registration API

## Tujuan
Buat perencanaan implementasi fitur registrasi user baru pada backend Bun + Elysia + Drizzle + MySQL. Dokumen ini ditujukan untuk junior programmer atau AI berbiaya murah.


## Scope
- Buat tabel `users` di database MySQL.
- Buat endpoint `POST /api/users` untuk registrasi user baru.
- Validasi email unik dan simpan password dalam bentuk hash bcrypt.
- Susun kode dengan struktur `src/routes` dan `src/services`.

## Database
Buat tabel `users` dengan kolom:
- `id` integer auto increment
- `name` varchar(255) not null
- `email` varchar(255) not null
- `password` varchar(255) not null (simpan hash bcrypt)
- `created_at` timestamp default current_timestamp

## API Endpoint
Endpoint yang dibuat:
- `POST /api/users`

Request body:
```json
{
  "name": "Eko",
  "email": "eko@localhost",
  "password": "rahasia"
}
```

Response success:
```json
{
  "data": "OK"
}
```

Response error:
```json
{
  "error": "email sudah terdaftar"
}
```

## Struktur Folder
- `src/routes` : berisi routing ElysiaJS
- `src/services` : berisi logic bisnis aplikasi

Struktur file:
- `src/routes/users-route.ts`
- `src/services/users-service.ts`

## Langkah Implementasi
1. Siapkan model database:
   - Tambahkan definisi tabel `users` ke schema Drizzle.
   - Pastikan kolom `email` diindeks sebagai unik.
2. Buat service bisnis:
   - `src/services/users-service.ts`
   - Buat fungsi untuk memeriksa apakah email sudah terdaftar.
   - Buat fungsi untuk melakukan hash password menggunakan bcrypt.
   - Buat fungsi untuk menyimpan user baru ke tabel.
3. Buat routing Elysia:
   - `src/routes/users-route.ts`
   - Definisikan route `POST /api/users`.
   - Ambil body request dan validasi format dasar.
   - Panggil service bisnis untuk registrasi user.
   - Kembalikan response success atau error sesuai kondisi.
4. Integrasi dan konfigurasi:
   - Tambahkan route baru ke server utama (`src/server.ts`).
   - Pastikan `dotenv` memuat `MYSQL_URL` dan konfigurasi database.
   - Reuse koneksi database yang sudah ada.
5. Uji fungsional:
   - Uji request `POST /api/users` dengan email baru.
   - Uji kembali dengan email yang sudah ada untuk memastikan response error.
6. Dokumentasi singkat:
   - Tambahkan catatan cara menjalankan server dan menambahkan `MYSQL_URL`.
   - Jelaskan bahwa password harus di-hash dengan bcrypt sebelum disimpan.

## Catatan untuk implementor
- Gunakan logika sederhana dan fokus pada alur utama.
- Jangan masuk ke detail tingkat rendah seperti pemrosesan header HTTP yang kompleks.
- Buat code yang mudah dibaca, dengan pemisahan jelas antara routing dan business logic.
- Usahakan agar AI murah atau junior programmer dapat mengikuti langkah ini tanpa banyak improvisasi.


