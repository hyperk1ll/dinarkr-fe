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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">Detail Transaksi</h2>
        <div className="border-t border-gray-300">
          <ul className="divide-y divide-gray-200">
            {details.map((detail: { id_dinar: number; jumlah: number; harga_satuan: { toLocaleString: (arg0: string, arg1: { style: string; currency: string; }) => string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }; totalHarga: { toLocaleString: (arg0: string, arg1: { style: string; currency: string; }) => string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }; }, index: number) => (
              <li key={index} className="py-4 flex items-start">
                <div className="flex-1">
                  <p className="text-lg font-medium">{getDinarNameById(detail.id_dinar)}</p>
                  <p className="text-gray-600">Jumlah: {detail.jumlah}</p>
                  <p className="text-gray-600">Harga Satuan: {detail.harga_satuan.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}</p>
                  <p className="text-gray-600">Total Harga: {detail.totalHarga.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
