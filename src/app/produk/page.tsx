"use client";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Detect screen size on component mount
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize(); // Check screen size on mount

    // Fetch data from the server (replace the URL with your API endpoint)
    const fetchProduk = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/get-dinar`
        );
        const sortedData = response.data.data.sort(
          (a: Produk, b: Produk) => a.id - b.id
        );
        setProduk(sortedData);
      } catch (error) {
        console.error("Error fetching produk data:", error);
      }
    };

    fetchProduk();
  }, []);

  const toggleImageVisibility = (id: number) => {
    setShowImages((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleSyncHarga = async () => {
    setIsSyncing(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/sync-harga`
      );
      if (!response.data.error) {
        Swal.fire({
          title: "Berhasil",
          text: "Harga berhasil disinkronisasi dari dinarkr.com",
          icon: "success",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10b981",
        });
        // Fetch ulang data setelah sync
        const newResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/get-dinar`
        );
        const sortedData = newResponse.data.data.sort(
          (a: Produk, b: Produk) => a.id - b.id
        );
        setProduk(sortedData);
      }
    } catch (error) {
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menyinkronisasi harga",
        icon: "error",
        confirmButtonText: "Oke",
      });
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  return  (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar onSidebarToggle={handleSidebarToggle} />
      <div className="flex flex-col md:flex-row">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-grow p-4 md:p-6 overflow-x-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-emerald-950">Daftar Produk</h1>
              <p className="text-sm text-emerald-700/80 mt-1">Katalog lengkap produk dinar</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {produk.length > 0 && produk[0].terakhir_diperbarui && (
                <div className="text-xs text-emerald-400/80 font-medium bg-emerald-100/40 px-3 py-1.5 rounded-lg border border-emerald-200">
                  Update Terakhir: {new Date(produk[0].terakhir_diperbarui).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).replace('.', ':')} WIB
                </div>
              )}
              <button 
                onClick={handleSyncHarga}
                disabled={isSyncing}
                className="bg-gold-500 text-emerald-950 font-bold py-2 px-4 rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-gold-500/20"
              >
                {isSyncing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyinkronisasi...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    Sync Harga (Dinarkr.com)
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['No', 'Gambar', 'Nama', 'Harga Konsumen', 'Harga Buyback', 'Jumlah Stok'].map((header) => (
                      <th key={header} scope="col" className="px-4 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {produk.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap text-sm">
                        {showImages.has(item.id) && item.gambar && item.gambar.trim() ? (
                          <Image
                            src={item.gambar}
                            alt={item.nama}
                            className="object-center rounded-lg"
                            quality={100}
                            width={225}
                            height={225}
                          />
                        ) : (
                          ""
                        )}
                        <button
                          onClick={() => toggleImageVisibility(item.id)}
                          className="text-xs font-medium text-emerald-700 hover:text-emerald-800 border border-emerald-300 hover:border-emerald-400 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg mt-2 transition-all"
                        >
                          {showImages.has(item.id)
                            ? "Sembunyikan"
                            : "Lihat Gambar"}
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {item.nama}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {Number(item.harga_konsumen).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {Number(item.harga_buyback).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.jumlah_stok}
                        </span>
                      </td>
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
