Prompt untuk AI Agent
Tujuan

Hapus kartu "Upgrade ke Pro" pada sidebar/dashboard dan ganti menjadi "Setup Bisnis" (Business Setup Card).

Alasan perubahan:

Aplikasi ini belum memiliki sistem subscription atau paket Pro.
Untuk MVP/Hackathon, kartu "Upgrade ke Pro" membingungkan pengguna.
Kartu baru harus membantu pengguna menyelesaikan konfigurasi awal aplikasi agar semua fitur dapat digunakan.
Desain yang diinginkan

Judul:

🚀 Setup Bisnis

Deskripsi:

Selesaikan konfigurasi berikut agar seluruh fitur Buddy AI dapat digunakan secara maksimal.

Progress Bar:

Hitung progress secara otomatis berdasarkan checklist yang sudah selesai.

Contoh:

Progress
3 / 6 langkah selesai
██████░░░░ 50%
Checklist Setup

Tampilkan checklist berikut.

1. Profil Bisnis

Status selesai jika:

Nama toko sudah diisi
Alamat sudah diisi
Nomor telepon sudah diisi

Icon:

🏪 2. Tambah Kategori Produk

Status selesai jika minimal terdapat 1 kategori.

Icon

📂 3. Tambah Produk

Status selesai jika minimal terdapat 1 produk.

Icon

📦 4. Tambah Pelanggan

Status selesai jika minimal terdapat 1 pelanggan.

Icon

👥 5. Hubungkan WhatsApp

Status selesai jika konfigurasi WhatsApp Business sudah tersimpan.

Icon

💬 6. Hubungkan Email

Status selesai jika konfigurasi SMTP sudah lengkap.

Icon

✉️
Cara menghitung progress

Jumlah langkah selesai / total langkah.

Contoh:

0/6 = 0%

3/6 = 50%

6/6 = 100%

Progress harus dihitung secara otomatis dari data database, bukan hardcoded.

Tombol

Jika progress belum 100%

Tampilkan tombol

[Lanjutkan Setup]

Klik tombol akan membuka halaman:

/dashboard/settings

Jika progress sudah 100%

Ubah menjadi

🎉 Selamat!

Semua konfigurasi dasar telah selesai.

Buddy AI siap membantu bisnis Anda.

Tombol berubah menjadi

[Lihat Dashboard]
Data

Jangan menggunakan data hardcoded.

Ambil data dari API/database:

Store Profile
Categories
Products
Customers
WhatsApp Integration
Email Integration
UI

Gunakan style yang konsisten dengan dashboard.

Card
Rounded
Shadow
Progress Bar
Checklist dengan icon
Warna hijau untuk item selesai
Warna abu untuk item belum selesai
Acceptance Criteria
Hapus seluruh komponen "Upgrade ke Pro".
Tidak boleh ada teks "Upgrade".
Progress dihitung otomatis.
Checklist berubah otomatis saat data berubah.
Tidak ada nilai hardcoded.
Responsive.
Menggunakan TypeScript.
Menggunakan API yang sudah ada bila memungkinkan.
Jika API belum tersedia (misalnya integrasi WhatsApp atau SMTP), siapkan struktur agar mudah dihubungkan nanti tanpa mengubah UI lagi.

Dengan prompt ini AI Agent akan memahami bukan hanya perubahan tampilan, tetapi juga logika bisnis, sumber data, dan kriteria implementasi yang jelas.

============
Tujuan:

Tambahkan onboarding pertama kali setelah pengguna berhasil register atau login.

Flow:

1. Setelah register berhasil, redirect ke Dashboard.

2. Cek apakah setup bisnis sudah selesai.

3. Jika belum selesai:
   - Tampilkan Welcome Banner di bagian atas Dashboard.
   - Tampilkan Setup Progress Card.
   - Jangan blokir pengguna menggunakan aplikasi.

4. Banner berisi:

🎉 Selamat datang di Buddy AI!

Sebelum menggunakan seluruh fitur, selesaikan konfigurasi bisnis Anda.

Progress:
0/6 langkah selesai

Button:
[Lanjutkan Setup]

5. Tombol membuka:
   /dashboard/settings

6. Progress dihitung otomatis dari database berdasarkan:
   - Profil bisnis
   - Kategori
   - Produk
   - Pelanggan
   - Integrasi WhatsApp
   - Integrasi Email

7. Jika progress mencapai 100%:
   - Banner otomatis disembunyikan.
   - Card Setup tidak lagi ditampilkan.
   - Dashboard tampil normal.

8. Jangan gunakan data hardcoded.
9. Gunakan TypeScript dan komponen reusable.
10. UI harus konsisten dengan desain dashboard Buddy AI.
