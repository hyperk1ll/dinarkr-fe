import React, { useState, useEffect } from "react";

export default function Detail_Modal({ isOpen, onClose, details }: { isOpen: boolean; onClose: () => void; details: any[] }) {
  const [dinarData, setDinarData] = useState<{ id: number; nama: string }[]>([]);

  useEffect(() => {
    // Fetch dinar data from your API
    async function fetchDinarData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/get-dinar`); // Adjust the API endpoint as needed
        const data = await response.json();
        if (!data.error) {
          setDinarData(data.data);
        } else {
          console.error("Failed to fetch dinar data");
        }
      } catch (error) {
        console.error("Error fetching dinar data:", error);
      }
    }

    fetchDinarData();
  }, []);

  const getDinarNameById = (id: number) => {
    const dinar = dinarData.find((item) => item.id === id);
    return dinar ? dinar.nama : `Unknown ID ${id}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-emerald-950/80 backdrop-blur-sm z-50">
      <div className="bg-emerald-900 border border-emerald-700/30 p-6 rounded-2xl shadow-2xl max-w-lg w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Detail Transaksi</h2>
        </div>
        <div className="border-t border-emerald-700/30">
          <ul className="divide-y divide-emerald-700/20">
            {details.map((detail: { id_dinar: number; jumlah: number; harga_satuan: { toLocaleString: (arg0: string, arg1: { style: string; currency: string; }) => string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }; totalHarga: { toLocaleString: (arg0: string, arg1: { style: string; currency: string; }) => string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }; }, index: number) => (
              <li key={index} className="py-4">
                <div className="flex-1">
                  <p className="text-base font-semibold text-gold-400">{getDinarNameById(detail.id_dinar)}</p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="bg-emerald-800/40 rounded-lg p-2 text-center">
                      <p className="text-[10px] text-emerald-400/50 uppercase font-medium">Jumlah</p>
                      <p className="text-sm font-bold text-white">{detail.jumlah}</p>
                    </div>
                    <div className="bg-emerald-800/40 rounded-lg p-2 text-center">
                      <p className="text-[10px] text-emerald-400/50 uppercase font-medium">Harga</p>
                      <p className="text-sm font-bold text-white">{Number(detail.harga_satuan).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}</p>
                    </div>
                    <div className="bg-gold-700/20 rounded-lg p-2 text-center">
                      <p className="text-[10px] text-gold-400/60 uppercase font-medium">Total</p>
                      <p className="text-sm font-bold text-gold-300">{Number(detail.totalHarga).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="mt-4 w-full py-2.5 rounded-xl bg-emerald-800/50 border border-emerald-700/30 text-emerald-200 font-medium text-sm hover:bg-emerald-800 transition-all"
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
