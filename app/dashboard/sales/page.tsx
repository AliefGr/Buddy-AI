import { SalesStatsRow } from "@/components/sales/SalesStatsRow";
import { SalesRevenueChart } from "@/components/sales/SalesRevenueChart";
import { SalesTable } from "@/components/sales/SalesTable";
import { SalesAiInsightCard } from "@/components/sales/SalesAiInsightCard";

export default function SalesPage() {
    return (
        <>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-buddy-text-main">Penjualan</h1>
                <p className="text-sm text-buddy-text-muted">
                    Pantau performa penjualan dan analisis revenue bisnis Anda
                </p>
            </div>

            {/* Stats */}
            <SalesStatsRow />

            {/* Chart + AI Insight */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
                <SalesRevenueChart />
                <SalesAiInsightCard />
            </div>

            {/* Sales Table */}
            <SalesTable />
        </>
    );
}
