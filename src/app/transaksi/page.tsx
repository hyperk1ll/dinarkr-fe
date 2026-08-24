"use client";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

export default function TransaksiPage() {
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


  const [dinarOptions, setDinarOptions] = useState<Produk[]>([]);
  const [formData, setFormData] = useState({
    tipe_transaksi: "",
    pembelian_dari: "",
    tanggal_transaksi: "",
    nama_pembeli: "",
    detail: [{ id_dinar: "", jumlah: "", harga_satuan: "" }],
  });

  const [priceSuggestions, setPriceSuggestions] = useState<{[key: number]: {konsumen: number, buyback: number} | null}>({});

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
    
    // Fetch dinar options from API
    const fetchDinarOptions = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/get-dinar`); // replace with your API endpoint
        if (!response.data.error) {
          const sortedData = response.data.data.sort((a: Produk, b: Produk) => a.id - b.id);
          setDinarOptions(sortedData);
        }
      } catch (error) {
        console.error("Error fetching dinar options:", error);
      }
    };

    fetchDinarOptions();
  }, []);

  useEffect(() => {
    if (formData.tipe_transaksi === "beli" && formData.pembelian_dari === "web") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        nama_pembeli: "-",
      }));
    }
    else {
        setFormData((prevFormData) => ({
            ...prevFormData,
            nama_pembeli: "",
        }));
    }
  }, [formData.tipe_transaksi, formData.pembelian_dari]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedDetails = formData.detail.map((detail, i) =>
      i === index ? { ...detail, [field]: value } : detail
    );
    setFormData({ ...formData, detail: updatedDetails });
  };

  useEffect(() => {
    const fetchPrices = async () => {
      if (!formData.tanggal_transaksi) return;

      const dateTime = formData.tanggal_transaksi; // format: "YYYY-MM-DDThh:mm"
      const newSuggestions: {[key: number]: {konsumen: number, buyback: number} | null} = {};

      for (let i = 0; i < formData.detail.length; i++) {
        const detail = formData.detail[i];
        if (detail.id_dinar) {
          try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/harga-by-date?id_dinar=${detail.id_dinar}&tanggal=${dateTime}`);
            if (!res.data.error && res.data.data) {
              newSuggestions[i] = {
                konsumen: Number(res.data.data.harga_konsumen),
                buyback: Number(res.data.data.harga_buyback)
              };
            } else {
              newSuggestions[i] = null;
            }
          } catch (err) {
            newSuggestions[i] = null;
          }
        }
      }
      setPriceSuggestions(newSuggestions);
    };

    fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.tanggal_transaksi, formData.detail.map(d => d.id_dinar).join(",")]);


  const addDetail = () => {
    setFormData({
      ...formData,
      detail: [...formData.detail, { id_dinar: "", jumlah: "", harga_satuan: "" }],
    });
  };

    const removeDetail = (index: number) => {
        const updatedDetails = formData.detail.filter((_, i) => i !== index);
        setFormData({ ...formData, detail: updatedDetails });
    };

  const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // check if all fields are filled
    const isFormValid = formData.tipe_transaksi && formData.pembelian_dari && formData.tanggal_transaksi && formData.nama_pembeli && formData.detail.every(detail => detail.id_dinar && detail.jumlah && detail.harga_satuan);

    //minimum 1 detail
    if (formData.detail.length < 1) {
      Swal.fire({
        title: 'Error',
        text: 'Harap Isi minimal 1 produk',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!isFormValid) {
      Swal.fire({
        title: 'Error',
        text: 'Harap Isi Semua Field',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.log(formData)
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transaksi/buat-transaksi`, formData); // replace with your API endpoint
      console.log(response.data);

      Swal.fire({
        title: 'Sukses',
        text: 'Data transaksi berhasil ditambahkan',
        icon: 'success',
        confirmButtonText: 'Oke',
      });

      setFormData({
        tipe_transaksi: "",
        pembelian_dari: "",
        tanggal_transaksi: "",
        nama_pembeli: "",
        detail: [{ id_dinar: "", jumlah: "", harga_satuan: "" }],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const inputClasses = "mt-1 block w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar onSidebarToggle={handleSidebarToggle} />
      <div className="flex min-h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-emerald-950">Form Transaksi</h1>
            <p className="text-sm text-emerald-700/80 mt-1">Tambahkan transaksi baru</p>
          </div>
          
          <div className="bg-white rounded-xl border border-emerald-200 p-6 shadow-lg max-w-2xl">
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className={labelClasses}>Tipe Transaksi</label>
                <select
                  className={inputClasses}
                  value={formData.tipe_transaksi}
                  onChange={(e) => {
                      const tipeTransaksi = e.target.value;
                      setFormData({
                        ...formData,
                        tipe_transaksi: tipeTransaksi,
                        pembelian_dari: tipeTransaksi === "jual" || tipeTransaksi === "hadiah" ? "-" : formData.pembelian_dari,
                      });
                    }}
                >
                  <option value="" disabled>Pilih Tipe Transaksi</option>
                  <option value="jual">Jual</option>
                  <option value="beli">Beli</option>
                  <option value="hadiah">Hadiah</option>
                </select>
              </div>
              {formData.tipe_transaksi === "beli" && (
              <div className="mb-4">
                <label className={labelClasses}>Pembelian Dari</label>
                <select
                  className={inputClasses}
                  value={formData.pembelian_dari}
                  onChange={(e) => setFormData({ ...formData, pembelian_dari: e.target.value })}
                >
                  <option value="" disabled>Pilih Asal Pembelian</option>
                  <option value="web">Web</option>
                  <option value="buyback">Buyback</option>
                </select>
              </div>
              )}
              <div className="mb-4">
                <label className={labelClasses}>Tanggal Transaksi</label>
                <input
                  type="datetime-local"
                  className={inputClasses}
                  value={formData.tanggal_transaksi}
                  onChange={(e) => setFormData({ ...formData, tanggal_transaksi: e.target.value })}
                />
              </div>
              {((formData.tipe_transaksi === "jual" || formData.tipe_transaksi === "hadiah") || (formData.tipe_transaksi === "beli" && formData.pembelian_dari === "buyback")) && (
                <div className="mb-4">
                  <label className={labelClasses}>{formData.tipe_transaksi === 'beli' ? 'Dibeli Dari' : formData.tipe_transaksi === 'jual' ? 'Dijual Kepada' : 'Didapat Dari'}</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder={`${formData.tipe_transaksi === 'beli' ? 'Masukkan Nama Penjual' : formData.tipe_transaksi === 'jual' ? 'Masukkan Nama Pembeli' : ''}`}
                    value={formData.nama_pembeli}
                    onChange={(e) => setFormData({ ...formData, nama_pembeli: e.target.value })}
                  />
                </div>
              )}
              {formData.detail.map((detail, index) => (
                <div key={index} className="mb-4 border border-gray-200 p-4 rounded-xl bg-gray-50">
                  <h2 className="text-sm font-semibold text-emerald-700 mb-3">Produk {index + 1}</h2>
                  <div className="mb-3">
                    <select
                      value={detail.id_dinar}
                      onChange={(e) => handleInputChange(index, "id_dinar", e.target.value)}
                      className={inputClasses}
                    >
                      <option value="" disabled>Pilih Produk</option>
                      {dinarOptions.map((dinar) => (
                        <option key={dinar.id} value={dinar.id}>
                          {dinar.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClasses}>Jumlah</label>
                      <input
                        type="number" inputMode="numeric" pattern="[0-9]*"
                        name="jumlah"
                        className={inputClasses}
                        value={detail.jumlah}
                        min={0}
                        placeholder="0"
                        onChange={(e) => handleInputChange(index, "jumlah", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Harga Satuan</label>
                      <input
                        type="number" inputMode="numeric" pattern="[0-9]*"
                        name="hargaSatuan"
                        min={0}
                        minLength={6}
                        className={inputClasses}
                        value={detail.harga_satuan}
                        placeholder="0"
                        onChange={(e) => handleInputChange(index, "harga_satuan", e.target.value)}
                      />
                      {priceSuggestions[index] && (
                        <div className="mt-2 flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleInputChange(index, "harga_satuan", priceSuggestions[index]!.konsumen.toString())}
                          className="text-left px-2 py-1.5 text-[11px] font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                          >
                            <span className="opacity-70">Konsumen:</span> {priceSuggestions[index]!.konsumen.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInputChange(index, "harga_satuan", priceSuggestions[index]!.buyback.toString())}
                          className="text-left px-2 py-1.5 text-[11px] font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          >
                            <span className="opacity-70">Buyback:</span> {priceSuggestions[index]!.buyback.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-red-500 hover:text-red-600 text-xs font-medium flex items-center gap-1 transition-colors"
                    onClick={() => removeDetail(index)}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Hapus
                  </button>
                </div>
              ))}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  type="button"
                  className="text-emerald-700 hover:text-emerald-800 border border-emerald-300 hover:border-emerald-400 bg-emerald-50 hover:bg-emerald-100 font-medium rounded-xl text-sm px-4 py-2.5 transition-all flex items-center gap-2"
                  onClick={addDetail}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Tambah Produk
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-semibold rounded-xl text-sm px-6 py-2.5 hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
