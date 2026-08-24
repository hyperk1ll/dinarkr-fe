"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import Detail_Modal from "@/components/Detail_Modal/Detail_Modal";
import Edit_Transaksi from "@/components/Edit_Transaksi/Edit_Transaksi";
import Delete_Modal from "@/components/Delete_Modal/Delete_Modal";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function TransaksiBeliPage() {
  interface Transaction {
    details: any[];
    totalHarga: number;
    id_transaksi: number;
    tipe_transaksi: string;
    pembelian_dari: string;
    tanggal_transaksi: string;
    nama_pembeli: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedDelete, setSelectedDelete] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/transaksi/get-transaksi-beli`
      );
      if (!response.data.error) {
        const groupedTransactions = response.data.data.reduce(
          (acc: Transaction[], item: any) => {
            const existingTransaction = acc.find((trans) => trans.id_transaksi === item.id_transaksi);
            const totalHarga = item.jumlah * item.harga_satuan;
            if (existingTransaction) {
              existingTransaction.details.push({ id_dinar: item.id_dinar, jumlah: item.jumlah, harga_satuan: item.harga_satuan, totalHarga });
              existingTransaction.totalHarga += totalHarga;
            } else {
              acc.push({ id_transaksi: item.id_transaksi, tipe_transaksi: item.tipe_transaksi, pembelian_dari: item.pembelian_dari, tanggal_transaksi: item.tanggal_transaksi, nama_pembeli: item.nama_pembeli, totalHarga, details: [{ id_dinar: item.id_dinar, jumlah: item.jumlah, harga_satuan: item.harga_satuan, totalHarga }] });
            }
            return acc;
          }, []
        );
        setTransactions(groupedTransactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const checkScreenSize = () => { if (window.innerWidth < 768) setIsSidebarOpen(false); };
    checkScreenSize();
    fetchTransactions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (transaction: Transaction) => { setSelectedTransaction(transaction); setIsEditModalOpen(true); };
  const handleDetailClick = (details: any[]) => { setSelectedDetails(details); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setSelectedDetails([]); };
  const closeEditModal = () => { setIsEditModalOpen(false); setSelectedTransaction(null); };
  const closeDeleteModal = () => { setIsDeleteModalOpen(false); setSelectedDelete(null); };

  const handleEditSubmit = async (updatedTransaction: Transaction) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transaksi/edit-transaksi/${updatedTransaction.id_transaksi}`, updatedTransaction);
      if (!response.data.error) { await fetchTransactions(); closeEditModal(); Swal.fire({ title: 'Sukses', text: 'Data transaksi berhasil diubah', icon: 'success', confirmButtonText: 'Oke' }); }
    } catch (error) { console.error("Error updating transaction:", error); }
  };

  const handleDeleteClick = (transaction: Transaction) => { setSelectedDelete(transaction); setIsDeleteModalOpen(true); };

  const handleDeleteConfirm = async () => {
    if (selectedDelete) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transaksi/delete-transaksi/${selectedDelete.id_transaksi}`);
        if (!response.data.error) { setTransactions(transactions.filter((t) => t.id_transaksi !== selectedDelete.id_transaksi)); closeDeleteModal(); Swal.fire({ title: 'Sukses', text: 'Data transaksi berhasil dihapus', icon: 'success', confirmButtonText: 'Oke' }); }
      } catch (error) { console.error("Error deleting transaction:", error); }
    }
  };

  const formatDate = (dateStr: string | number | Date) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours());
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    return date.toLocaleString('en-GB', options).replace(',', '');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
    <Navbar onSidebarToggle={handleSidebarToggle} />
    <div className="flex flex-col md:flex-row">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-grow p-4 md:p-6 overflow-x-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-emerald-950">Transaksi Pembelian</h1>
            <p className="text-sm text-emerald-700/80 mt-1">Daftar transaksi pembelian dinar</p>
          </div>
          <div className="overflow-x-auto">
          {transactions.length > 0 ? (
            <div className="rounded-xl border border-emerald-200 overflow-hidden shadow-lg">
              <table className="min-w-full">
                <thead className="bg-emerald-100/80 border-b border-emerald-700/30">
                  <tr>
                    {['No', 'Tipe', 'Dari', 'Tanggal', 'Nama', 'Total Harga', 'Aksi'].map((h) => (
                      <th key={h} scope="col" className="px-4 py-3.5 text-left text-[11px] font-bold text-emerald-700/80 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-800/30">
                  {transactions.map((transaction, index) => (
                    <tr key={transaction.id_transaksi} className="hover:bg-emerald-800/20 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-emerald-200">{index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Beli</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-emerald-700/70">
                        {transaction.pembelian_dari === "web" ? "Web" : transaction.pembelian_dari === "buyback" ? "Buyback" : "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-emerald-700/70">{formatDate(transaction.tanggal_transaksi)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-emerald-200">{transaction.nama_pembeli}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gold-400">
                        {Number(transaction.totalHarga).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-xs font-medium text-gold-400 hover:text-gold-300 border border-gold-500/30 hover:border-gold-500/50 bg-gold-500/5 hover:bg-gold-500/10 px-3 py-1.5 rounded-lg transition-all" onClick={() => handleDetailClick(transaction.details)}>Detail</button>
                          <button className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all" onClick={() => handleEdit(transaction)}><FaEdit size={14} /></button>
                          <button className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all" onClick={() => handleDeleteClick(transaction)}><FaTrash size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-800/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <p className="text-emerald-700/80 font-medium">Tidak ada transaksi pembelian ditemukan</p>
            </div>
          )}
        </div>
      </div>
      </div>
      <Detail_Modal isOpen={isModalOpen} onClose={closeModal} details={selectedDetails} />
      {isEditModalOpen && selectedTransaction && (<Edit_Transaksi transaksi={selectedTransaction} onClose={closeEditModal} onSubmit={handleEditSubmit} />)}
      {selectedDelete && (<Delete_Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} />)}
    </div>
  );
}
