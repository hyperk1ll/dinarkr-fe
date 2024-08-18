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
            const existingTransaction = acc.find(
              (trans) => trans.id_transaksi === item.id_transaksi
            );
            const totalHarga = item.jumlah * item.harga_satuan;
            if (existingTransaction) {
              existingTransaction.details.push({
                id_dinar: item.id_dinar,
                jumlah: item.jumlah,
                harga_satuan: item.harga_satuan,
                totalHarga,
              });
              existingTransaction.totalHarga += totalHarga;
            } else {
              acc.push({
                id_transaksi: item.id_transaksi,
                tipe_transaksi: item.tipe_transaksi,
                pembelian_dari: item.pembelian_dari,
                tanggal_transaksi: item.tanggal_transaksi,
                nama_pembeli: item.nama_pembeli,
                totalHarga,
                details: [
                  {
                    id_dinar: item.id_dinar,
                    jumlah: item.jumlah,
                    harga_satuan: item.harga_satuan,
                    totalHarga,
                  },
                ],
              });
            }
            return acc;
          },
          []
        );
        setTransactions(groupedTransactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

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

    fetchTransactions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDetailClick = (details: any[]) => {
    setSelectedDetails(details);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDetails([]);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDelete(null);
  };

  const handleEditSubmit = async (updatedTransaction: Transaction) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/transaksi/edit-transaksi/${updatedTransaction.id_transaksi}`,
        updatedTransaction
      );
      if (!response.data.error) {
        // Refetch transactions after a successful update
        await fetchTransactions();

        closeEditModal();

        Swal.fire({
          title: 'Sukses',
          text: 'Data transaksi berhasil diubah',
          icon: 'success',
          confirmButtonText: 'Oke',
        });
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDelete) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/transaksi/delete-transaksi/${selectedDelete.id_transaksi}`
        );
        if (!response.data.error) {
          setTransactions(
            transactions.filter(
              (t) => t.id_transaksi !== selectedDelete.id_transaksi
            )
          );
          closeDeleteModal();

          Swal.fire({
            title: 'Sukses',
            text: 'Data transaksi berhasil dihapus',
            icon: 'success',
            confirmButtonText: 'Oke',
          });
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const formatDate = (dateStr: string | number | Date) => {
    const date = new Date(dateStr);

    // Mengurangi satu jam
    date.setHours(date.getHours());

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    
    return date.toLocaleString('en-GB', options).replace(',', '');
};

  return (
    <div className="w-full min-h-screen bg-white">
    <Navbar onSidebarToggle={handleSidebarToggle} />
    <div className="flex flex-col md:flex-row">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-grow p-4 overflow-x-auto">
          <h1 className="text-2xl font-bold mb-4">Transaksi Pembelian</h1>
          <div className=" overflow-x-auto"> {/* relative  */}
          {transactions.length > 0 ? (
            <div className="rounded-lg border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      Tipe Transaksi
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      Pembelian Dari
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      Tanggal Transaksi
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      Nama Pembeli
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      Total Harga
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr key={transaction.id_transaksi}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.tipe_transaksi === "jual"
                          ? "Jual"
                          : transaction.tipe_transaksi === "beli"
                          ? "Beli"
                          : "Hadiah"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.pembelian_dari === "web"
                          ? "Web"
                          : transaction.pembelian_dari === "buyback"
                          ? "Buyback"
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {formatDate(transaction.tanggal_transaksi)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.nama_pembeli}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.totalHarga.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 align-middle"
                          onClick={() => handleDetailClick(transaction.details)}
                        >
                          Lihat Detail
                        </button>
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded mr-2 align-middle"
                          onClick={() => handleEdit(transaction)}
                        >
                          <FaEdit size={20} height={10} /> {/* Edit icon */}
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded align-middle"
                          onClick={() => handleDeleteClick(transaction)}
                        >
                          <FaTrash size={20} /> {/* Delete icon */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Tidak ada transaksi ditemukan</p>
          )}
        </div>
      </div>
      </div>
      <Detail_Modal isOpen={isModalOpen} onClose={closeModal} details={selectedDetails} />
      {isEditModalOpen && selectedTransaction && (
        <Edit_Transaksi
          transaksi={selectedTransaction}
          onClose={closeEditModal}
          onSubmit={handleEditSubmit}
        />
      )}
      {selectedDelete && (
        <Delete_Modal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
