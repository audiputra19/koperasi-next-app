import { Fragment } from "react";
import { StrukData } from "@/src/types/struk";

export function StrukPembayaran({ data }: { data: StrukData }) {
    const tanggalFormatted = new Date(data.tanggal).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return (
        <div className="struk-container">
            <h2>BUKTI PEMBAYARAN</h2>
            <p className="center">{tanggalFormatted}</p>
            <div className="divider" />

            <table>
                <tbody>
                    <tr><td>Pelanggan</td><td className="right">{data.pelanggan}</td></tr>
                    <tr><td>Kasir</td><td className="right">{data.kasir}</td></tr>
                    <tr><td>Metode</td><td className="right">{data.metode}</td></tr>
                </tbody>
            </table>

            <div className="divider" />

            <table>
                <tbody>
                    {data.items.map((item, idx) => (
                        <Fragment key={idx}>
                            <tr>
                                <td colSpan={3} className="item-name">{item.namaItem}</td>
                            </tr>
                            <tr>
                                <td>{item.jumlah} x Rp {item.harga.toLocaleString("id-ID")}</td>
                                <td></td>
                                <td className="right">Rp {(item.jumlah * item.harga).toLocaleString("id-ID")}</td>
                            </tr>
                        </Fragment>
                    ))}
                </tbody>
            </table>

            <div className="divider" />

            <table>
                <tbody>
                    <tr className="total-row">
                        <td>TOTAL</td>
                        <td className="right">Rp {data.total.toLocaleString("id-ID")}</td>
                    </tr>
                </tbody>
            </table>

            <div className="divider" />
            <p className="footer">Terima kasih atas kunjungan Anda</p>

            <style jsx>{`
                .struk-container {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    width: 300px;
                    margin: 0 auto;
                    padding: 12px;
                    color: #000;
                }
                h2 { text-align: center; margin: 0 0 4px; font-size: 16px; }
                .center { text-align: center; }
                .right { text-align: right; }
                .divider { border-top: 1px dashed #000; margin: 8px 0; }
                table { width: 100%; border-collapse: collapse; }
                td { font-size: 12px; vertical-align: top; padding: 2px 0; }
                .item-name { padding-top: 6px; }
                .total-row td { font-weight: bold; font-size: 13px; }
                .footer { text-align: center; margin-top: 12px; font-size: 11px; }
            `}</style>

            <style jsx global>{`
                @media print {
                    @page {
                        /* 80mm = ukuran umum kertas thermal, ganti ke 58mm kalau printer kamu itu */
                        size: 80mm auto;
                        margin: 0;
                    }

                    html, body {
                        margin: 0;
                        padding: 0;
                        width: 80mm;
                    }

                    .struk-container {
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 4mm !important;
                    }
                }
            `}</style>
        </div>
    );
}