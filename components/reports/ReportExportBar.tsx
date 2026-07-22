import { FileText, Table, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface MonthlyData {
    month: string;
    revenue: number;
    orders: number;
}

interface ReportExportBarProps {
    data: MonthlyData[];
}

function formatRupiah(n: number) {
    return n.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
}

export function ReportExportBar({ data }: ReportExportBarProps) {
    const exportToExcel = () => {
        if (data.length === 0) return;

        const worksheetData = data.map(row => ({
            Periode: row.month,
            Revenue: row.revenue,
            "Est. Pengeluaran": Math.round(row.revenue * 0.35),
            "Est. Profit": row.revenue - Math.round(row.revenue * 0.35),
            Transaksi: row.orders
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");
        XLSX.writeFile(workbook, `laporan-penjualan-${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const exportToPDF = () => {
        if (data.length === 0) return;

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Laporan Penjualan", 14, 20);
        doc.setFontSize(10);
        doc.text(`Tanggal Export: ${new Date().toLocaleDateString("id-ID")}`, 14, 28);

        const tableData = data.map(row => [
            row.month,
            formatRupiah(row.revenue),
            formatRupiah(Math.round(row.revenue * 0.35)),
            formatRupiah(row.revenue - Math.round(row.revenue * 0.35)),
            row.orders
        ]);

        autoTable(doc, {
            head: [["Periode", "Revenue", "Est. Pengeluaran", "Est. Profit", "Transaksi"]],
            body: tableData,
            startY: 35
        });

        doc.save(`laporan-penjualan-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-buddy-text-muted font-medium mr-1">Export:</span>
            <Button variant="ghost" size="sm" className="gap-2" onClick={exportToPDF} disabled={data.length === 0}>
                <FileText className="w-3.5 h-3.5 text-red-500" />
                PDF
            </Button>
            <Button variant="ghost" size="sm" className="gap-2" onClick={exportToExcel} disabled={data.length === 0}>
                <Table className="w-3.5 h-3.5 text-green-600" />
                Excel
            </Button>
            <Button variant="secondary" size="sm" className="gap-2" onClick={() => { exportToExcel(); exportToPDF(); }} disabled={data.length === 0}>
                <Download className="w-3.5 h-3.5" />
                Ekspor Semua
            </Button>
        </div>
    );
}
