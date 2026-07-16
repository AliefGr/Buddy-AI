import { InventoryStatsRow } from "@/components/inventory/InventoryStatsRow";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryAiCard } from "@/components/inventory/InventoryAiCard";

export default function InventoryPage() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-buddy-text-main">Inventory</h1>
                <p className="text-sm text-buddy-text-muted">
                    Pantau stok produk dan lakukan restock
                </p>
            </div>

            <InventoryStatsRow />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                <InventoryTable />
                <InventoryAiCard />
            </div>
        </>
    );
}
