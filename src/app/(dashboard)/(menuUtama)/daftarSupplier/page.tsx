import { MenuService } from "@/src/features/menu/menu.service";
import DaftarSupplierClient from "./DaftarSupplierClient";

export default async function DaftarSupplierPage() {
    const [daftarSupplierRaw] = await Promise.all([
        MenuService.getDaftarSupplier(),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarSupplierClient dataAwal={daftarSupplierRaw as []} />
        </main>            
    );
}