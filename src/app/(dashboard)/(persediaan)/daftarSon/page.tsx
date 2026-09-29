import { SonService } from "@/src/features/persediaan/persediaan.service";
import DaftarSonClient from "./DaftarSonClient";
import { getSession } from "@/src/lib/session";

export default async function DaftarSonPage() {
    const [sonListRaw, session] = await Promise.all([
        SonService.getDaftarSon(),
        getSession(),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarSonClient
                initialData={sonListRaw || []}
                session={session}
            />
        </main>
    );
}