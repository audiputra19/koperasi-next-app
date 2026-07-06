import { MenuService } from "@/src/features/menu/menu.service";
import DaftarItemClient from "./DaftarItemClient";

export default async function DaftarItemPage() {
    const [daftarItemRaw] = await Promise.all([
        MenuService.getDaftarItems(),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarItemClient dataAwal={daftarItemRaw as []} />
        </main>            
    );
}