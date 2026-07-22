"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  FolderOpen,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface Category {
  id: string;
  name: string;
  color: string | null;
  createdAt: Date;
  _count: { products: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: categories.length,
    totalProducts: categories.reduce(
      (sum, cat) => sum + cat._count.products,
      0,
    ),
    empty: categories.filter((cat) => cat._count.products === 0).length,
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Hapus kategori "${category.name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-buddy-text-main">Kategori</h1>
        <p className="text-sm text-buddy-text-muted">
          Kelola kategori produk Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card padding="md" className="flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              Total Kategori
            </p>
            <p className="text-2xl font-bold text-buddy-text-main">
              {stats.total}
            </p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              Total Produk
            </p>
            <p className="text-2xl font-bold text-buddy-text-main">
              {stats.totalProducts}
            </p>
          </div>
        </Card>
        <Card padding="md" className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              Tanpa Produk
            </p>
            <p className="text-2xl font-bold text-buddy-text-main">
              {stats.empty}
            </p>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-buddy-text-subtle" />
          <Input
            type="text"
            placeholder="Cari kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          className="gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </Button>
      </div>

      <Card padding="none" overflow>
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-buddy-text-muted">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Memuat kategori...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-buddy-text-muted">
            <p className="text-sm font-medium">
              {search ? "Kategori tidak ditemukan" : "Belum ada kategori"}
            </p>
            {!search && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddModal(true)}
              >
                Buat Kategori Pertama
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Nama Kategori
                  </th>
                  <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Jumlah Produk
                  </th>
                  <th className="text-right px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: category.color
                              ? `${category.color}20`
                              : "#f3f4f6",
                          }}
                        >
                          <span
                            className="text-xs font-bold"
                            style={{
                              color: category.color || "#6b7280",
                            }}
                          >
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-buddy-text-main">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-buddy-text-muted">
                      {category._count.products} produk
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 h-8 w-8"
                          onClick={() => setEditCategory(category)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(category)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showAddModal && (
        <CategoryModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchCategories();
          }}
        />
      )}

      {editCategory && (
        <CategoryModal
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSuccess={() => {
            setEditCategory(null);
            fetchCategories();
          }}
        />
      )}
    </>
  );
}

function CategoryModal({
  category,
  onClose,
  onSuccess,
}: {
  category?: Category;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(category?.name || "");
  const [color, setColor] = useState(category?.color || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const presetColors = [
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        category ? `/api/categories/${category.id}` : "/api/categories",
        {
          method: category ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, color: color || null }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Terjadi kesalahan");
        return;
      }

      onSuccess();
    } catch (e) {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-buddy-text-main">
            {category ? "Edit Kategori" : "Tambah Kategori"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">
              Nama Kategori *
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama kategori"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-buddy-text-muted mb-1.5">
              Warna (opsional)
            </label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c === color ? "" : c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    color === c
                      ? "border-gray-800 scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Pilih warna ${c}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="flex-1"
              loading={loading}
            >
              {loading
                ? "Menyimpan..."
                : category
                  ? "Simpan Perubahan"
                  : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Missing import fix
import { X } from "lucide-react";
