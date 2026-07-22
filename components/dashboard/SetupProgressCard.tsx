"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SetupStep {
  id: string;
  label: string;
  icon: string;
  done: boolean;
}

interface SetupProgressData {
  steps: SetupStep[];
  completed: number;
  total: number;
  percentage: number;
}

export function SetupProgressCard() {
  const [data, setData] = useState<SetupProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/setup-progress")
      .then((r) => r.json())
      .then((d: unknown) => {
        // Guard: only accept valid response shapes
        if (
          d &&
          typeof d === "object" &&
          "steps" in d &&
          Array.isArray((d as SetupProgressData).steps)
        ) {
          setData(d as SetupProgressData);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-buddy-purple/5 p-4 rounded-3xl mb-4 flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-buddy-purple animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const isComplete = data.percentage === 100;

  if (isComplete) {
    return (
      <div className="bg-green-50 p-4 rounded-3xl mb-4 text-center">
        <p className="text-2xl mb-1">🎉</p>
        <p className="text-xs font-bold text-green-800 mb-1">Selamat!</p>
        <p className="text-[10px] text-green-700 mb-3 leading-tight">
          Semua konfigurasi dasar telah selesai. Buddy AI siap membantu bisnis
          Anda.
        </p>
        <Link href="/dashboard">
          <Button variant="primary" size="sm" className="w-full justify-center rounded-xl">
            Lihat Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-buddy-purple/5 p-4 rounded-3xl mb-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🚀</span>
        <p className="text-xs font-bold text-buddy-text-main">Setup Bisnis</p>
      </div>

      {/* Description */}
      <p className="text-[10px] text-gray-500 mb-3 leading-tight">
        Selesaikan konfigurasi agar seluruh fitur Buddy AI dapat digunakan
        secara maksimal.
      </p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-gray-500">Progress</span>
          <span className="text-[10px] font-semibold text-buddy-purple">
            {data.completed}/{data.total} langkah
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-buddy-purple h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${data.percentage}%` }}
            role="progressbar"
            aria-valuenow={data.percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-right">
          {data.percentage}%
        </p>
      </div>

      {/* Checklist */}
      <ul className="space-y-1.5 mb-4">
        {data.steps.map((step) => (
          <li key={step.id} className="flex items-center gap-2">
            {step.done ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            )}
            <span
              className={`text-[10px] leading-tight ${step.done ? "text-green-700 line-through" : "text-gray-600"
                }`}
            >
              {step.icon} {step.label}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <Link href="/dashboard/settings">
        <Button variant="primary" size="sm" className="w-full justify-center rounded-xl">
          Lanjutkan Setup
        </Button>
      </Link>
    </div>
  );
}
