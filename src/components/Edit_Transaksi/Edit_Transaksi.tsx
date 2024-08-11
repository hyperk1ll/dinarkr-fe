import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const EditTransaksi = ({ transaksi, onClose, onSubmit }: any) => {
    interface DinarOption {
    id: number;
    nama: string;
  }
  
  
  const [formData, setFormData] = useState({
    tipe_transaksi: "",
    pembelian_dari: "",
    tanggal_transaksi: "",
    nama_pembeli: "",
    detail: [{ id_dinar: "", jumlah: "", harga_satuan: "" }],
    ...transaksi,  // Spread the incoming props to override defaults
  });

  const [dinarOptions, setDinarOptions] = useState<DinarOption[]>([]);
  
  useEffect(() => {
    const fetchDinarOptions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/produk/get-dinar`
        );
        if (!response.data.error) {
          const sortedData = response.data.data.sort((a: { id: number; }, b: { id: number; }) => a.id - b.id);
          setDinarOptions(sortedData);
        }
      } catch (error) {
        console.error("Error fetching dinar options:", error);
      }
    };

    fetchDinarOptions();
  }, []);

  useEffect(() => {
    console.log("Transaksi diterima:", transaksi);
    if (transaksi) {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        tipe_transaksi: transaksi.tipe_transaksi || "",
        pembelian_dari: transaksi.pembelian_dari || "",
        tanggal_transaksi: transaksi.tanggal_transaksi || "",
        nama_pembeli: transaksi.nama_pembeli || "",
        detail: transaksi.details || [{ id_dinar: "", jumlah: "", harga_satuan: "" }],
      }));
    }
  }, [transaksi]);

  useEffect(() => {
    if (formData.tipe_transaksi === "beli" && formData.pembelian_dari === "web") {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        nama_pembeli: "-",
      }));
    }
  }, [formData.tipe_transaksi, formData.pembelian_dari]);

  

  // useEffect to update total price when product details change
  useEffect(() => {
    const updatedTotalHarga = formData.detail.reduce((total: number, item: { jumlah: any; harga_satuan: any; }) => {
      const itemTotal = (item.jumlah || 0) * (item.harga_satuan || 0);
      return total + itemTotal;
    }, 0);

    setFormData((prevFormData: any) => ({
      ...prevFormData,
      totalHarga: updatedTotalHarga,  // Update the total price
    }));
  }, [formData.detail]);
  

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDetailChange = (index: any, field: string, value: string) => {
    const updatedDetails = formData.detail.map((detail: any, i: any) =>
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

  const removeDetail = (index: any) => {
    const updatedDetails = formData.detail.filter((_: any, i: any) => i !== index);
    setFormData({ ...formData, detail: updatedDetails });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    const isFormValid = formData.tipe_transaksi && formData.pembelian_dari && formData.tanggal_transaksi && formData.nama_pembeli && formData.detail.every((detail: { id_dinar: any; jumlah: any; harga_satuan: any; }) => detail.id_dinar && detail.jumlah && detail.harga_satuan);
    
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

    onSubmit(formData);
    console.log("Form data submitted:", formData);
  };


// Format untuk menampilkan waktu lokal dalam format custom
const formatDate = (dateStr: string | number | Date) => {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
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
              value={formatDate(formData.tanggal_transaksi)}
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
          {formData.detail && formData.detail.map((detail: { id_dinar: string | number | readonly string[] | undefined; jumlah: string | number | readonly string[] | undefined; harga_satuan: string | number | readonly string[] | undefined; }, index: React.Key | null | undefined) => (
            <div key={index} className="mb-4 border p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-2">Produk {Number(index ?? 0) + 1}</h2>
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
              <label className="block text-gray-700">Jumlah</label>
                <input
                  type="number"
                  className="mt-1 block w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 shadow-sm"
                  placeholder="Masukkan Jumlah"
                  value={detail.jumlah}
                  onChange={(e) => handleDetailChange(index, "jumlah", e.target.value)}
                />
              </div>
              <div className="mb-2">
              <label className="block text-gray-700">Harga Satuan</label>
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
                className="mt-2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => removeDetail(index)}
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={addDetail}
          >
            Tambah Produk
          </button>
          <div className="mt-4">
            <button
              type="submit"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={handleSubmit}
            >
              Simpan
            </button>
            <button
              type="button"
              className="focus:outline-none text-white bg-gray-500 hover:bg-gray-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
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
