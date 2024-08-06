"use client";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import BarChart from "../../components/Barchart/Barchart";

export default function Home() {
  const [chartData, setChartData] = useState<{ label: string; value: number; }[]>([]);

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
          } else if (transaction.tipe_transaksi === 'jual') {
            acc.totalPenjualan += total;
          }
          return acc;
        }, { totalPembelian: 0, totalPenjualan: 0 });

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
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
            <div className="w-1/2 border border-gray-200 shadow-sm">
              <BarChart data={chartData} />
            </div>
        </div>
      </div>
    </div>
  );
}
