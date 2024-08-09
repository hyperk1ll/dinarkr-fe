"use client";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

interface Produk {
  id: number;
  nama: string;
  harga_konsumen: number;
  harga_buyback: number;
  keterangan: string;
  gambar: string;
  jumlah_stok: number;
  terakhir_diperbarui: string;
}

export default function ProdukPage() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [showImages, setShowImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Fetch data from the server (replace the URL with your API endpoint)
    const fetchProduk = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/get-dinar`);
        const sortedData = response.data.data.sort((a: Produk, b: Produk) => a.id - b.id);
        setProduk(sortedData);
      } catch (error) {
        console.error("Error fetching produk data:", error);
      }
    };

    fetchProduk();
  }, []);

  const toggleImageVisibility = (id: number) => {
    setShowImages(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const loaderProp = ({ src }) => {
    return src;
  };

  return (
    <div className="w-full bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-4">
          <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>
          <div className="overflow-x-auto">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-100 border-separate">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Gambar</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Harga Konsumen</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Harga Buyback</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah Stok</th>
                  </tr>
                </thead>
                <tbody className="justify-items-center">
                  {produk.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 border-b whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                      <td className="px-2 py-4 border-b whitespace-nowrap text-sm text-gray-500">
                        {showImages.has(item.id) && item.gambar && item.gambar.trim() ? (
                          <Image src={item.gambar} alt={item.nama} className="object-center" quality={100} width={225} height={225} />
                        ) : (
                          ""
                        )}
                        <button
                          onClick={() => toggleImageVisibility(item.id)}

                          className="bg-blue-500 whitespace-nowrap text-sm text-white px-4 py-2 rounded mt-2 align-middle"
                        >
                          {showImages.has(item.id) ? "Sembunyikan" : "Lihat Gambar"}
                        </button>
                      </td>
                      <td className="px-6 py-4 border-b whitespace-nowrap text-gray-900">{item.nama}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap text-gray-900">{item.harga_konsumen}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap text-gray-900">{item.harga_buyback}</td>
                      <td className="px-6 py-4 border-b whitespace-nowrap text-gray-900">{item.jumlah_stok}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
