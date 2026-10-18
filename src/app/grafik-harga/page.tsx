"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import LineChart from "@/components/LineChart/LineChart";
import axios from "axios";
import Image from "next/image";

interface ProdukDinar {
  id: number;
  nama: string;
  harga_konsumen: number | string;
  harga_buyback: number | string;
  keterangan: string;
  gambar: string;
  jumlah_stok: number | string;
  terakhir_diperbarui: string;
}

interface RiwayatHarga {
  id: number;
  id_dinar: number;
  harga_konsumen: number | string;
  harga_buyback: number | string;
  tanggal: string;
}

// Metadata informasi gramasi & motif resmi DinarKR
const METADATA_MAP: Record<string, { weight: string; motif: string; order: number }> = {
  "1/8 dinar": { weight: "0,531 gr", motif: "Masjid Quba", order: 0.125 },
  "1/4 dinar": { weight: "1,063 gr", motif: "Aya Sofia", order: 0.25 },
  "1/2 dinar": { weight: "2,125 gr", motif: "Kubah Makam Rasul", order: 0.5 },
  "1 dinar": { weight: "4,25 gr", motif: "Masjidil Haram / Ka'bah", order: 1 },
  "2 dinar": { weight: "8,5 gr", motif: "Kiswah Ka'bah", order: 2 },
  "3 dinar": { weight: "12,75 gr", motif: "Talbiyah", order: 3 },
  "4 dinar": { weight: "17 gr", motif: "Asmaul Husna", order: 4 },
  "5 dinar": { weight: "21,25 gr", motif: "Ayat Kursi", order: 5 },
  "7 dinar": { weight: "29,75 gr", motif: "Pintu Makam Rasulullah", order: 7 },
  "8 dinar": { weight: "34 gr", motif: "Surah At-Thalaq 2–3", order: 8 },
  "10 dinar": { weight: "42,5 gr", motif: "Pintu Ka'bah", order: 10 },
  "20 dinar": { weight: "85 gr", motif: "Kiswah Ka'bah / Edisi Cinta Allah", order: 20 },
  "paket exclusive": { weight: "8 Keping", motif: "Koleksi 1/4 s/d 5 Dinar", order: 100 },
  "paket dinar exclusive 1 set": { weight: "8 Keping", motif: "Koleksi 1/4 s/d 5 Dinar", order: 100 },
  "paket luxury": { weight: "10 Keping", motif: "Koleksi 1/4 s/d 10 Dinar", order: 200 },
  "paket dinar luxury 1 set": { weight: "10 Keping", motif: "Koleksi 1/4 s/d 10 Dinar", order: 200 },
};

function getDinarWeightInfo(nama: string) {
  const key = (nama || "").toLowerCase().trim();
  if (METADATA_MAP[key]) return METADATA_MAP[key];

  for (const [k, v] of Object.entries(METADATA_MAP)) {
    if (key.includes(k) || k.includes(key)) {
      return v;
    }
  }
  return { weight: "-", motif: "Dinar Emas 24K", order: 999 };
}

type TimeRange = "1M" | "3M" | "6M" | "1Y" | "ALL";

