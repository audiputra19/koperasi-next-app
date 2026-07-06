import { cn } from "@/src/lib/cn";
import { InputKasirClient } from "./InputKasirClient";
import { MenuService } from "@/src/features/menu/menu.service";
import { getSession } from "@/src/lib/session";

export default async function InputKasir() {
    const daftarPelanggan = await MenuService.getDaftarPelanggan();
    const daftarItem = await MenuService.getDaftarItems();
    const session = await getSession();
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