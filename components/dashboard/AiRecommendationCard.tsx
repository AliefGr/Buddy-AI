import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

export function AiRecommendationCard() {
    return (
        <Card className="col-span-1 lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-buddy-purple" />
                <h3 className="font-bold text-buddy-text-main">Rekomendasi AI</h3>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2TqavCuEAOIC5RmHEx01mTMC7pVNXb4bycEtZARa6vP1chwBOb3KMwA1T49QIi0AElTCMTDIhFOol70IGt6r7yeqHwFY4MVWlFvTP8vmV2AMbcneLdGRmdqbipfWXGXWW6pwwbU6_is-_OQgKfbWG6rBrPKDTxaSvr19l3IaxX-4EwXS2BuY4qiOTNdNmHYgB2E0GSbOU_1xJWBsfWenW3Ej2j4UqLkQlGF7kLb_LVSLsnqNTqMTRBA"
                        alt="Product Recommend"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        unoptimized
                    />
                </div>
                <div>
                    <p className="text-xs font-bold text-buddy-purple mb-1 uppercase tracking-tight">
                        Strategi Bundling
                    </p>
                    <h4 className="text-sm font-bold text-buddy-text-main mb-2">
                        Buat promo bundling Kopi Susu Gula Aren + Cookies
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                        Berdasarkan data penjualan, bundling ini berpotensi meningkatkan omzet hingga 18%.
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-auto">
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-buddy-purple" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                </div>
                <Button variant="secondary" size="sm">
                    Terapkan Sekarang
                </Button>
            </div>
        </Card>
    );
}
