import LandingPage from "@/components/landing/LandingPage";

export const metadata = {
  title: "Buddy AI — AI Business Assistant untuk UMKM Indonesia",
  description:
    "Kelola penjualan, pelanggan, stok, laporan, dan pemasaran dalam satu dashboard dengan bantuan AI.",
  openGraph: {
    title: "Buddy AI — AI Business Assistant untuk UMKM Indonesia",
    description:
      "Kelola penjualan, pelanggan, stok, laporan, dan pemasaran dalam satu dashboard dengan bantuan AI.",
    type: "website",
  },
};

export default function RootPage() {
  return <LandingPage />;
}
