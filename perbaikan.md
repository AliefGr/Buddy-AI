Berikan prompt ini:

Vercel deployment gagal dengan error:

Module "@prisma/client" has no exported member "Prisma".

Project menggunakan:

- Prisma 7.8.0
- @prisma/client 7.8.0

Lakukan audit pada file:

app/api/ai/chat/route.ts

Tugas:

1. Cari semua import:

```ts
import type { Prisma } from "@prisma/client";
Jika import tersebut tidak benar-benar diperlukan, hapus.
Gunakan type inference dari Prisma.
Jangan menggunakan any.
Pastikan callback map/filter/reduce memiliki tipe yang benar tanpa mengimpor namespace Prisma yang tidak tersedia.
Tambahkan script:
"postinstall": "prisma generate"

ke package.json apabila belum ada.

Jalankan kembali:
npm run build

Perbaiki semua TypeScript error sampai build berhasil.

Jangan menonaktifkan strict mode.
Jangan menggunakan ignoreBuildErrors.


---

## Saya yakin 90% penyebabnya ada di file itu

Kalau kamu kirim **`app/api/ai/chat/route.ts`**, saya bisa langsung menunjukkan **baris mana yang harus dihapus atau diubah** sehingga kemungkinan besar build berikutnya akan lolos.