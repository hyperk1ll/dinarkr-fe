"use client";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import BarChart from "../../components/Barchart/Barchart";
import { FaBox, FaFileInvoice, FaDollarSign, FaMoneyBill, FaBuysellads } from "react-icons/fa";



export default function Home() {
  const [chartData, setChartData] = useState<{ label: string; value: number; }[]>([]);
  const [totalProduk, setTotalProduk] = useState(0);
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0);
  const [keuntungan, setKeuntungan] = useState(0);
  const [totalPembelian, setTotalPembelian] = useState(0);
  const [totalPenjualan, setTotalPenjualan] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transaksi/get-all-transaksi`); // Adjust the API endpoint as needed
        const data = await response.json();

        const transactions = data.data;

        // Calculate the total purchases and sales
        const totals = transactions.reduce((acc, transaction) => {
          const total = transaction.jumlah * transaction.harga_satuan;
          if (transaction.tipe_transaksi === 'beli') {
            acc.totalPembelian += total;
            acc.totalProduk += transaction.jumlah;
          } else if (transaction.tipe_transaksi === 'jual') {
            acc.totalPenjualan += total;
            acc.totalTransaksi++;
          }
          return acc;
        }, { totalPembelian: 0, totalPenjualan: 0, totalProduk: 0, totalTransaksi: 0 });

        // Calculate the stored assets or profit
        const isStoredAssets = totals.totalPembelian > totals.totalPenjualan;
        const selisih = Math.abs(totals.totalPenjualan - totals.totalPembelian);
        const selisihLabel = isStoredAssets ? "Aset Tersimpan" : "Keuntungan";

        const formattedData = [
          { label: "Total Pembelian", value: totals.totalPembelian },
          { label: "Total Penjualan", value: totals.totalPenjualan },
          { label: selisihLabel, value: selisih }
        ];

        setChartData(formattedData);
        setTotalProduk(totals.totalProduk);
        setJumlahTransaksi(totals.totalTransaksi);
        setKeuntungan(totals.totalPenjualan - totals.totalPembelian); // Assuming 'Keuntungan' refers to total profit
        setTotalPembelian(totals.totalPembelian);
        setTotalPenjualan(totals.totalPenjualan);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="w-full bg-white">
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-4 mb-2">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center">
              <FaBox className="text-blue-500 text-3xl mr-4" />
              <div>
                <h2 className="text-lg font-semibold">Total Produk</h2>
                <p className="text-2xl font-bold">{totalProduk}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center">
              <FaFileInvoice className="text-green-500 text-3xl mr-4" />
              <div>
                <h2 className="text-lg font-semibold">Jumlah Transaksi</h2>
                <p className="text-2xl font-bold">{jumlahTransaksi}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center">
              <FaMoneyBill className="text-green-700 text-3xl mr-4" />
              <div>
                <h2 className="text-lg font-semibold">{totalPembelian > totalPenjualan ? "Total Aset" :  "Keuntungan"}</h2>
                <p className="text-2xl font-bold">{}
                  
                  {(keuntungan * -1).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center">
              <FaMoneyBill className="text-green-500 text-3xl mr-4" />
              <div>
                <h2 className="text-lg font-semibold">Pembelian</h2>
                <p className="text-2xl font-bold">{totalPembelian.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center">
              <FaDollarSign className="text-red-500 text-3xl mr-4" />
              <div>
                <h2 className="text-lg font-semibold">Penjualan</h2>
                <p className="text-2xl font-bold">{totalPenjualan.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}</p>
              </div>
            </div>
          </div>
          

          <div className="w-2/3 h-2/3 mt-8 border rounded-md bg-gray-100 border-gray-200 shadow-md">
            <BarChart data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
