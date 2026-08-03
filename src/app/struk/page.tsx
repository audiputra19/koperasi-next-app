"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { StrukPembayaran } from "@/src/components/struk/StrukPembayaran";
import { StrukData } from "@/src/types/struk";

const LOADING = "__LOADING__";
const MISSING = "__MISSING__";

function subscribe() {
    return () => {};
}

function getSnapshot() {
    return sessionStorage.getItem("struk-data") ?? MISSING;
}

function getServerSnapshot() {
    return LOADING;
}

export default function StrukPage() {
    const router = useRouter();
    const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const isLoading = raw === LOADING;
    const isMissing = raw === MISSING;

    let data: StrukData | null = null;
    let parseError = false;

    if (!isLoading && !isMissing) {
        try {
            data = JSON.parse(raw) as StrukData;
        } catch {
            parseError = true;
        }
    }

    const status: "loading" | "ready" | "error" = isLoading
        ? "loading"
        : isMissing || parseError
        ? "error"
        : "ready";

    useEffect(() => {
        if (status !== "ready") return;
        const timer = setTimeout(() => window.print(), 300);
        return () => clearTimeout(timer);
    }, [status]);

    // Kalau tab ini dibuka via window.open() (tab baru), tutup tab-nya.
    // Kalau dibuka langsung/navigasi biasa, arahkan ke /inputKasir.
    const handleKembali = () => {
        if (window.opener) {
            window.close();
        } else {
            router.push("/inputKasir");
        }
    };

    if (status === "error") {
        return (
            <div className="p-6 text-center text-sm text-gray-500 space-y-4">
                <p>Data struk tidak ditemukan. Silakan tutup tab ini dan coba lagi dari halaman kasir.</p>
                <button
                    onClick={handleKembali}
                    className="px-4 py-2 text-sm border border-base-300 rounded-lg hover:bg-base-200"
                >
                    Kembali
                </button>
            </div>
        );
    }

    if (status === "loading" || !data) {
        return (
            <div className="p-6 text-center text-sm text-gray-500">
                Memuat struk...
            </div>
        );
    }

    return (
        <div className="py-6">
            <StrukPembayaran data={data} />

            <div className="print-hidden flex justify-center gap-3 mt-4">
                <button
                    onClick={handleKembali}
                    className="px-4 py-2 text-sm border border-base-300 rounded-lg hover:bg-base-200"
                >
                    Kembali
                </button>
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 text-sm border border-base-300 rounded-lg hover:bg-base-200"
                >
                    Cetak Ulang
                </button>
            </div>

            <style jsx global>{`
                @media print {
                    .print-hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}