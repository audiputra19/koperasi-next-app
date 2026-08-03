import { cn } from "@/src/lib/cn";
import { InputKasirClient } from "./InputKasirClient";
import { MenuService } from "@/src/features/menu/menu.service";
import { getSession } from "@/src/lib/session";

export default async function InputKasir() {
    console.time("pelanggan");
    console.time("item");
    console.time("session");

     const [daftarPelanggan, daftarItem, session] = await Promise.all([
        MenuService.getDaftarPelanggan().finally(() => console.timeEnd("pelanggan")),
        MenuService.getDaftarItems().finally(() => console.timeEnd("item")),
        getSession().finally(() => console.timeEnd("session")),
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