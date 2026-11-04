import { MenuService } from "@/src/features/menu/menu.service";
import BelanjaClient from "./BelanjaClient";
import { getSession } from "@/src/lib/session";

export default async function Belanja() {
    const session = await getSession();
    const daftarItemRaw = await MenuService.getDaftarItems();

    const dataAwal = daftarItemRaw.filter((item) => Number(item.stok) > 0);

    return (
        <main className="p-5 w-full flex justify-center">
            <BelanjaClient dataAwal={dataAwal} session={session} />
        </main>
    );
}