import { MenuService } from "@/src/features/menu/menu.service";
import DaftarSupplierClient from "./DaftarSupplierClient";
import { getSession } from "@/src/lib/session";

export default async function DaftarSupplierPage() {
    const session = await getSession();
    const [daftarSupplierRaw] = await Promise.all([
        MenuService.getDaftarSupplier(),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarSupplierClient 
                dataAwal={daftarSupplierRaw as []} 
                session={session}
            />
        </main>            
    );
}