export default function GrafikHargaPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dinarList, setDinarList] = useState<ProdukDinar[]>([]);
  const [selectedDinarId, setSelectedDinarId] = useState<string>("");
  const [rawRiwayat, setRawRiwayat] = useState<RiwayatHarga[]>([]);
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1Y");
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(false);
  const [searchTable, setSearchTable] = useState("");

  const chartRef = useRef<HTMLDivElement>(null);

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

    // 1. Ambil daftar produk dan urutkan DARI TERKECIL KE TERBESAR
    const fetchDinarList = async () => {
      setIsLoadingList(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/get-dinar`);
        if (!res.data.error) {
          const rawItems: ProdukDinar[] = res.data.data;
          
          // URUTKAN DARI TERKECIL KE TERBESAR (1/8 -> 1/4 -> 1/2 -> 1 -> ... -> 20 -> Paket)
          const sorted = [...rawItems].sort((a, b) => {
            const orderA = getDinarWeightInfo(a.nama).order;
            const orderB = getDinarWeightInfo(b.nama).order;
            return orderA - orderB;
          });

          setDinarList(sorted);
          if (sorted.length > 0) {
            // Default pilih "1 Dinar" jika ada, atau item pertama
            const defaultItem = sorted.find((item) => item.nama.toLowerCase() === "1 dinar") || sorted[0];
            setSelectedDinarId(defaultItem.id.toString());
          }
        }
      } catch (err) {
        console.error("Gagal mengambil daftar dinar:", err);
      } finally {
        setIsLoadingList(false);
      }
    };

    fetchDinarList();
  }, []);

  // 2. Ambil riwayat harga saat produk terpilih berubah
  useEffect(() => {
    if (!selectedDinarId) return;

    const fetchRiwayat = async () => {
      setIsLoadingRiwayat(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/riwayat-harga/${selectedDinarId}`
        );
        if (!res.data.error) {
          const riwayatData: RiwayatHarga[] = res.data.data;
          // Pastikan terurut kronologis tanggal ASC
          const sortedRiwayat = [...riwayatData].sort(
            (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
          );
          setRawRiwayat(sortedRiwayat);
        }
      } catch (err) {
        console.error("Gagal mengambil riwayat harga:", err);
        setRawRiwayat([]);
      } finally {
        setIsLoadingRiwayat(false);
      }
    };

    fetchRiwayat();
  }, [selectedDinarId]);

  // 3. Filter riwayat berdasarkan rentang waktu yang dipilih (1M, 3M, 6M, 1Y, ALL)
  const filteredRiwayat = useMemo(() => {
    if (!rawRiwayat || rawRiwayat.length === 0) return [];
    if (selectedRange === "ALL") return rawRiwayat;

    const latestDate = new Date(rawRiwayat[rawRiwayat.length - 1].tanggal);
    const cutoffDate = new Date(latestDate);

    if (selectedRange === "1M") cutoffDate.setMonth(cutoffDate.getMonth() - 1);
    else if (selectedRange === "3M") cutoffDate.setMonth(cutoffDate.getMonth() - 3);
    else if (selectedRange === "6M") cutoffDate.setMonth(cutoffDate.getMonth() - 6);
    else if (selectedRange === "1Y") cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);

    const filtered = rawRiwayat.filter((r) => new Date(r.tanggal) >= cutoffDate);
    // Jika filter menghasilkan terlalu sedikit (misal < 2 titik), kembalikan raw
    return filtered.length >= 2 ? filtered : rawRiwayat;
  }, [rawRiwayat, selectedRange]);

  // 4. Data untuk Chart.js
  const chartData = useMemo(() => {
    if (!filteredRiwayat || filteredRiwayat.length === 0) return null;

    const fullDates = filteredRiwayat.map((r) => {
      const d = new Date(r.tanggal);
      const datePart = d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const timePart = d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).replace(".", ":");
      return `${datePart}, ${timePart}`;
    });

    const labels = filteredRiwayat.map((r) => {
      const d = new Date(r.tanggal);
      if (selectedRange === "1M" || selectedRange === "3M") {
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      }
      if (selectedRange === "6M" || selectedRange === "1Y") {
        return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      }
      return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
    });

    const dataKonsumen = filteredRiwayat.map((r) => Number(r.harga_konsumen));
    const dataBuyback = filteredRiwayat.map((r) => Number(r.harga_buyback));

    return {
      labels,
      fullDates,
      datasets: [
        {
          label: "Harga Konsumen (Beli)",
          data: dataKonsumen,
          borderColor: "#d4a817", // Gold
          backgroundColor: "rgba(212, 168, 23, 0.12)",
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: "Harga Buyback (Jual Kembali)",
          data: dataBuyback,
          borderColor: "#27965f", // Emerald
          backgroundColor: "rgba(39, 150, 95, 0.05)",
          fill: false,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    };
  }, [filteredRiwayat, selectedRange]);

  // Statistik untuk grafik saat ini (Harga Terakhir, Perubahan/Delta, Tertinggi, Terendah)
  const currentProduct = useMemo(() => {
    return dinarList.find((item) => item.id.toString() === selectedDinarId) || dinarList[0];
  }, [dinarList, selectedDinarId]);

  const stats = useMemo(() => {
    if (!filteredRiwayat || filteredRiwayat.length === 0) {
      return {
        firstPrice: 0,
        lastPrice: 0,
        diff: 0,
        percent: 0,
        min: 0,
        max: 0,
        firstFullDate: "-",
        lastFullDate: "-",
      };
    }

    const firstItem = filteredRiwayat[0];
    const lastItem = filteredRiwayat[filteredRiwayat.length - 1];

    const formatDateTime = (iso: string) => {
      const d = new Date(iso);
      const datePart = d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const timePart = d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).replace(".", ":");
      return `${datePart}, ${timePart}`;
    };

    const firstPrice = Number(firstItem.harga_konsumen);
    const lastPrice = Number(lastItem.harga_konsumen);
    const diff = lastPrice - firstPrice;
    const percent = firstPrice > 0 ? (diff / firstPrice) * 100 : 0;

    const prices = filteredRiwayat.map((r) => Number(r.harga_konsumen));
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return {
      firstPrice,
      lastPrice,
      diff,
      percent,
      min,
      max,
      firstFullDate: formatDateTime(firstItem.tanggal),
      lastFullDate: formatDateTime(lastItem.tanggal),
    };
  }, [filteredRiwayat]);

  // Handler saat user klik koin dari daftar tabel untuk melihat grafiknya
  const handleSelectCoin = (id: number) => {
    setSelectedDinarId(id.toString());
    if (chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Filter daftar tabel berdasarkan pencarian
  const displayedTableList = useMemo(() => {
    if (!searchTable.trim()) return dinarList;
    return dinarList.filter(
      (item) =>
        item.nama.toLowerCase().includes(searchTable.toLowerCase()) ||
        getDinarWeightInfo(item.nama).motif.toLowerCase().includes(searchTable.toLowerCase())
    );
  }, [dinarList, searchTable]);

  // Timestamp update terakhir dari produk pertama
  const lastUpdatedString = useMemo(() => {
    if (dinarList.length === 0 || !dinarList[0].terakhir_diperbarui) return null;
    const d = new Date(dinarList[0].terakhir_diperbarui);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(".", ":") + " WIB";
  }, [dinarList]);

  return (
    <div className="w-full min-h-screen bg-[#f8faf9] text-gray-900">
      <Navbar onSidebarToggle={handleSidebarToggle} />
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar isSidebarOpen={isSidebarOpen} />

        <main className="flex-grow p-3 sm:p-5 md:p-8 max-w-7xl mx-auto w-full transition-all duration-300">
          {/* ======================================================== */}
          {/* 1. HERO SECTION (Dark Luxury Aesthetic seperti dinarkr.com) */}
          {/* ======================================================== */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c131a] via-[#101b22] to-[#070d12] border border-gold-500/20 shadow-2xl p-6 md:p-10 mb-8 text-white">
            {/* Ambient Gold Glow Ornaments */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-3">
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                  Diperbarui Setiap Hari Secara Resmi
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
                  Harga Dinar<span className="text-gold-400">KR.</span>
                </h1>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  Simpan, amankan, muliakan dengan koin & kepingan emas 24 karat 999.9 berukiran islami.
                  Pantau grafik pergerakan harga real-time dan riwayat historis terpercaya.
                </p>
              </div>

              {/* Timestamp & Status Box */}
              {lastUpdatedString && (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-5 flex flex-col gap-2 min-w-[240px]">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    Status Pasar: Terverifikasi
                  </div>
                  <div className="text-xs text-gray-400">Pembaruan Terakhir:</div>
                  <div className="text-sm font-semibold text-white tracking-wide">
                    {lastUpdatedString}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. TAB SELECTOR PECAHAN (Urut Dari Paling Kecil ke Paling Besar) */}
          {/* ======================================================== */}
          <div className="mb-6" ref={chartRef}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
                  </svg>
                  Pilih Pecahan Dinar (Urut Terkecil ke Terbesar)
                </h2>
                <p className="text-xs text-emerald-700/80">Klik pecahan koin untuk melihat grafik tren harganya</p>
              </div>
            </div>

            {/* Horizontal Scrolling Pill Selector */}
            <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
              {dinarList.map((item) => {
                const isSelected = item.id.toString() === selectedDinarId;
                const meta = getDinarWeightInfo(item.nama);

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDinarId(item.id.toString())}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 flex flex-col items-center gap-0.5 border ${
                      isSelected
                        ? "bg-gradient-to-r from-gold-500 to-gold-400 text-emerald-950 border-gold-400 shadow-md shadow-gold-500/20 scale-[1.02]"
                        : "bg-white text-gray-700 border-emerald-100 hover:border-gold-300 hover:bg-gold-50/50 shadow-sm"
                    }`}
                  >
                    <span>{item.nama}</span>
                    <span className={`text-[10px] ${isSelected ? "text-emerald-900/80 font-medium" : "text-gray-400"}`}>
                      {meta.weight}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. CHART CARD & TIME-RANGE FILTER (Seperti dinarkr.com) */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl overflow-hidden mb-10">
            {/* Chart Card Header */}
            <div className="p-5 md:p-6 border-b border-gray-100 bg-gradient-to-r from-white via-emerald-50/30 to-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Product Detail & Large Price */}
                {currentProduct && (
                  <div className="flex items-center gap-4">
                    {currentProduct.gambar && (
                      <div className="w-14 h-14 relative flex-shrink-0 bg-gold-50 rounded-xl p-1 border border-gold-200 shadow-inner flex items-center justify-center">
                        <img
                          src={currentProduct.gambar}
                          alt={currentProduct.nama}
                          className="w-full h-full object-contain drop-shadow"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl md:text-2xl font-extrabold text-emerald-950">
                          {currentProduct.nama}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-semibold">
                          {getDinarWeightInfo(currentProduct.nama).weight}
                        </span>
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-gold-100 text-gold-900 text-xs font-medium">
                          {getDinarWeightInfo(currentProduct.nama).motif}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-baseline gap-3 mt-1">
                        <span className="text-2xl md:text-3xl font-black text-gold-600">
                          Rp {Number(currentProduct.harga_konsumen).toLocaleString("id-ID")}
                        </span>
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          Buyback: Rp {Number(currentProduct.harga_buyback).toLocaleString("id-ID")}
                        </span>

                        {/* Delta indicator */}
                        {stats.diff !== 0 && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                              stats.diff >= 0
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {stats.diff >= 0 ? "▲ +" : "▼ "}
                            Rp {Math.abs(stats.diff).toLocaleString("id-ID")} ({stats.percent >= 0 ? "+" : ""}
                            {stats.percent.toFixed(2)}%)
                          </span>
                        )}
                      </div>

                      {/* Display exact date, month, year, time */}
                      {stats.lastFullDate !== "-" && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <svg className="w-3.5 h-3.5 text-gold-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            Data Terakhir: <strong className="text-emerald-900">{stats.lastFullDate}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Range Filter Buttons (1M, 3M, 6M, 1Y, ALL) */}
                <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200 self-start lg:self-center">
                  {(["1M", "3M", "6M", "1Y", "ALL"] as TimeRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedRange(range)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        selectedRange === range
                          ? "bg-white text-emerald-950 shadow-sm border border-gray-200"
                          : "text-gray-500 hover:text-emerald-900"
                      }`}
                    >
                      {range === "ALL" ? "Semua (2020)" : range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Stats Strip (Terendah, Tertinggi, Tanggal Lengkap) */}
              {filteredRiwayat.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 block text-[11px]">Awal Periode:</span>
                    <span className="font-bold text-gray-800 block text-xs">
                      Rp {stats.firstPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      📅 {stats.firstFullDate}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
                    <span className="text-gray-500 block text-[11px]">Harga Terendah:</span>
                    <span className="font-bold text-emerald-700 block text-xs">
                      Rp {stats.min.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-emerald-600/70 mt-0.5 block">
                      Harga minimum grafik
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gold-50/50 border border-gold-100/60">
                    <span className="text-gray-500 block text-[11px]">Harga Tertinggi:</span>
                    <span className="font-bold text-gold-700 block text-xs">
                      Rp {stats.max.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-gold-600/70 mt-0.5 block">
                      Puncak harga periode
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 block text-[11px]">Data Terakhir:</span>
                    <span className="font-bold text-gray-800 block text-xs">
                      Rp {stats.lastPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      📅 {stats.lastFullDate}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Chart Area */}
            <div className="p-4 md:p-6 h-[380px] md:h-[440px] w-full relative">
              {isLoadingRiwayat ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-10">
                  <svg className="animate-spin h-8 w-8 text-gold-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs font-semibold text-emerald-800">Memuat data riwayat grafik...</span>
                </div>
              ) : chartData ? (
                <LineChart data={chartData} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  Belum ada data riwayat harga untuk pecahan ini.
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. DAFTAR LENGKAP HARGA DINARKR (Urut Dari Terkecil ke Terbesar) */}
          {/* ======================================================== */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl p-5 md:p-7 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                  </svg>
                  Tabel Harga Dinar Khoirur Rooziqiin
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Daftar seluruh koin & kepingan emas 24 karat diurutkan dari ukuran terkecil hingga terbesar
                </p>
              </div>

              {/* Pencarian Koin */}
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder="Cari pecahan / motif..."
                  value={searchTable}
                  onChange={(e) => setSearchTable(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Tabel Data Responsif */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-950 text-white text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-lg">Jenis Dinar</th>
                    <th className="py-3 px-4">Motif & Gramasi</th>
                    <th className="py-3 px-4 text-right">Harga Konsumen (Beli)</th>
                    <th className="py-3 px-4 text-right">Harga Buyback</th>
                    <th className="py-3 px-4 text-right hidden sm:table-cell">Selisih (Spread)</th>
                    <th className="py-3 px-4 text-center rounded-r-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {displayedTableList.map((item, idx) => {
                    const meta = getDinarWeightInfo(item.nama);
                    const jual = Number(item.harga_konsumen);
                    const buyback = Number(item.harga_buyback);
                    const spread = jual - buyback;
                    const spreadPercent = jual > 0 ? (spread / jual) * 100 : 0;
                    const isSelected = item.id.toString() === selectedDinarId;

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors hover:bg-gold-50/40 ${
                          isSelected ? "bg-gold-50/60 font-medium" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        }`}
                      >
                        {/* Koin & Thumbnail */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {item.gambar ? (
                              <div className="w-10 h-10 flex-shrink-0 bg-white rounded-lg p-0.5 border border-gray-200 shadow-sm flex items-center justify-center">
                                <img
                                  src={item.gambar}
                                  alt={item.nama}
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 flex-shrink-0 bg-gold-100 text-gold-800 rounded-lg flex items-center justify-center font-bold text-xs">
                                Dinar
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-emerald-950">{item.nama}</div>
                              <div className="text-xs text-gray-500 sm:hidden">{meta.weight} · {meta.motif}</div>
                            </div>
                          </div>
                        </td>

                        {/* Motif & Berat */}
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="text-gray-800 font-medium">{meta.motif}</div>
                          <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                            {meta.weight}
                          </span>
                        </td>

                        {/* Harga Konsumen */}
                        <td className="py-3 px-4 text-right">
                          <div className="font-black text-gold-600 text-base">
                            Rp {jual.toLocaleString("id-ID")}
                          </div>
                        </td>

                        {/* Harga Buyback */}
                        <td className="py-3 px-4 text-right">
                          <div className="font-bold text-emerald-700">
                            Rp {buyback.toLocaleString("id-ID")}
                          </div>
                        </td>

                        {/* Spread */}
                        <td className="py-3 px-4 text-right hidden sm:table-cell text-xs text-gray-500">
                          <div>Rp {spread.toLocaleString("id-ID")}</div>
                          <div className="text-[10px] text-gray-400">({spreadPercent.toFixed(2)}%)</div>
                        </td>

                        {/* Tombol Lihat Grafik */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleSelectCoin(item.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                              isSelected
                                ? "bg-emerald-900 text-white"
                                : "bg-emerald-50 text-emerald-800 hover:bg-gold-500 hover:text-emerald-950 border border-emerald-200"
                            }`}
                          >
                            {isSelected ? "Aktif" : "Lihat Grafik"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-gray-400 text-right">
              *Harga tertera belum termasuk ongkos kirim dan asuransi pengiriman.
            </div>
          </div>

          {/* ======================================================== */}
          {/* 5. KARTU PAKET KOLEKSI DINAR LUXURY & EXCLUSIVE */}
          {/* ======================================================== */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-emerald-950 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Paket Set Koleksi Eksklusif DinarKR
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dinarList
                .filter((p) => p.nama.toLowerCase().includes("paket") || p.nama.toLowerCase().includes("set"))
                .map((paket) => {
                  const isLuxury = paket.nama.toLowerCase().includes("luxury");
                  const jual = Number(paket.harga_konsumen);
                  const buyback = Number(paket.harga_buyback);

                  return (
                    <div
                      key={paket.id}
                      className={`rounded-2xl p-6 border shadow-xl flex flex-col justify-between text-white relative overflow-hidden ${
                        isLuxury
                          ? "bg-gradient-to-br from-[#121418] via-[#1a1f26] to-[#0a0c0e] border-gold-500/30"
                          : "bg-gradient-to-br from-[#0c1f26] via-[#14323c] to-[#08151a] border-emerald-500/30"
                      }`}
                    >
                      <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-center">
                        {paket.gambar && (
                          <div className="w-28 h-28 flex-shrink-0 bg-white/10 backdrop-blur rounded-xl p-2 border border-white/20 flex items-center justify-center">
                            <img
                              src={paket.gambar}
                              alt={paket.nama}
                              className="w-full h-full object-contain drop-shadow-md"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="text-center sm:text-left">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
                            {isLuxury ? "10 Keping (1/4 - 10 Dinar)" : "8 Keping (1/4 - 5 Dinar)"}
                          </span>
                          <h4 className="text-xl font-extrabold text-white">{paket.nama}</h4>
                          <p className="text-xs text-gray-300 mt-1">{paket.keterangan}</p>
                        </div>
                      </div>

                      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-xs text-gray-400">Harga Beli:</div>
                          <div className="text-xl font-black text-gold-400">
                            Rp {jual.toLocaleString("id-ID")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Harga Buyback:</div>
                          <div className="text-base font-bold text-emerald-400">
                            Rp {buyback.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 6. CATATAN & JAMINAN KEMURNIAN ISLAMIC GOLD ART */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
            <div className="p-4 bg-white rounded-xl border border-gray-100 flex items-start gap-3 shadow-sm">
              <span className="text-2xl text-gold-500">🏆</span>
              <div>
                <strong className="block text-gray-800 font-bold mb-0.5">Emas Murni 24 Karat 999.9</strong>
                Ditempa dengan presisi tinggi dan teruji mutu sesuai standar syariah Islam internasional.
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-100 flex items-start gap-3 shadow-sm">
              <span className="text-2xl text-emerald-600">🛡️</span>
              <div>
                <strong className="block text-gray-800 font-bold mb-0.5">Jaminan Buyback Terbaik</strong>
                Kemudahan menjual kembali (buyback) kapan saja melalui seluruh jaringan agen resmi DinarKR.
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-100 flex items-start gap-3 shadow-sm">
              <span className="text-2xl text-gold-500">🕌</span>
              <div>
                <strong className="block text-gray-800 font-bold mb-0.5">Islamic Gold Art</strong>
                Setiap keping dinar memuat ukiran bersejarah dan doa keberkahan rezeki bagi pemiliknya.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
