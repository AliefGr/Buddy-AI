import { FileText, Table, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ReportExportBar() {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-buddy-text-muted font-medium mr-1">Export:</span>
            <Button variant="ghost" size="sm" className="gap-2">
                <FileText className="w-3.5 h-3.5 text-red-500" />
                PDF
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
                <Table className="w-3.5 h-3.5 text-green-600" />
                Excel
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
                <Download className="w-3.5 h-3.5" />
                Ekspor Semua
            </Button>
        </div>
    );
}
