# TASK

Implementasikan Authentication yang lengkap untuk Buddy AI dengan menambahkan:

1. Login with Google (Google OAuth)
2. Register
3. Forgot Password + Reset Password

Gunakan arsitektur project yang sudah ada.

Stack:

- Next.js 16 App Router
- Auth.js (NextAuth v5)
- Prisma
- PostgreSQL
- TypeScript
- Tailwind CSS

Jangan mengubah design system maupun struktur project tanpa alasan.

---

# 1. LOGIN WITH GOOGLE

Tambahkan tombol:

"Continue with Google"

di halaman Login dan Register.

Gunakan Auth.js Google Provider (OAuth 2.0).

Flow:

User klik Continue with Google

↓

Redirect ke Google Login

↓

User memilih akun Google

↓

Google mengirim profile

↓

Cari user berdasarkan email

Jika user BELUM ADA:

- Buat User
- Buat Store
- Buat Business Settings default
- Buat Notification Settings default
- Login otomatis
- Redirect ke Dashboard (atau Onboarding jika diperlukan)

Jika user SUDAH ADA:

- Login langsung
- Redirect Dashboard

Gunakan email sebagai identifier.

Jangan membuat akun duplicate.

Pastikan session tetap menggunakan sistem Auth.js yang sudah ada.

Environment variable:

AUTH_GOOGLE_ID

AUTH_GOOGLE_SECRET

AUTH_SECRET

AUTH_URL

Jangan hardcode credential.

---

# 2. REGISTER

Perbaiki halaman Register.

Field:

- Full Name
- Business Name
- Email
- Password
- Confirm Password

Validasi:

- Semua field wajib
- Email harus unik
- Password minimal 8 karakter
- Password dan Confirm Password harus sama

Saat register berhasil:

- Simpan user ke database
- Hash password menggunakan bcrypt
- Buat Store otomatis
- Buat Business Settings default
- Buat Notification Settings default
- Login otomatis
- Redirect ke Dashboard atau Onboarding

Tambahkan:

- Loading state
- Disable button saat submit
- Toast sukses
- Toast error
- Validasi menggunakan Zod

---

# 3. FORGOT PASSWORD

Tambahkan halaman:

/forgot-password

Field:

Email

Flow:

User memasukkan email

↓

Generate reset token yang aman

↓

Simpan token ke database beserta waktu expired

↓

Kirim email reset menggunakan SMTP

↓

User klik link reset

↓

Masuk ke halaman Reset Password

Jangan pernah memberi tahu apakah email tersebut terdaftar atau tidak.

Selalu tampilkan pesan:

"Jika email terdaftar, kami telah mengirimkan link reset password."

---

# 4. RESET PASSWORD

Halaman:

/reset-password?token=...

Validasi:

- Token valid
- Token belum expired

Field:

Password Baru

Konfirmasi Password

Jika berhasil:

- Hash password baru menggunakan bcrypt
- Update password user
- Hapus token reset
- Redirect ke Login

---

# 5. UI

Gunakan komponen UI yang sudah ada.

Tambahkan:

- Loading spinner
- Disable button saat submit
- Error message
- Success toast
- Responsive
- Dark mode tetap berjalan

---

# 6. SECURITY

Gunakan:

- bcrypt untuk password
- crypto.randomBytes() untuk token reset
- Token expired 1 jam
- Validasi menggunakan Zod
- Jangan expose error internal
- Jangan hardcode credential

---

# 7. OUTPUT

Sebelum coding:

1. Audit authentication yang sudah ada.
2. Gunakan file existing jika memungkinkan.
3. Jangan membuat duplicate logic.

Hasil akhir yang diharapkan:

✅ Login Email
✅ Login with Google
✅ Register
✅ Forgot Password
✅ Reset Password
✅ Database terhubung
✅ Session tetap berjalan
✅ Production Ready