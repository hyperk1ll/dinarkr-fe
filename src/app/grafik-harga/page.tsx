"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import LineChart from "@/components/LineChart/LineChart";
import axios from "axios";

export default function GrafikHargaPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dinarList, setDinarList] = useState<any[]>([]);
  const [selectedDinar, setSelectedDinar] = useState<string>("");
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    checkScreenSize();

    // Fetch all dinar products for dropdown
    const fetchDinarList = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/get-dinar`);
        if (!res.data.error) {
          const sorted = res.data.data.sort((a: any, b: any) => a.id - b.id);
          setDinarList(sorted);
          if (sorted.length > 0) {
            setSelectedDinar(sorted[0].id.toString());
          }
        }
      } catch (err) {
        console.error("Failed to fetch dinar list", err);
      }
    };
    fetchDinarList();
  }, []);

  useEffect(() => {
    if (!selectedDinar) return;

    const fetchRiwayat = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/riwayat-harga/${selectedDinar}`);
        if (!res.data.error) {
          const riwayat = res.data.data;
          
          const labels = riwayat.map((r: any) => {
            const date = new Date(r.tanggal);
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          });
          
          const dataKonsumen = riwayat.map((r: any) => Number(r.harga_konsumen));
          const dataBuyback = riwayat.map((r: any) => Number(r.harga_buyback));

          setChartData({
            labels,
            datasets: [
              {
                label: 'Harga Konsumen',
                data: dataKonsumen,
                borderColor: 'rgba(212, 168, 23, 1)', // Gold
                backgroundColor: 'rgba(212, 168, 23, 0.1)',
                fill: true,
                tension: 0.3,
              },
              {
                label: 'Harga Buyback',
                data: dataBuyback,
                borderColor: 'rgba(39, 150, 95, 1)', // Emerald
                backgroundColor: 'rgba(39, 150, 95, 0.1)',
                fill: true,
                tension: 0.3,
              }
            ]
          });
        }
      } catch (err) {
        console.error("Failed to fetch riwayat harga", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiwayat();
  }, [selectedDinar]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar onSidebarToggle={handleSidebarToggle} />
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-grow p-4 md:p-6 overflow-x-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-emerald-950">Grafik Harga Pasar</h1>
            <p className="text-sm text-emerald-700/80 mt-1">Pantau pergerakan harga dinar dari hari ke hari</p>
          </div>
          
          <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg mb-6">
            <div className="mb-6 max-w-sm">
              <label className="block text-sm font-medium text-emerald-700/80 mb-2">
                Pilih Produk Dinar
              </label>
              <select
                className="w-full bg-gray-50 border border-emerald-200 text-emerald-950 rounded-lg p-2.5 focus:ring-gold-500 focus:border-gold-500"
                value={selectedDinar}
                onChange={(e) => setSelectedDinar(e.target.value)}
              >
                {dinarList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-[400px] w-full relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/20 backdrop-blur-sm rounded-lg z-10">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-gold-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-emerald-700 font-medium text-sm">Memuat grafik...</span>
                  </div>
                </div>
              ) : chartData && chartData.labels.length > 0 ? (
                <LineChart data={chartData} />
              ) : (
                <div className="flex h-full items-center justify-center text-emerald-700/80">
                  Belum ada riwayat data harga untuk produk ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
