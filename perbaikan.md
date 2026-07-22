# TASK

Lakukan audit dan perbaikan seluruh TypeScript error yang menyebabkan build gagal di Vercel.

Jangan hanya memperbaiki satu baris kode.

Cari akar masalahnya dan pastikan project dapat di-build dengan sukses menggunakan:

```bash
npm run build
```

---

# ERROR SAAT INI

Vercel Build Error:

```
Type error:

./app/api/ai/chat/route.ts:68:42

Parameter 'p' implicitly has an 'any' type.

const topProductIds = topProducts.map((p) => p.productId);
```

Build gagal pada tahap:

```
Running TypeScript...
```

Bukan saat compile.

---

# TUJUAN

Saya ingin project benar-benar lolos:

- TypeScript Check
- Next.js Build
- Vercel Deployment

Tanpa mengorbankan type safety.

---

# YANG HARUS DILAKUKAN

## 1. Audit file

Periksa:

```
app/api/ai/chat/route.ts
```

Cari asal variabel:

```
topProducts
```

Identifikasi:

- berasal dari query Prisma?
- berasal dari raw query?
- berasal dari array biasa?
- apakah tipenya hilang?

---

## 2. Jangan gunakan implicit any

Jangan gunakan:

```ts
(p)
```

atau

```ts
(item)
```

tanpa tipe.

Gunakan tipe yang benar.

Misalnya:

```ts
(p: PrismaType)
```

atau

```ts
type TopProduct = {
  productId: string | null;
}

const topProducts: TopProduct[] = ...
```

Gunakan tipe Prisma jika sudah tersedia.

Jangan menggunakan `any` kecuali benar-benar tidak ada alternatif.

---

## 3. Audit seluruh file

Jangan berhenti setelah memperbaiki satu error.

Lanjutkan audit seluruh project.

Cari:

- implicit any
- unknown
- nullable
- optional chaining yang salah
- Prisma typing
- callback map/filter/reduce
- async return type
- Promise typing

Pastikan tidak ada lagi TypeScript Error.

---

## 4. Jalankan Build

Setelah selesai lakukan pengecekan dengan:

```bash
npm run build
```

Jika masih gagal,

lanjutkan memperbaiki semua error berikutnya.

Jangan berhenti sampai build sukses.

---

## 5. Jangan menurunkan kualitas TypeScript

DILARANG:

❌ menonaktifkan TypeScript

❌ skipLibCheck untuk menyembunyikan error project

❌ strict = false

❌ noImplicitAny = false

❌ ignoreBuildErrors = true

Saya ingin TypeScript tetap strict.

---

## 6. Pertahankan Arsitektur

Jangan mengubah:

- struktur folder
- API
- Prisma Schema
- Business Logic

Hanya perbaiki typing.

---

# OUTPUT

Berikan laporan:

## Error yang ditemukan

- File
- Baris
- Penyebab

## Solusi

Kode sebelum

↓

Kode sesudah

↓

Alasan perubahan

Kemudian lanjutkan sampai:

```
✓ TypeScript passed

✓ npm run build berhasil

✓ Siap deploy ke Vercel
```

Target akhirnya adalah project Buddy AI berhasil di-deploy ke Vercel tanpa TypeScript error.