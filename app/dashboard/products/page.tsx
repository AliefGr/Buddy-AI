"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Download, Plus, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductStatsBar } from "@/components/products/ProductStatsBar";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductAiDrawer } from "@/components/products/ProductAiDrawer";
import type { Product } from "@/components/products/ProductTable";

interface Category {
    id: string;
    name: string;
    color: string | null;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const fetchProducts = useCallback(async (q = search, cat = categoryId) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (q) params.set("search", q);
            if (cat) params.set("categoryId", cat);
            const res = await fetch(`/api/products?${params}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.data);
                setPagination(data.pagination);
            }
        } finally {
            setLoading(false);
        }
    }, [search, categoryId]);

    useEffect(() => {
        fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => { });
        fetchProducts();
    }, []);

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        fetchProducts(search, categoryId);
    }

    function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setCategoryId(e.target.value);
        fetchProducts(search, e.target.value);
    }

    function handleOptimize(product: Product) {
        setSelectedProduct(product);
        setDrawerOpen(true);
    }

    async function handleDelete(product: Product) {
        if (!confirm(`Hapus produk "${product.name}"?`)) return;
        const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
        if (res.ok) fetchProducts();
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-buddy-text-main">Produk</h1>
                <p className="text-sm text-buddy-text-muted">Kelola seluruh produk bisnis Anda</p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative flex-1 min-w-60">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-buddy-text-subtle" />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field w-full pl-9 pr-4 py-2.5 bg-white border border-buddy-border rounded-xl text-sm text-buddy-text-main placeholder:text-buddy-text-subtle"
                    />
                </div>

                <Button type="submit" variant="ghost" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Cari
                </Button>

                <div className="relative">
                    <select
                        value={categoryId}
                        onChange={handleCategoryChange}
                        className="appearance-none bg-white border border-buddy-border rounded-xl text-sm text-buddy-text-muted py-2 pl-3 pr-8 focus:outline-none focus:border-buddy-purple focus:ring-2 focus:ring-buddy-purple/20"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-buddy-text-subtle pointer-events-none" />
                </div>

                <Button type="button" variant="ghost" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                </Button>

                <Button type="button" variant="primary" size="sm" className="gap-2" onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4" />
                    Tambah Produk
                </Button>
            </form>

            <ProductStatsBar />

            <ProductTable
                products={products}
                loading={loading}
                onOptimize={handleOptimize}
                onEdit={(p) => setEditProduct(p)}
                onDelete={handleDelete}
            />

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm text-buddy-text-muted">
                    <span>Menampilkan {products.length} dari {pagination.total} produk</span>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" disabled={pagination.page <= 1}>Sebelumnya</Button>
                        <span className="px-3 py-1.5 text-xs">{pagination.page} / {pagination.totalPages}</span>
                        <Button variant="ghost" size="sm" disabled={pagination.page >= pagination.totalPages}>Selanjutnya</Button>
                    </div>
                </div>
            )}

            <ProductAiDrawer
                product={selectedProduct}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />

            {showAddModal && (
                <AddProductModal
                    categories={categories}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => { setShowAddModal(false); fetchProducts(); }}
                />
            )}

            {editProduct && (
                <EditProductModal
                    product={editProduct}
                    onClose={() => setEditProduct(null)}
                    onSuccess={() => { setEditProduct(null); fetchProducts(); }}
                />
            )}
        </>
    );
}

function AddProductModal({ categories: initialCategories, onClose, onSuccess }: {
    categories: Category[];
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [categoryError, setCategoryError] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    async function handleAddCategory() {
        if (!newCategoryName.trim()) return;
        setCategoryLoading(true);
        setCategoryError("");
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategoryName.trim() }),
            });
            const json = await res.json();
            if (!res.ok) {
                setCategoryError(json.error ?? "Gagal membuat kategori");
                return;
            }
            setCategories(prev => [...prev, json].sort((a, b) => a.name.localeCompare(b.name)));
            setSelectedCategoryId(json.id);
            setNewCategoryName("");
            setShowNewCategory(false);
        } catch {
            setCategoryError("Terjadi kesalahan");
        } finally {
            setCategoryLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value,
            sku: (form.elements.namedItem("sku") as HTMLInputElement).value,
            categoryId: selectedCategoryId,
            price: parseInt((form.elements.namedItem("price") as HTMLInputElement).value) || 0,
            costPrice: parseInt((form.elements.namedItem("costPrice") as HTMLInputElement).value) || undefined,
            description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
        };
        if (!data.categoryId) {
            setError("Pilih atau buat kategori terlebih dahulu");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) { setError(json.error ?? "Gagal menambah produk"); return; }
            onSuccess();
        } catch { setError("Terjadi kesalahan"); }
        finally { setLoading(false); }
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                    <h2 className="font-bold text-buddy-text-main">Tambah Produk</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                    <div>
                        <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">Nama Produk *</label>
                        <input name="name" required className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" placeholder="Kopi Susu Gula Aren" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">SKU *</label>
                            <input name="sku" required className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" placeholder="KSG-001" />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold text-buddy-text-muted">Kategori *</label>
                                <button
                                    type="button"
                                    onClick={() => { setShowNewCategory(!showNewCategory); setCategoryError(""); }}
                                    className="text-[10px] text-buddy-purple font-semibold hover:underline"
                                >
                                    {showNewCategory ? "Batalkan" : "+ Buat Baru"}
                                </button>
                            </div>
                            {showNewCategory ? (
                                <div className="space-y-1.5">
                                    <div className="flex gap-1.5">
                                        <input
                                            value={newCategoryName}
                                            onChange={e => setNewCategoryName(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                                            placeholder="Nama kategori"
                                            className="flex-1 border border-buddy-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-buddy-purple"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddCategory}
                                            disabled={categoryLoading || !newCategoryName.trim()}
                                            className="px-3 py-2 bg-buddy-purple text-white text-xs font-semibold rounded-xl disabled:opacity-50 hover:bg-buddy-purple/90"
                                        >
                                            {categoryLoading ? "..." : "OK"}
                                        </button>
                                    </div>
                                    {categoryError && <p className="text-[10px] text-red-500">{categoryError}</p>}
                                </div>
                            ) : (
                                <select
                                    value={selectedCategoryId}
                                    onChange={e => setSelectedCategoryId(e.target.value)}
                                    className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple"
                                >
                                    <option value="">Pilih kategori...</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            )}
                            {selectedCategoryId && !showNewCategory && (
                                <p className="text-[10px] text-green-600 mt-1">
                                    ✓ {categories.find(c => c.id === selectedCategoryId)?.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">Harga Jual (Rp) *</label>
                            <input name="price" type="number" required min="0" className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" placeholder="28000" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">Harga Modal (Rp)</label>
                            <input name="costPrice" type="number" min="0" className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" placeholder="15000" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">Deskripsi</label>
                        <textarea name="description" rows={2} className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple resize-none" placeholder="Deskripsi produk..." />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={onClose}>Batal</Button>
                        <Button type="submit" variant="primary" size="sm" className="flex-1" loading={loading}>
                            {loading ? "Menyimpan..." : "Simpan Produk"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditProductModal({ product, onClose, onSuccess }: {
    product: Product;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price.toString());
    const [costPrice, setCostPrice] = useState((product.costPrice ?? "").toString());
    const [isActive, setIsActive] = useState(product.isActive);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    price: parseInt(price) || 0,
                    costPrice: costPrice ? parseInt(costPrice) : null,
                    isActive,
                }),
            });
            const json = await res.json();
            if (!res.ok) { setError(json.error ?? "Gagal update produk"); return; }
            onSuccess();
        } catch { setError("Terjadi kesalahan"); }
        finally { setLoading(false); }
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="font-bold text-buddy-text-main">Edit Produk</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                    <div>
                        <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">Nama Produk *</label>
                        <input value={name} onChange={e => setName(e.target.value)} required className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">Harga Jual (Rp)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">Harga Modal (Rp)</label>
                            <input type="number" value={costPrice} onChange={e => setCostPrice(e.target.value)} min="0" className="w-full border border-buddy-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-buddy-purple" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-buddy-purple" />
                        <label htmlFor="isActive" className="text-sm text-buddy-text-main">Produk aktif</label>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={onClose}>Batal</Button>
                        <Button type="submit" variant="primary" size="sm" className="flex-1" loading={loading}>
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
