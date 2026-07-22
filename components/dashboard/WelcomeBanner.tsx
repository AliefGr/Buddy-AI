"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SetupProgressData {
  completed: number;
  total: number;
  percentage: number;
}

export function WelcomeBanner() {
  const [data, setData] = useState<SetupProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Respect manual dismiss stored in session
    const wasDismissed = sessionStorage.getItem("welcome-banner-dismissed");
    if (wasDismissed === "true") {
      setDismissed(true);
      setLoading(false);
      return;
    }

    fetch("/api/setup-progress")
      .then((r) => r.json())
      .then((d: unknown) => {
        // Guard: only accept valid response shapes
        if (
          d &&
          typeof d === "object" &&
          "percentage" in d &&
          typeof (d as SetupProgressData).percentage === "number"
        ) {
          setData(d as SetupProgressData);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleDismiss() {
    sessionStorage.setItem("welcome-banner-dismissed", "true");
    setDismissed(true);
  }

  // Hide when dismissed or loading
  if (loading || dismissed) return null;

  // Hide when setup is complete
  if (!data || data.percentage === 100) return null;

  return (
    <div className="bg-gradient-to-r from-buddy-purple/10 to-blue-50 border border-buddy-purple/20 rounded-3xl p-4 sm:p-5 mb-4 lg:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Icon */}
      <div className="w-10 h-10 bg-buddy-purple/15 rounded-2xl flex items-center justify-center shrink-0">
        <span className="text-lg" role="img" aria-label="Selamat datang">
          🎉
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-buddy-text-main mb-0.5">
          Selamat datang di Buddy AI!
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Sebelum menggunakan seluruh fitur, selesaikan konfigurasi bisnis Anda.
        </p>
        <div className="flex items-center gap-3 mt-2">
          {/* Inline mini progress */}
          <div className="flex items-center gap-1.5">
            <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-buddy-purple h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${data.percentage}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
              {data.completed}/{data.total} langkah
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/dashboard/settings">
          <Button variant="primary" size="sm" className="rounded-xl whitespace-nowrap">
            Lanjutkan Setup
          </Button>
        </Link>
        <button
          onClick={handleDismiss}
          className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
          aria-label="Tutup banner"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
