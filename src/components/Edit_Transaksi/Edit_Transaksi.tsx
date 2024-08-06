import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditTransaksi = ({ transaksi, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    tipe_transaksi: "",
    pembelian_dari: "",
    tanggal_transaksi: "",
    nama_pembeli: "",
    detail: [{ id_dinar: "", jumlah: "", harga_satuan: "" }],
    ...transaksi,  // Spread the incoming props to override defaults
  });

  const [dinarOptions, setDinarOptions] = useState([]);

  useEffect(() => {
    const fetchDinarOptions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/get-dinar`
        );
        if (!response.data.error) {
          const sortedData = response.data.data.sort((a, b) => a.id - b.id);
          setDinarOptions(sortedData);
        }
      } catch (error) {
        console.error("Error fetching dinar options:", error);
      }
    };

    fetchDinarOptions();
  }, []);

  useEffect(() => {
    if (transaksi) {
      setFormData({
        ...formData,
        ...transaksi,
        detail: transaksi.detail || [{ id_dinar: "", jumlah: "", harga_satuan: "" }],
      });
    }
  }, [transaksi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDetailChange = (index, field, value) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isFormValid = formData.tipe_transaksi && formData.pembelian_dari && formData.tanggal_transaksi && formData.nama_pembeli && formData.detail.every(detail => detail.id_dinar && detail.jumlah && detail.harga_satuan);
    
    if (formData.detail.length < 1) {
      alert('Harap Isi minimal 1 produk');
      return;
    }

    if (!isFormValid) {
      alert('Harap Isi Semua Field');
      return;
    }

    onSubmit(formData);
  };

  const formatDate = (dateStr) => {
    // Mengonversi string tanggal ke objek Date
    const date = new Date(dateStr);

    date.setHours(date.getHours());

    // Format tanggal ke DD/MM/YY HH:mm:ss
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
    const year = date.getFullYear().toString()
    const hours = String((date.getHours() - 1)).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const convertToDatetimeLocalFormat = (dateStr) => {
  const date = new Date(dateStr);

  // Mendapatkan komponen tahun, bulan, hari, jam, dan menit
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours() - 1).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Format sesuai dengan datetime-local
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 mt-2 max-h-screen overflow-auto">
        <h2 className="text-xl font-bold mb-4">Edit Transaksi</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Tipe Transaksi</label>
            <select
              name="tipe_transaksi"
              value={formData.tipe_transaksi}
              onChange={(e) => {
                const tipeTransaksi = e.target.value;
                setFormData({
                  ...formData,
                  tipe_transaksi: tipeTransaksi,
                  pembelian_dari: tipeTransaksi === "jual" || tipeTransaksi === "hadiah" ? "-" : formData.pembelian_dari,
                });
              }}
              className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 shadow-sm"
            >
              <option value="" disabled>Pilih Tipe Transaksi</option>
              <option value="jual">Jual</option>
              <option value="beli">Beli</option>
              <option value="hadiah">Hadiah</option>
            </select>
          </div>
          {formData.tipe_transaksi === "beli" && (
            <div className="mb-4">
              <label className="block text-gray-700">Pembelian Dari</label>
              <select
                name="pembelian_dari"
                value={formData.pembelian_dari}
                onChange={(e) => setFormData({ ...formData, pembelian_dari: e.target.value })}
                className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 shadow-sm"
              >
                <option value="" disabled>Pilih Asal Pembelian</option>
                <option value="web">Web</option>
                <option value="buyback">Buyback</option>
              </select>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Tanggal Transaksi</label>
            <input
              type="datetime-local"
              name="tanggal_transaksi"
              value={convertToDatetimeLocalFormat(formData.tanggal_transaksi)}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {((formData.tipe_transaksi === "jual" || formData.tipe_transaksi === "hadiah") || (formData.tipe_transaksi === "beli" && formData.pembelian_dari === "buyback")) && (
            <div className="mb-4">
              <label className="block text-gray-700">{formData.tipe_transaksi === 'beli' ? 'Dibeli Dari' : formData.tipe_transaksi === 'jual' ? 'Dijual Kepada' : 'Didapat Dari'}</label>
              <input
                type="text"
                name="nama_pembeli"
                className="mt-1 block w-full border p-2 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`${formData.tipe_transaksi === 'beli' ? 'Masukkan Nama Penjual' : formData.tipe_transaksi === 'jual' ? 'Masukkan Nama Pembeli' : ''}`}
                value={formData.nama_pembeli}
                onChange={handleChange}
              />
            </div>
          )}
          {formData.detail && formData.detail.map((detail, index) => (
            <div key={index} className="mb-4 border p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2">Produk {index + 1}</h2>
              <div className="mb-2">
                <select
                  value={detail.id_dinar}
                  onChange={(e) => handleDetailChange(index, "id_dinar", e.target.value)}
                  className="mt-1 block w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 shadow-sm"
                >
                  <option value="" disabled>Pilih Produk</option>
                  {dinarOptions.map((dinarOption) => (
                    <option key={dinarOption.id} value={dinarOption.id}>{dinarOption.nama}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <input
                  type="number"
                  className="mt-1 block w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 shadow-sm"
                  placeholder="Masukkan Jumlah"
                  value={detail.jumlah}
                  onChange={(e) => handleDetailChange(index, "jumlah", e.target.value)}
                />
              </div>
              <div className="mb-2">
                <input
                  type="number"
                  className="mt-1 block w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 shadow-sm"
                  placeholder="Masukkan Harga Satuan"
                  value={detail.harga_satuan}
                  onChange={(e) => handleDetailChange(index, "harga_satuan", e.target.value)}
                />
              </div>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                onClick={() => removeDetail(index)}
              >
                Hapus Produk
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={addDetail}
          >
            Tambah Produk
          </button>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransaksi;
