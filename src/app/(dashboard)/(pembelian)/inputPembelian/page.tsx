import { MenuService } from "@/src/features/menu/menu.service";
import { cn } from "@/src/lib/cn";
import { InputPembelianClient } from "./inputPembelianClient";
import { getSession } from "@/src/lib/session";
import { PembelianService } from "@/src/features/pembelian/pembelian.service";

export default async function InputPembelian() {
    const daftarSupplier = await MenuService.getDaftarSupplier();
    const daftarItem = await MenuService.getDaftarItems();
    const session = await getSession();
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