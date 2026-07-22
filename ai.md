# Task: Replace Gemini with Groq AI Provider

## Background

Saat ini project menggunakan Google Gemini (`@google/generative-ai`) sebagai provider AI.

Namun Gemini sering mengembalikan error:

- 503 UNAVAILABLE
- High demand
- Model overload

Karena project akan digunakan untuk demo hackathon, saya ingin mengganti seluruh provider AI menjadi Groq agar lebih stabil.

Targetnya adalah mengganti provider saja, tanpa mengubah fitur yang sudah ada.

---

## Tujuan

Migrasikan seluruh fitur AI dari Gemini ke Groq.

Semua endpoint AI harus tetap bekerja seperti sebelumnya.

Fitur yang harus tetap berfungsi:

- AI Assistant
- AI Marketing
- AI Daily Brief
- AI Summary
- AI Insight
- AI Writer Broadcast

Output yang dihasilkan tetap sama, hanya provider AI yang berubah.

---

## Yang harus dilakukan

### 1. Install dependency

Install:

```bash
npm install groq-sdk
```

---

### 2. Environment Variable

Hapus dependency terhadap:

```
GEMINI_API_KEY
```

Ganti menjadi:

```
GROQ_API_KEY=
```

Pastikan seluruh project membaca environment variable baru tersebut.

---

### 3. Refactor AI Service

Saat ini terdapat file seperti:

```
lib/gemini.ts
```

Refactor menjadi:

```
lib/ai.ts
```

Tujuannya agar project tidak bergantung pada nama provider tertentu.

Semua route AI nantinya hanya mengimpor:

```ts
import { generateText, isAIConfigured } from "@/lib/ai";
```

Bukan lagi:

```ts
import { generateText } from "@/lib/gemini";
```

---

### 4. Gunakan Groq SDK

Implementasikan menggunakan package resmi:

```
groq-sdk
```

Gunakan model:

```
llama-3.3-70b-versatile
```

Apabila model tersebut tidak tersedia, gunakan model Groq terbaru yang setara.

---

### 5. Pertahankan API Existing

Jangan mengubah contract API.

Endpoint berikut harus tetap sama:

```
/api/ai/chat
/api/ai/marketing
/api/ai/daily-brief
/api/ai/summary
```

Frontend tidak boleh perlu diubah.

---

### 6. Error Handling

Tambahkan error handling yang baik.

Jika Groq gagal:

- tampilkan log yang jelas
- return status 500
- tampilkan pesan

```
AI sedang sibuk, silakan coba beberapa saat lagi.
```

Jangan menampilkan stack trace ke frontend.

---

### 7. Logging

Tambahkan logging sederhana.

Contoh:

```
[Groq]
Model:
Latency:
Token Usage:
```

Agar mudah debugging.

---

### 8. Jangan Mengubah

Jangan mengubah:

- Prisma
- Database
- Auth
- Session
- Middleware
- UI
- Business Logic

Yang berubah hanya provider AI.

---

## Hasil Akhir

Saya ingin:

✅ Semua fitur AI tetap berjalan

✅ Provider berubah dari Gemini menjadi Groq

✅ Semua route tetap sama

✅ Frontend tidak perlu diubah

✅ Tidak ada lagi import dari `@google/generative-ai`

✅ Semua menggunakan `groq-sdk`

---

## Setelah selesai

Berikan laporan:

- File yang diubah
- File baru
- Dependency baru
- Environment variable baru
- Hal yang perlu saya lakukan (misalnya menambahkan `GROQ_API_KEY`)
- Apakah ada breaking changes atau tidak