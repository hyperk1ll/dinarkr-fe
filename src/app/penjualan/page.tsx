"use client";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Detail_Modal from "../../components/Detail_Modal/Detail_Modal";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TransaksiBeliPage() {
    

    interface Transaction {
        details(details: any): void;
        totalHarga: number;
        id_transaksi: number;
        tipe_transaksi: string;
        pembelian_dari: string;
        tanggal_transaksi: string;
        nama_pembeli: string;
    }


  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transaksi/get-transaksi-jual`); // replace with your API endpoint
        if (!response.data.error) {
          // Group transactions by id_transaksi and calculate total price
            const groupedTransactions = response.data.data.reduce((acc, item) => {
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
            }, []);
            setTransactions(groupedTransactions);

        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleDetailClick = (details) => {
    setSelectedDetails(details);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDetails([]);
  };

  return (
    <div className="w-full bg-white">
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="p-4 w-full">
          <h1 className="text-2xl font-bold mb-4">Transaksi Penjualan</h1>
          {transactions.length > 0 ? (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Harga
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Detail Transaksi
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
                        {transaction.tipe_transaksi === 'jual' 
                        ? 'Jual' 
                        : transaction.tipe_transaksi === 'beli' 
                        ? 'Beli' 
                        : 'Hadiah'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.pembelian_dari === 'web' 
                        ? 'Web' 
                        : transaction.pembelian_dari === 'buyback' 
                        ? 'Buyback' 
                        : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.tanggal_transaksi).toLocaleString()}
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
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => handleDetailClick(transaction.details)}
                      >
                        Lihat Detail
                      </button>
                    </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          ) : (
            <p>No transactions found</p>
          )}
        </div>
      </div>
      <Detail_Modal isOpen={isModalOpen} onClose={closeModal} details={selectedDetails} />
    </div>
  );
}
