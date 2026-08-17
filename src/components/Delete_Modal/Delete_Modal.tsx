import React from 'react';

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-emerald-950/80 backdrop-blur-sm z-50">
      <div className="bg-emerald-900 border border-emerald-700/30 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Konfirmasi Hapus</h2>
          <p className="text-emerald-300/60 text-sm">Apakah yakin menghapus data transaksi ini? Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-800/50 border border-emerald-700/30 text-emerald-200 font-medium text-sm hover:bg-emerald-800 transition-all"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
            onClick={onConfirm}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
