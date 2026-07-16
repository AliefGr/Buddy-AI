"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Loader2, Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface InventoryItem {
    id: string;
    sku: string;
    currentStock: number;
    minStock: number;
    unit: string;
    status: "NORMAL" | "LOW" | "EMPTY";
    lastRestockedAt: string | null;
    product: {
        id: string;
        name: string;
        sku: string;
        category: { name: string; color: string | null };
        isActive: boolean;
    };
}

const statusMap = {
    NORMAL: { label: "Normal", className: "bg-green-100 text-green-700" },
    LOW: { label: "Rendah", className: "bg-amber-100 text-amber-700" },
    EMPTY: { label: "Habis", className: "bg-red-100 text-red-600" },
};

interface RestockModalProps {
    item: InventoryItem;
    onClose: () => void;
    onSuccess: () => void;
}

function RestockModal({ item, onClose, onSuccess }: RestockModalProps) {
    const [qty, setQty] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const quantity = parseInt(qty);
        if (!quantity || quantity <= 0) { setError("Masukkan jumlah yang valid"); return; }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/inventory/restock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inventoryItemId: item.id, quantity, note }),
            });
            const json = await res.json();
            if (!res.ok) { setError(json.error ?? "Gagal restock"); return; }
            onSuccess();
        } catch { setError("Terjadi kesalahan"); }
        finally { setLoading(false); }
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-buddy-text-main">Restock Stok</h3>
                    <p className="text-sm text-buddy-text-muted mt-1">{item.product.name}</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-sm text-buddy-text-muted">Stok saat ini</span>
                        <span className="font-bold text-buddy-text-main">{item.currentStock} {item.unit}</span>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">
                            Jumlah Tambah ({item.unit}) *
                        </label>
                        <input
                            type="number"
                            value={qty}
                            onChange={e => setQty(e.target.value)}
                            min="1"
                            required
                            autoFocus
                            className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple"
                            placeholder="Contoh: 50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">Catatan</label>
                        <input
                            type="text"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple"
                            placeholder="Dari supplier X..."
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={onClose}>Batal</Button>
                        <Button type="submit" variant="primary" size="sm" className="flex-1" loading={loading}>
                            {loading ? "Menyimpan..." : "Tambah Stok"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function InventoryTable() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);

    async function fetchInventory() {
        setLoading(true);
        try {
            const res = await fetch("/api/inventory");
            if (res.ok) setItems(await res.json());
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchInventory(); }, []);

    return (
        <>
            <Card padding="none" overflow className="col-span-1 lg:col-span-8">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-buddy-text-main">Status Inventory</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-buddy-text-muted">{items.length} item</span>
                        <button onClick={fetchInventory} className="p-1.5 rounded-lg hover:bg-gray-100 text-buddy-text-muted" title="Refresh">
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-16 gap-2 text-buddy-text-muted">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Memuat inventory...</span>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-2 text-buddy-text-muted">
                            <Package className="w-8 h-8 opacity-30" />
                            <p className="text-sm font-medium">Belum ada inventory</p>
                            <p className="text-xs">Tambah produk untuk melihat inventory</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["Produk", "Stok Saat Ini", "Stok Minimum", "Terakhir Restock", "Status", "Aksi"].map((h) => (
                                        <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.map((item) => {
                                    const s = statusMap[item.status];
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-buddy-text-main">{item.product.name}</p>
                                                <p className="text-[10px] text-buddy-text-subtle">{item.product.sku}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${item.currentStock === 0 ? "text-red-500" : item.currentStock < item.minStock ? "text-amber-500" : "text-buddy-text-main"}`}>
                                                    {item.currentStock} {item.unit}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-buddy-text-muted">{item.minStock} {item.unit}</td>
                                            <td className="px-6 py-4 text-xs text-buddy-text-muted">
                                                {item.lastRestockedAt
                                                    ? new Date(item.lastRestockedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${s.className}`}>{s.label}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button variant="secondary" size="sm" className="text-[10px] h-7 px-3 gap-1" onClick={() => setRestockItem(item)}>
                                                    <RefreshCw className="w-3 h-3" />
                                                    Restock
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            {restockItem && (
                <RestockModal
                    item={restockItem}
                    onClose={() => setRestockItem(null)}
                    onSuccess={() => { setRestockItem(null); fetchInventory(); }}
                />
            )}
        </>
    );
}
