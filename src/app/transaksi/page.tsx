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
    tanggal_transaksi: "",
    nama_pembeli: "",
    detail: [{ id_dinar: "", jumlah: "", harga_satuan: "" }],
  });

  useEffect(() => {
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

  const handleInputChange = (index, field, value) => {
    const updatedDetails = formData.detail.map((detail, i) =>
      i === index ? { ...detail, [field]: value } : detail
    );
    setFormData({ ...formData, detail: updatedDetails });
  };


  const addDetail = () => {
    setFormData({
      ...formData,
      detail: [...formData.detail, { id_dinar: "", jumlah: "", harga_satuan: "" }],
    });
  };

    const removeDetail = (index) => {
        const updatedDetails = formData.detail.filter((_, i) => i !== index);
        setFormData({ ...formData, detail: updatedDetails });
    };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // check if all fields are filled
    const isFormValid = formData.tipe_transaksi && formData.tanggal_transaksi && formData.nama_pembeli && formData.detail.every(detail => detail.id_dinar && detail.jumlah && detail.harga_satuan);

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
        tanggal_transaksi: "",
        nama_pembeli: "",
        detail: [{ id_dinar: "", jumlah: "", harga_satuan: "" }],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };



  return (
    <div className="w-full bg-white min-h-screen">
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">Form Transaksi</h1>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Tipe Transaksi</label>
              <select
                className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 shadow-sm"
                value={formData.tipe_transaksi}
                onChange={(e) => setFormData({ ...formData, tipe_transaksi: e.target.value })}
              >

                <option value="" className="text-gray-200" selected disabled>Pilih Tipe Transaksi</option>
                <option value="jual">Jual</option>
                <option value="beli">Beli</option>
                <option value="hadiah">Hadiah</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 ">Tanggal Transaksi</label>
              <input
                type="datetime-local"
                className="mt-1 block w-full border rounded-md p-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tanggal_transaksi}
                onChange={(e) => setFormData({ ...formData, tanggal_transaksi: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nama Pembeli</label>
              <input
                type="text"
                className="mt-1 block w-full border p-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan Nama Pembeli"
                value={formData.nama_pembeli}
                onChange={(e) => setFormData({ ...formData, nama_pembeli: e.target.value })}
              />
            </div>
            {formData.detail.map((detail, index) => (
              <div key={index} className="mb-4 border p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Produk {index + 1}</h2>
                <div className="mb-2 rounded-md">
                <select
                  value={detail.id_dinar}
                  onChange={(e) => handleInputChange(index, "id_dinar", e.target.value)}
                  className="mt-1 block w-full border p-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" selected disabled>Pilih Produk</option>
                  {dinarOptions.map((dinar) => (
                    <option key={dinar.id} value={dinar.id}>
                      {dinar.nama}
                    </option>
                  ))}
                </select>
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700">Jumlah</label>
                  <input
                    type="number"
                    name="jumlah"
                    className="mt-1 block w-full border p-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={detail.jumlah}
                    min={0}
                    onChange={(e) => handleInputChange(index, "jumlah", e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700">Harga Satuan</label>
                  <input
                    type="number"
                    name="hargaSatuan"
                    min={0}
                    minLength={6}
                    className="mt-1 block w-full border p-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={detail.harga_satuan}
                    onChange={(e) => handleInputChange(index, "harga_satuan", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  onClick={() => removeDetail(index)}
                >
                  Hapus
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mb-4  text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={addDetail}
            >
              Add Produk
            </button>
            <button
              type="submit"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}