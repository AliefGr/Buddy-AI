import { Edit2, Trash2, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export interface Product {
    id: string;
    sku: string;
    name: string;
    category: { id: string; name: string; color: string | null };
    price: number;
    costPrice: number | null;
    imageUrl: string | null;
    isActive: boolean;
    aiScore: number | null;
    inventory: { currentStock: number; status: string } | null;
    _count: { orderItems: number };
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
}

function AiScoreBadge({ score }: { score: number | null }) {
    if (score === null) return <span className="text-xs text-gray-400">—</span>;
    if (score >= 90)
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">{score} Excellent</span>;
    if (score >= 75)
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">{score} Good</span>;
    if (score >= 60)
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">{score} Fair</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">{score} Poor</span>;
}

function StockCell({ inventory }: { inventory: Product["inventory"] }) {
    const stock = inventory?.currentStock ?? 0;
    if (stock === 0) return <span className="text-red-500 font-semibold text-sm">Habis</span>;
    if (stock < 20) return <span className="text-amber-500 font-semibold text-sm">{stock}</span>;
    return <span className="text-buddy-text-main font-semibold text-sm">{stock}</span>;
}

interface ProductTableProps {
    products: Product[];
    loading?: boolean;
    onOptimize: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export function ProductTable({ products, loading, onOptimize, onEdit, onDelete }: ProductTableProps) {
    return (
        <Card padding="none" overflow>
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-buddy-text-main">Daftar Produk</h3>
            </div>
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-16 gap-2 text-buddy-text-muted">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Memuat produk...</span>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2 text-buddy-text-muted">
                        <p className="text-sm font-medium">Belum ada produk</p>
                        <p className="text-xs">Tambah produk pertama Anda</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produk</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stok</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Harga</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Penjualan</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI Score</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-lg overflow-hidden">
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-gray-400 text-xs font-bold">{product.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-buddy-text-main text-sm">{product.name}</p>
                                                <p className="text-[10px] text-buddy-text-subtle">{product.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                            style={{
                                                backgroundColor: product.category.color ? `${product.category.color}20` : undefined,
                                                color: product.category.color ?? undefined,
                                            }}
                                        >
                                            {product.category.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <StockCell inventory={product.inventory} />
                                    </td>
                                    <td className="px-4 py-4 font-semibold text-buddy-text-main">
                                        {formatRupiah(product.price)}
                                    </td>
                                    <td className="px-4 py-4 text-buddy-text-muted">{product._count.orderItems}x</td>
                                    <td className="px-4 py-4">
                                        <AiScoreBadge score={product.aiScore} />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm" className="p-2 h-8 w-8" onClick={() => onEdit(product)}>
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(product)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="secondary" size="sm" className="gap-1 text-[10px] h-7 px-2" onClick={() => onOptimize(product)}>
                                                <Sparkles className="w-3 h-3" />
                                                AI
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Card>
    );
}
