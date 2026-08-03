import { MenuService } from "@/src/features/menu/menu.service";
import { cn } from "@/src/lib/cn";
import { getSession } from "@/src/lib/session";
import { InputPembelianClient } from "./inputPembelianClient";

export default async function InputPembelian() {
    const [daftarSupplier, daftarItem, session] = await Promise.all([
        MenuService.getDaftarSupplier(),
        MenuService.getDaftarItems(),
        getSession(),
    ]);
    const user = session ? { nama: session.nama } : null;

    return (
        <main className={cn(
            "p-5 w-full flex justify-center"
        )}>
            <InputPembelianClient 
                dataSupplier={daftarSupplier || []}
                dataItem={daftarItem || []}
                initialUser={user}
            />
        </main>
    )
}