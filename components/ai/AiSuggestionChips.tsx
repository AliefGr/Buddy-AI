"use client";

const chips = [
    { label: "📈 Revenue bulan ini", query: "Analisis revenue bulan ini" },
    { label: "📦 Status stok", query: "Bagaimana kondisi stok saya saat ini?" },
    { label: "📣 Ide marketing", query: "Berikan ide marketing untuk minggu ini" },
    { label: "👥 Analisis pelanggan", query: "Analisis pola pembelian pelanggan saya" },
    { label: "🛒 Penjualan minggu ini", query: "Ringkasan penjualan minggu ini" },
];

interface AiSuggestionChipsProps {
    onSelect: (query: string) => void;
}

export function AiSuggestionChips({ onSelect }: AiSuggestionChipsProps) {
    return (
        <div className="flex flex-wrap gap-2 justify-center">
            {chips.map((chip) => (
                <button
                    key={chip.label}
                    onClick={() => onSelect(chip.query)}
                    className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full text-xs font-medium text-buddy-text-muted hover:text-buddy-purple hover:border-buddy-purple/30 hover:bg-buddy-purple/5 transition-all shadow-sm"
                >
                    {chip.label}
                </button>
            ))}
        </div>
    );
}
