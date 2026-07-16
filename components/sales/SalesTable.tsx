"use client";

import { useState, useEffect } from "react";
import { Loader2, ShoppingCart, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: { name: string };
}

interface Order {
    id: string;
    orderNumber: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    paymentMethod: "CASH" | "QRIS" | "TRANSFER";
    subtotal: number;
    discount: number;
    total: number;
    notes: string | null;
    createdAt: string;
    customer: { id: string; name: string } | null;
    items: OrderItem[];
}

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    inventory: { currentStock: number } | null;
}

interface Customer {
    id: string;
    name: string;
}

const statusStyle = {
    COMPLETED: { label: "Lunas", className: "bg-green-100 text-green-700" },
    CONFIRMED: { label: "Dikonfirmasi", className: "bg-blue-100 text-blue-700" },
    PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700" },
    CANCELLED: { label: "Batal", className: "bg-red-100 text-red-600" },
};

const paymentLabel = { CASH: "Tunai", QRIS: "QRIS", TRANSFER: "Transfer" };

function formatRupiah(n: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(n);
}

interface CreateOrderModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

function CreateOrderModal({ onClose, onSuccess }: CreateOrderModalProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [items, setItems] = useState<{ productId: string; quantity: number }[]>([
        { productId: "", quantity: 1 },
    ]);
    const [customerId, setCustomerId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QRIS" | "TRANSFER">("CASH");
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/products?limit=100")
            .then(r => r.json())
            .then(d => setProducts(d.data ?? []))
            .catch(() => { });
        fetch("/api/customers")
            .then(r => r.json())
            .then(setCustomers)
            .catch(() => { });
    }, []);

    const subtotal = items.reduce((sum, item) => {
        const p = products.find(pr => pr.id === item.productId);
        return sum + (p ? p.price * item.quantity : 0);
    }, 0);
    const total = Math.max(0, subtotal - discount);

    function addItem() {
        setItems(prev => [...prev, { productId: "", quantity: 1 }]);
    }
    function removeItem(idx: number) {
        setItems(prev => prev.filter((_, i) => i !== idx));
    }
    function updateItem(idx: number, field: "productId" | "quantity", value: string | number) {
        setItems(prev => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validItems = items.filter(i => i.productId && i.quantity > 0);
        if (validItems.length === 0) {
            setError("Tambahkan minimal 1 produk");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: customerId || undefined,
                    paymentMethod,
                    discount,
                    notes,
                    items: validItems,
                }),
            });
            const json = await res.json();
            if (!res.ok) {
                setError(json.error ?? "Gagal membuat order");
                return;
            }
            onSuccess();
        } catch {
            setError("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                    <h2 className="font-bold text-buddy-text-main">Buat Order Baru</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">
                            Pelanggan (opsional)
                        </label>
                        <select
                            value={customerId}
                            onChange={e => setCustomerId(e.target.value)}
                            className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple"
                        >
                            <option value="">Walk-in (tanpa pelanggan)</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-buddy-text-muted">Produk *</label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-[10px] text-buddy-purple font-semibold hover:underline flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Tambah Item
                            </button>
                        </div>
                        <div className="space-y-2">
                            {items.map((item, idx) => {
                                const selectedProduct = products.find(p => p.id === item.productId);
                                return (
                                    <div key={idx} className="flex gap-2 items-start">
                                        <select
                                            value={item.productId}
                                            onChange={e => updateItem(idx, "productId", e.target.value)}
                                            className="flex-1 border border-buddy-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-buddy-purple"
                                        >
                                            <option value="">Pilih produk...</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} — {formatRupiah(p.price)} (stok: {p.inventory?.currentStock ?? 0})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={e => updateItem(idx, "quantity", parseInt(e.target.value) || 1)}
                                            min="1"
                                            max={selectedProduct?.inventory?.currentStock ?? 999}
                                            className="w-20 border border-buddy-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-buddy-purple text-center"
                                        />
                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(idx)}
                                                className="p-2 text-red-400 hover:text-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">
                                Metode Bayar
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={e => setPaymentMethod(e.target.value as "CASH" | "QRIS" | "TRANSFER")}
                                className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple"
                            >
                                <option value="CASH">Tunai</option>
                                <option value="QRIS">QRIS</option>
                                <option value="TRANSFER">Transfer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">
                                Diskon (Rp)
                            </label>
                            <input
                                type="number"
                                value={discount}
                                onChange={e => setDiscount(parseInt(e.target.value) || 0)}
                                min="0"
                                className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">
                            Catatan
                        </label>
                        <input
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple"
                            placeholder="Catatan order..."
                        />
                    </div>

                    <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
                        <div className="flex justify-between text-sm">
                            <span className="text-buddy-text-muted">Subtotal</span>
                            <span className="font-semibold">{formatRupiah(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-buddy-text-muted">Diskon</span>
                                <span className="text-red-500 font-semibold">-{formatRupiah(discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm border-t border-gray-200 pt-1.5">
                            <span className="font-bold text-buddy-text-main">Total</span>
                            <span className="font-bold text-buddy-purple">{formatRupiah(total)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" size="sm" className="flex-1" loading={loading}>
                            {loading ? "Memproses..." : "Buat Order"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function SalesTable() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    async function fetchOrders() {
        setLoading(true);
        try {
            const res = await fetch("/api/orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data.data ?? []);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <>
            <Card padding="none" overflow>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-buddy-text-main">Riwayat Transaksi</h3>
                        <p className="text-xs text-buddy-text-muted mt-0.5">{orders.length} transaksi</p>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setShowCreate(true)}
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Buat Order
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-16 gap-2 text-buddy-text-muted">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Memuat transaksi...</span>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-2 text-buddy-text-muted">
                            <ShoppingCart className="w-8 h-8 opacity-30" />
                            <p className="text-sm font-medium">Belum ada transaksi</p>
                            <Button
                                variant="primary"
                                size="sm"
                                className="mt-2 gap-1.5"
                                onClick={() => setShowCreate(true)}
                            >
                                <Plus className="w-3.5 h-3.5" /> Buat Order Pertama
                            </Button>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["Invoice", "Pelanggan", "Items", "Tanggal", "Total", "Pembayaran", "Status"].map(
                                        h => (
                                            <th
                                                key={h}
                                                className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                                            >
                                                {h}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map(order => {
                                    const s = statusStyle[order.status];
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-buddy-purple font-semibold">
                                                {order.orderNumber}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-buddy-text-main">
                                                {order.customer?.name ?? "Walk-in"}
                                            </td>
                                            <td className="px-6 py-4 text-buddy-text-muted text-xs">
                                                {order.items.length} item
                                            </td>
                                            <td className="px-6 py-4 text-buddy-text-muted text-xs">
                                                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-buddy-text-main">
                                                {formatRupiah(order.total)}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-buddy-text-muted">
                                                {paymentLabel[order.paymentMethod]}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${s.className}`}
                                                >
                                                    {s.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            {showCreate && (
                <CreateOrderModal
                    onClose={() => setShowCreate(false)}
                    onSuccess={() => {
                        setShowCreate(false);
                        fetchOrders();
                    }}
                />
            )}
        </>
    );
}
