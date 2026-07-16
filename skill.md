# 🗺️ AI Buddy UMKM — Development Roadmap

> **Target:** Menyelesaikan MVP AI Buddy UMKM sebelum deadline IDCamp Developer Challenge.
>
> Prinsip utama:
>
> - ✅ Selesaikan **satu modul hingga benar-benar selesai**
> - ❌ Jangan mengerjakan semua menu secara bersamaan
> - ✅ Fokus pada fitur yang memiliki alur bisnis lengkap (End-to-End)

---

# 📊 Progress Saat Ini

| Modul                | Status |
|----------------------|--------|
| UI / Design System   | ✅ 100% |
| Database Schema      | ✅ 100% |
| Prisma + Supabase    | ⏳ 80% — schema siap, migration belum dijalankan |
| Authentication UI    | ✅ 95% — UI selesai, backend belum |
| Dashboard UI         | ✅ 100% — UI selesai, data masih dummy |
| Backend Auth         | ⏳ 0% |
| Backend CRUD         | ⏳ 0% |
| AI Integration       | ⏳ 0% |
| Deployment           | ⏳ 0% |

---

# 📦 Dependencies

## Sudah Terpasang

- `next` 16.2.10
- `react` 19.2.4
- `@prisma/client` + `prisma` 7.8.0
- `tailwindcss` 4
- `lucide-react`
- `clsx`, `tailwind-merge`

## Perlu Install

```bash
npm install next-auth@beta bcryptjs zod @google/generative-ai
npm install -D @types/bcryptjs
```

---

# 🏗️ Sprint 0 — Authentication (PRIORITAS SEKARANG)

Status: � Backend belum ada

> Semua route backend membutuhkan `storeId` dari session.
> Auth harus selesai sebelum CRUD apapun dimulai.

## Langkah

1. Jalankan migration Prisma
   ```bash
   npx prisma migrate dev --name init
   ```
2. Setup NextAuth v5 (`auth.ts`, `app/api/auth/[...nextauth]/route.ts`)
3. API Register — buat User + Store sekaligus
4. Login dengan credentials (email + password)
5. Middleware — proteksi semua route `/dashboard/*`
6. Logout

## Checklist

- [x] Login UI
- [x] Register UI
- [ ] Prisma migration dijalankan
- [ ] `lib/auth.ts` — NextAuth config
- [ ] `app/api/auth/[...nextauth]/route.ts`
- [ ] `app/api/auth/register/route.ts` — POST register
- [ ] `lib/session.ts` — helper `getSession()` dan `requireAuth()`
- [ ] `middleware.ts` — redirect ke login kalau belum auth
- [ ] Logout berfungsi dari Sidebar
- [ ] Forgot Password (bisa skip untuk MVP)
- [ ] Google OAuth (bisa skip untuk MVP)

---

# 📦 Sprint 1 — Product Management

Status: 🔴 Menunggu Sprint 0

## Halaman

`/dashboard/products`

## Checklist

### Category

- [ ] `GET /api/categories` — list
- [ ] `POST /api/categories` — create
- [ ] `PATCH /api/categories/[id]` — edit
- [ ] `DELETE /api/categories/[id]` — delete

### Product

- [ ] `GET /api/products` — list + search + filter + pagination
- [ ] `POST /api/products` — create
- [ ] `GET /api/products/[id]` — detail
- [ ] `PATCH /api/products/[id]` — edit
- [ ] `DELETE /api/products/[id]` — delete
- [ ] Connect ProductTable ke API (hapus dummy data)
- [ ] Image upload (bisa pakai Supabase Storage)

### AI

- [ ] AI Score — generate via Gemini saat produk dibuat/diedit
- [ ] AI Optimize drawer

---

# 📦 Sprint 2 — Inventory

Status: 🔴 Menunggu Sprint 1

## Halaman

`/dashboard/inventory`

## Checklist

- [ ] `GET /api/inventory` — list stok
- [ ] `POST /api/inventory/restock` — tambah stok (create StockMovement IN)
- [ ] `GET /api/inventory/[id]/movements` — riwayat pergerakan stok
- [ ] Auto-update `status` (NORMAL / LOW / EMPTY) saat stok berubah
- [ ] Auto-update `lastRestockedAt` saat restock
- [ ] Connect InventoryTable ke API

---

# 📦 Sprint 3 — Customer

Status: 🔴 Menunggu Sprint 2

## Halaman

`/dashboard/customers`

## Checklist

- [ ] `GET /api/customers` — list + search
- [ ] `POST /api/customers` — create
- [ ] `GET /api/customers/[id]` — detail + order history
- [ ] `PATCH /api/customers/[id]` — edit
- [ ] `DELETE /api/customers/[id]` — delete
- [ ] Auto-update `tier` berdasarkan `totalSpent`
- [ ] Connect CustomerTable ke API

---

# 📦 Sprint 4 — Sales / Orders

Status: � Menunggu Sprint 3

## Halaman

`/dashboard/sales`

## Checklist

- [ ] `GET /api/orders` — list + filter
- [ ] `POST /api/orders` — create order + kurangi stok + update customer stats
- [ ] `GET /api/orders/[id]` — detail + items
- [ ] `PATCH /api/orders/[id]/status` — update status
- [ ] `DELETE /api/orders/[id]` — cancel (restore stok)
- [ ] Auto-generate `orderNumber`
- [ ] Connect SalesTable ke API

---

