const BRANDS = [
  "Warung Kopi Nusantara",
  "Toko Batik Sejahtera",
  "UD Maju Bersama",
  "Olshop Cantik ID",
  "Dapur Bu Siti",
  "CV Berkah Jaya",
  "Toko Sembako Pak Budi",
  "Rumah Makan Sederhana",
];

export default function TrustedBy() {
  return (
    <section className="py-14 border-y border-gray-100 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
          Dipercaya lebih dari 10,000+ UMKM Indonesia
        </p>
      </div>
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {[...BRANDS, ...BRANDS].map((b, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 text-gray-300 text-sm font-medium shrink-0 hover:text-gray-500 transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-bold">
              {b[0]}
            </div>
            {b}
          </div>
        ))}
      </div>
    </section>
  );
}
