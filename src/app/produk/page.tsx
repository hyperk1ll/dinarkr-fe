"use client";

import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
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

  const loaderProp =({ src }) => {
    return src;
}

  return (
    <div className="w-full  bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-4">
          <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-2 rounded-lg text-center">
              <thead>
                <tr>
                  <th className="py-2 px-2 border-b">ID</th>
                  <th className="py-2 px-2 border-b">Gambar</th>
                  <th className="py-2 px-2 border-b">Nama</th>
                  <th className="py-2 px-2 border-b">Harga Konsumen</th>
                  <th className="py-2 px-2 border-b">Harga Buyback</th>
                  <th className="py-2 px-2 border-b">Jumlah Stok</th>
                </tr>
              </thead>
              <tbody className="justify-items-center">
                {produk.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4 border-b">{item.id}</td>
                    <td className="py-2 px-4 border-b flex justify-center items-center">
                      {item.gambar && item.gambar.trim() ? (
                        <Image src={item.gambar} alt={item.nama} className=" object-center" quality={100} width={225} height={225} />
                      ) : (
                        <span>N/A</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">{item.nama}</td>
                    <td className="py-2 px-4 border-b">{item.harga_konsumen}</td>
                    <td className="py-2 px-4 border-b">{item.harga_buyback}</td>
                    
                    <td className="py-2 px-4 border-b">{item.jumlah_stok}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
