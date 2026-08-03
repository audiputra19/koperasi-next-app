import { cn } from "@/src/lib/cn";
import { InputKasirClient } from "./InputKasirClient";
import { MenuService } from "@/src/features/menu/menu.service";
import { getSession } from "@/src/lib/session";

export default async function InputKasir() {
    const [daftarPelanggan, daftarItem, session] = await Promise.all([
        MenuService.getDaftarPelanggan(),
        MenuService.getDaftarItems(),
        getSession(),
    ]);
    const user = session ? { nama: session.nama } : null;

    return (
        <main className={cn(
            "p-5 w-full flex justify-center"
        )}>
            <InputKasirClient 
                dataPelanggan={daftarPelanggan || []}
                dataItem={daftarItem || []} 
                initialUser={user}
            />
        </main>
    )
}