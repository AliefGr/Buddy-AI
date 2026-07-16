import { AiSummaryCard } from "@/components/dashboard/AiSummaryCard";
import { RealtimeSalesCard } from "@/components/dashboard/RealtimeSalesCard";
import { KpiSection } from "@/components/dashboard/KpiSection";
import { SalesChartCard } from "@/components/dashboard/SalesChartCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { AiRecommendationCard } from "@/components/dashboard/AiRecommendationCard";
import { BestSellingCard } from "@/components/dashboard/BestSellingCard";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
    return (
        <>
            {/* Hero: AI Summary + Realtime Sales */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
                <AiSummaryCard />
                <RealtimeSalesCard />
            </div>

            {/* KPI Cards */}
            <KpiSection />

            {/* Sales Chart + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                <SalesChartCard />
                <RecentActivityCard />
            </div>

            {/* AI Recommendation + Best Selling */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mt-4 lg:mt-6">
                <AiRecommendationCard />
                <BestSellingCard />
            </div>

            {/* Quick Actions */}
            <QuickActions />
        </>
    );
}
