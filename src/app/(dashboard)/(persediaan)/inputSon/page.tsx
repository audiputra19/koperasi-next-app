import { cn } from "@/src/lib/cn";
import { MenuService } from "@/src/features/menu/menu.service";
import { getSession } from "@/src/lib/session";
import { InputSonClient } from "./InputSonClient";

export default async function InputSonPage() {
    const [itemData, session] = await Promise.all([
        MenuService.getDaftarItems(),
        getSession(),
    ]);

    return (
        <main className={cn(
            "p-5 w-full flex justify-center"
        )}>
            <InputSonClient
                itemData={itemData || []}
                session={session}
            />
        </main>
    );
}