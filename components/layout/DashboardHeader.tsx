"use client";

import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  Loader2,
  Package,
  Users,
  ShoppingCart,
  Megaphone,
  Radio,
  X,
  Trash2,
  Check,
  Inbox,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  onMenuOpen?: () => void;
}

interface SearchResult {
  products: Array<{ id: string; name: string; sku: string }>;
  customers: Array<{
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    createdAt: Date;
  }>;
  campaigns: Array<{ id: string; name: string; status: string }>;
  broadcasts: Array<{
    id: string;
    title: string;
    channel: string;
    status: string;
  }>;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function getGreetingTime() {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat pagi";
  if (hour < 18) return "Selamat siang";
  return "Selamat malam";
}

function getTimeAgo(date: Date | string) {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs} detik yang lalu`;
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "STOCK_LOW":
      return <Package className="w-5 h-5 text-orange-600" />;
    case "NEW_ORDER":
      return <ShoppingCart className="w-5 h-5 text-green-600" />;
    case "CAMPAIGN_ENDED":
      return <Megaphone className="w-5 h-5 text-pink-600" />;
    case "AI_COMPLETE":
      return <Radio className="w-5 h-5 text-purple-600" />;
    default:
      return <Inbox className="w-5 h-5 text-gray-600" />;
  }
}

function getNotificationBg(type: string) {
  switch (type) {
    case "STOCK_LOW":
      return "bg-orange-50";
    case "NEW_ORDER":
      return "bg-green-50";
    case "CAMPAIGN_ENDED":
      return "bg-pink-50";
    case "AI_COMPLETE":
      return "bg-purple-50";
    default:
      return "bg-gray-50";
  }
}

export function DashboardHeader({ onMenuOpen }: DashboardHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    avatarUrl?: string | null;
    storeName?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    if (showNotificationDropdown) {
      fetchNotifications();
    }
  }, [showNotificationDropdown]);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowSearchDropdown(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setSearching(true);
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(searchQuery)}`,
          );
          if (res.ok) {
            setSearchResults(await res.json());
            setShowSearchDropdown(true);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults(null);
        setShowSearchDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdowns
  const handleClickOutside = (e: MouseEvent) => {
    // Search dropdown
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(e.target as Node)
    ) {
      const dropdown = document.getElementById("search-dropdown");
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    // Notification dropdown
    if (
      notificationButtonRef.current &&
      !notificationButtonRef.current.contains(e.target as Node) &&
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(e.target as Node)
    ) {
      setShowNotificationDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (url: string) => {
    router.push(url);
    setSearchQuery("");
    setSearchResults(null);
    setShowSearchDropdown(false);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="flex justify-between items-center mb-6 lg:mb-8 sticky top-0 z-30 bg-buddy-bg/80 backdrop-blur-sm py-2">
      {/* Left: hamburger (mobile) + greeting */}
      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuOpen}
          className="lg:hidden w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center shrink-0"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <div>
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900 leading-tight">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </span>
            ) : (
              `${getGreetingTime()}, ${user?.name || "Pengguna"} 👋`
            )}
          </h1>
          <p className="text-gray-500 text-xs lg:text-sm hidden sm:block">
            {user?.storeName || "Kelola bisnis Anda hari ini"}
          </p>
        </div>
      </div>

      {/* Right: search (hidden on mobile) + actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Search — hidden on small screens */}
        <div className="relative hidden md:block w-56 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults && setShowSearchDropdown(true)}
            placeholder="Cari produk, pelanggan, order..."
            className="w-full pl-10 pr-9 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm outline-none transition-all"
          />
          {searching ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          ) : searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          ) : null}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 border border-gray-200 font-mono hidden lg:block">
            Ctrl K
          </span>

          {showSearchDropdown && searchResults && (
            <div
              id="search-dropdown"
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
            >
              {searchResults.products.length > 0 && (
                <div className="p-2">
                  <h3 className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase">
                    Produk
                  </h3>
                  {searchResults.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleResultClick("/dashboard/products")}
                    >
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.customers.length > 0 && (
                <div className="p-2 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase">
                    Pelanggan
                  </h3>
                  {searchResults.customers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleResultClick("/dashboard/customers")}
                    >
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.email || customer.phone || "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.orders.length > 0 && (
                <div className="p-2 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase">
                    Order
                  </h3>
                  {searchResults.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleResultClick("/dashboard/orders")}
                    >
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          Rp {order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.campaigns.length > 0 && (
                <div className="p-2 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase">
                    Campaign
                  </h3>
                  {searchResults.campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleResultClick("/dashboard/campaigns")}
                    >
                      <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                        <Megaphone className="w-4 h-4 text-pink-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {campaign.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {campaign.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.broadcasts.length > 0 && (
                <div className="p-2 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase">
                    Broadcast
                  </h3>
                  {searchResults.broadcasts.map((broadcast) => (
                    <div
                      key={broadcast.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => handleResultClick("/dashboard/broadcasts")}
                    >
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                        <Radio className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {broadcast.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {broadcast.channel} · {broadcast.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.products.length === 0 &&
                searchResults.customers.length === 0 &&
                searchResults.orders.length === 0 &&
                searchResults.campaigns.length === 0 &&
                searchResults.broadcasts.length === 0 && (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500">
                      Tidak ada hasil ditemukan
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Notification */}
        <div className="relative">
          <button
            ref={notificationButtonRef}
            onClick={() =>
              setShowNotificationDropdown(!showNotificationDropdown)
            }
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 relative"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </span>
            )}
          </button>

          {showNotificationDropdown && (
            <div
              ref={notificationDropdownRef}
              className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-[500px] flex flex-col"
            >
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {notificationsLoading ? (
                  <div className="p-6 flex justify-center">
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Tidak ada notifikasi
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? "bg-blue-50/30" : ""}`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getNotificationBg(notification.type)}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            <button
                              onClick={(e) =>
                                deleteNotification(notification.id, e)
                              }
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Trash2 className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {getTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 10 && (
                <div className="p-3 border-t border-gray-100">
                  <button
                    onClick={() => router.push("/dashboard/notifications")}
                    className="w-full text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    Lihat semua notifikasi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help — hidden on mobile */}
        <button
          onClick={() => router.push("/dashboard/help")}
          className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hidden sm:flex"
          aria-label="Bantuan"
        >
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-50 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center cursor-pointer"
          aria-label="Profil pengguna"
          onClick={() => router.push("/dashboard/settings")}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Profil"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-purple-600">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "U"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
