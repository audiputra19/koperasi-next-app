import { MenuService } from "@/src/features/menu/menu.service";
import DaftarItemClient from "./DaftarItemClient";
import { getSession } from "@/src/lib/session";

export default async function DaftarItemPage() {
    const session = await getSession();
    const [daftarItemRaw] = await Promise.all([
        MenuService.getDaftarItems(),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarItemClient 
                dataAwal={daftarItemRaw as []} 
                session={session}
            />
        </main>            
    );
}