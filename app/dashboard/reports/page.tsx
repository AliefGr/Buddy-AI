import { ReportStatsRow } from "@/components/reports/ReportStatsRow";
import { ReportTable } from "@/components/reports/ReportTable";
import { ReportExportBar } from "@/components/reports/ReportExportBar";
import { ReportAiSummary } from "@/components/reports/ReportAiSummary";

export default function ReportsPage() {
    return (
        <>
            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-buddy-text-main">Laporan</h1>
                    <p className="text-sm text-buddy-text-muted">
                        Laporan keuangan dan performa bisnis bulanan
                    </p>
                </div>
                <ReportExportBar />
            </div>

            {/* Stats */}
            <ReportStatsRow />

            {/* Table + AI Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                <ReportTable />
                <ReportAiSummary />
            </div>
        </>
    );
}