# 📦 Sprint 5 — Dashboard Real Data

Status: � Menunggu Sprint 4

## Halaman

`/dashboard`

## Checklist

- [ ] `GET /api/dashboard/kpi` — total revenue, orders, customers, produk aktif
- [ ] `GET /api/dashboard/sales-chart` — data chart 7/30/365 hari
- [ ] `GET /api/dashboard/best-selling` — top 5 produk
- [ ] `GET /api/dashboard/recent-orders` — 5 order terakhir
- [ ] `GET /api/dashboard/low-stock` — produk stok rendah
- [ ] Connect semua KPI card & chart ke API

---

# 📦 Sprint 6 — Analytics

Status: � Menunggu Sprint 5

## Halaman

`/dashboard/analytics`

## Checklist

- [ ] `GET /api/analytics/revenue` — revenue breakdown per periode
- [ ] `GET /api/analytics/top-products` — produk terlaris
- [ ] `GET /api/analytics/customers` — pertumbuhan pelanggan
- [ ] Connect semua chart ke API

---

# 📦 Sprint 7 — Reports

Status: � Menunggu Sprint 6

## Halaman

`/dashboard/reports`

## Checklist

- [ ] `GET /api/reports/monthly` — laporan bulanan dari Order
- [ ] Export PDF (pakai `jspdf` atau `html2canvas`)
- [ ] Export Excel (pakai `xlsx`)

---

# 📦 Sprint 8 — Gemini AI Integration

Status: � Menunggu Sprint 5

## Checklist

- [ ] Setup `lib/gemini.ts` — init `@google/generative-ai`
- [ ] `POST /api/ai/daily-brief` — generate ringkasan harian
- [ ] `POST /api/ai/product-score` — scoring + rekomendasi produk
- [ ] `POST /api/ai/inventory-insight` — prediksi stok habis
- [ ] `POST /api/ai/marketing` — generate caption, hashtag, deskripsi
- [ ] Cache hasil AI di tabel `AiInsight`
- [ ] Connect AI Summary card di Dashboard

---

# 📦 Sprint 9 — AI Assistant

Status: � Menunggu Sprint 8

## Halaman

`/dashboard/ai-assistant`

## Checklist

- [ ] `POST /api/ai/chat` — chat dengan context bisnis
- [ ] Simpan history di `AiConversation`
- [ ] Kirim data relevan (sales, stok, pelanggan) sebagai context ke Gemini
- [ ] Connect AiConversation component ke API

---

# 📦 Sprint 10 — Campaign, Broadcast, Daily Brief

Status: � Menunggu Sprint 9

## Checklist

### Campaign

- [ ] `GET /api/campaigns` — list
- [ ] `POST /api/campaigns` — create (manual + AI generated)
- [ ] `PATCH /api/campaigns/[id]` — edit
- [ ] `DELETE /api/campaigns/[id]` — delete

### Broadcast

- [ ] `GET /api/broadcasts` — list
- [ ] `POST /api/broadcasts` — create + schedule
- [ ] Simulasi kirim (update `sentAt`, `recipients`, `failedCount`)

### Daily Brief

- [ ] `GET /api/daily-brief` — agenda hari ini + AI summary
- [ ] `POST /api/agenda` — tambah agenda

---

# 📦 Sprint 11 — Settings

Status: � Menunggu Sprint 0

## Halaman

`/dashboard/settings`

## Checklist

### Profile

- [ ] `GET /api/user/profile` — get data user
- [ ] `PATCH /api/user/profile` — edit nama, avatar

### Store

- [ ] `GET /api/store` — get info toko
- [ ] `PATCH /api/store` — edit nama, currency, timezone

### Security

- [ ] `POST /api/user/change-password` — ganti password

---

# 🔗 Alur Bisnis (Business Flow)

## Product Flow

```text
Tambah Produk
        │
        ▼
Masuk Database
        │
        ▼
Muncul di Product List
        │
        ▼
Dapat Dipilih Saat Penjualan
        │
        ▼
Mengurangi Stok → update lastRestockedAt
        │
        ▼
Dashboard Update
        │
        ▼
Analytics Update
        │
        ▼
AI Insight
```

## Sales Flow

```text
Buat Order
        │
        ▼
Hitung Total
        │
        ▼
Simpan Order
        │
        ▼
Kurangi Stok (StockMovement OUT)
        │
        ▼
Update Customer.totalSpent + lastOrderAt
        │
        ▼
Tambah Revenue → Dashboard Update
```

## AI Flow

```text
Data Penjualan + Stok + Pelanggan
        │
        ▼
Kirim sebagai context ke Gemini API
        │
        ▼
Generate Insight
        │
        ▼
Cache di AiInsight (tipe: Json)
        │
        ▼
Dashboard AI Summary + AI Assistant
```

---

# 🎯 Target Demo

Saat demo, aplikasi harus mampu menunjukkan alur lengkap berikut:

1. Login sebagai pemilik UMKM.
2. Menambahkan produk baru beserta kategori.
3. Melakukan transaksi penjualan.
4. Stok produk otomatis berkurang.
5. Dashboard menampilkan data real (bukan dummy).
6. Analytics memperlihatkan grafik penjualan.
7. AI Assistant memberikan insight berdasarkan data nyata.
8. Marketing AI menghasilkan caption promosi untuk produk.
9. Laporan dapat diekspor ke PDF atau Excel.
10. Seluruh aplikasi dapat diakses melalui website yang telah dideploy.
