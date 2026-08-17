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

const inputClasses = "mt-1 block w-full bg-emerald-800/50 border border-emerald-700/50 text-white placeholder-emerald-500/50 rounded-xl p-2.5 focus:bg-emerald-800/70 focus:border-gold-500/50 transition-all text-sm";
const labelClasses = "block text-sm font-semibold text-emerald-200/80 mb-1";

return (
  <div className="fixed inset-0 flex items-center justify-center bg-emerald-950/80 backdrop-blur-sm z-50">
    <div className="bg-emerald-900 border border-emerald-700/30 sm:mt-5 p-4 sm:p-6 rounded-2xl shadow-2xl w-full sm:w-3/4 lg:w-1/2 max-h-screen sm:max-h-dvh overflow-auto mx-4">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white">Edit Transaksi</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={labelClasses}>Tipe Transaksi</label>
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
            className={inputClasses}
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
              name="pembelian_dari"
              value={formData.pembelian_dari}
              onChange={(e) => setFormData({ ...formData, pembelian_dari: e.target.value })}
              className={inputClasses}
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
            name="tanggal_transaksi"
            value={formatDate(formData.tanggal_transaksi)}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {((formData.tipe_transaksi === "jual" || formData.tipe_transaksi === "hadiah") || (formData.tipe_transaksi === "beli" && formData.pembelian_dari === "buyback")) && (
          <div className="mb-4">
            <label className={labelClasses}>{formData.tipe_transaksi === 'beli' ? 'Dibeli Dari' : formData.tipe_transaksi === 'jual' ? 'Dijual Kepada' : 'Didapat Dari'}</label>
            <input
              type="text"
              name="nama_pembeli"
              className={inputClasses}
              placeholder={`${formData.tipe_transaksi === 'beli' ? 'Masukkan Nama Penjual' : formData.tipe_transaksi === 'jual' ? 'Masukkan Nama Pembeli' : ''}`}
              value={formData.nama_pembeli}
              onChange={handleChange}
            />
          </div>
        )}

        {formData.detail && formData.detail.map((detail: { id_dinar: string | number | readonly string[] | undefined; jumlah: string | number | readonly string[] | undefined; harga_satuan: string | number | readonly string[] | undefined; }, index: number) => (
          <div key={index} className="mb-4 border border-emerald-700/30 p-4 rounded-xl bg-emerald-800/20">
            <h2 className="text-sm font-semibold text-gold-400 mb-3">Produk {index + 1}</h2>
            <div className="mb-3">
              <select
                value={detail.id_dinar}
                onChange={(e) => handleDetailChange(index, "id_dinar", e.target.value)}
                className={inputClasses}
              >
                <option value="" disabled>Pilih Produk</option>
                {dinarOptions.map((dinarOption) => (
                  <option key={dinarOption.id} value={dinarOption.id}>{dinarOption.nama}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClasses}>Jumlah</label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={inputClasses}
                  placeholder="0"
                  value={detail.jumlah}
                  onChange={(e) => handleDetailChange(index, "jumlah", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Harga Satuan</label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={inputClasses}
                  placeholder="0"
                  value={detail.harga_satuan}
                  onChange={(e) => handleDetailChange(index, "harga_satuan", e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              className="mt-3 text-red-400 hover:text-red-300 text-xs font-medium flex items-center gap-1 transition-colors"
              onClick={() => removeDetail(index)}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Hapus Produk
            </button>
          </div>
        ))}

        <button
          type="button"
          className="text-gold-400 hover:text-gold-300 border border-gold-500/30 hover:border-gold-500/50 bg-gold-500/5 hover:bg-gold-500/10 font-medium rounded-xl text-sm px-4 py-2.5 transition-all flex items-center gap-2"
          onClick={addDetail}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Tambah Produk
        </button>

        <div className="mt-5 flex gap-3 border-t border-emerald-700/30 pt-5">
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-semibold text-sm hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg shadow-gold-500/20"
          >
            Simpan
          </button>
          <button
            type="button"
            className="flex-1 py-2.5 rounded-xl bg-emerald-800/50 border border-emerald-700/30 text-emerald-200 font-medium text-sm hover:bg-emerald-800 transition-all"
            onClick={onClose}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default EditTransaksi;
