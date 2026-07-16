import { AnalyticsAiSummary } from "@/components/analytics/AnalyticsAiSummary";
import { AnalyticsRevenueChart } from "@/components/analytics/AnalyticsRevenueChart";
import { AnalyticsTopProducts } from "@/components/analytics/AnalyticsTopProducts";
import { AnalyticsCustomerHeatmap } from "@/components/analytics/AnalyticsCustomerHeatmap";
import { AnalyticsGrowthMetrics } from "@/components/analytics/AnalyticsGrowthMetrics";

export default function AnalyticsPage() {
    return (
        <>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-buddy-text-main">Analytics</h1>
                <p className="text-sm text-buddy-text-muted">
                    Analisis mendalam performa bisnis dengan AI
                </p>
            </div>

            {/* AI Summary Banner */}
            <AnalyticsAiSummary />

            {/* Revenue Chart + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
                <AnalyticsRevenueChart />
                <AnalyticsTopProducts />
            </div>

            {/* Heatmap + Growth Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                <AnalyticsCustomerHeatmap />
                <AnalyticsGrowthMetrics />
            </div>
        </>
    );
}
