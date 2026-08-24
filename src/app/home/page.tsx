"use client";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import BarChart from "../../components/Barchart/Barchart";
import { FaBox, FaFileInvoice, FaDollarSign, FaMoneyBill } from "react-icons/fa";

export default function Home() {
  const [chartData, setChartData] = useState<{ label: string; value: number; }[]>([]);
  const [totalProduk, setTotalProduk] = useState(0);
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0);
  const [keuntungan, setKeuntungan] = useState(0);
  const [totalPembelian, setTotalPembelian] = useState(0);
  const [totalPenjualan, setTotalPenjualan] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transaksi/get-all-transaksi`);
        const data = await response.json();

        const transactions = data.data;

        // Calculate the total purchases and sales
        const totals = transactions.reduce((acc: { totalPembelian: number; totalProduk: any; totalPenjualan: number; totalTransaksi: number; }, transaction: { jumlah: number; harga_satuan: number; tipe_transaksi: string; }) => {
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
        var selisih = Math.abs(totals.totalPenjualan - totals.totalPembelian);
        const selisihLabel = isStoredAssets ? "Aset Tersimpan" : "Keuntungan";

        const formattedData = [
          { label: "Total Pembelian", value: totals.totalPembelian },
          { label: "Total Penjualan", value: totals.totalPenjualan },
          { label: selisihLabel, value: selisih }
        ];

        setChartData(formattedData);
        setTotalProduk(totals.totalProduk);
        setJumlahTransaksi(totals.totalTransaksi);
        setKeuntungan(selisih *= -1); // Assuming 'Keuntungan' refers to total profit
        setTotalPembelian(totals.totalPembelian);
        setTotalPenjualan(totals.totalPenjualan);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after data is fetched
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center animate-pulse shadow-lg shadow-gold-500/20">
            <span className="text-emerald-950 font-extrabold text-lg">D</span>
          </div>
          <span className="text-sm font-medium text-emerald-700/80">Memuat dashboard...</span>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: <FaBox className="text-xl" />,
      label: "Total Produk",
      value: totalProduk.toString(),
      gradient: "from-white to-emerald-50/50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: <FaFileInvoice className="text-xl" />,
      label: "Jumlah Penjualan",
      value: jumlahTransaksi.toString(),
      gradient: "from-white to-gold-50/50",
      iconBg: "bg-gold-100",
      iconColor: "text-gold-600",
    },
    {
      icon: <FaMoneyBill className="text-xl" />,
      label: totalPembelian > totalPenjualan ? "Total Aset" : "Keuntungan",
      value: (keuntungan * -1).toLocaleString("id-ID", { style: "currency", currency: "IDR" }),
      gradient: "from-white to-gold-50/50",
      iconBg: "bg-gold-100",
      iconColor: "text-gold-600",
    },
    {
      icon: <FaMoneyBill className="text-xl" />,
      label: "Pembelian",
      value: totalPembelian.toLocaleString("id-ID", { style: "currency", currency: "IDR" }),
      gradient: "from-white to-emerald-50/50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: <FaDollarSign className="text-xl" />,
      label: "Penjualan",
      value: totalPenjualan.toLocaleString("id-ID", { style: "currency", currency: "IDR" }),
      gradient: "from-white to-emerald-50/50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar onSidebarToggle={handleSidebarToggle} />
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-emerald-950">Dashboard</h1>
            <p className="text-sm text-emerald-700/80 mt-1">Ringkasan data transaksi dan produk Anda</p>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {statCards.map((card, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${card.gradient} p-5 rounded-xl border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconColor}`}>
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-emerald-700/80 uppercase tracking-wider">{card.label}</p>
                    <p className="text-lg font-bold text-emerald-950 mt-0.5 truncate">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          <div className="md:w-2/3 bg-white rounded-xl border border-emerald-200 p-4 shadow-lg">
            <BarChart data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
  
}
