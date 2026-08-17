import React from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
    const pathname = usePathname();

    const menuItems = [
        {
            href: '/home',
            label: 'Dashboard',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
            ),
        },
        {
            href: '/produk',
            label: 'Lihat Produk',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
                </svg>
            ),
        },
        {
            href: '/grafik-harga',
            label: 'Grafik Harga',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                </svg>
            ),
        },
        {
            href: '/transaksi',
            label: 'Tambah Transaksi',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                    <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                </svg>
            ),
        },
        {
            href: '/riwayat',
            label: 'Riwayat Transaksi',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0 1 1 0 002 0zm2-1a1 1 0 110 2h4a1 1 0 110-2h-4zm0-4a1 1 0 110 2h4a1 1 0 110-2h-4z" clipRule="evenodd"/>
                </svg>
            ),
        },
        {
            href: '/pembelian',
            label: 'Pembelian',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
            ),
        },
        {
            href: '/penjualan',
            label: 'Penjualan',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
            ),
        },
    ];

    return (
        <div className="relative flex">
            <aside
                className={`absolute inset-t-4 left-0 transform min-h-screen ${
                    isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:w-16'
                } bg-gradient-to-b from-emerald-950 to-emerald-900 border-r border-emerald-800/50 z-40 transition-all duration-300 ease-in-out md:relative md:translate-x-0 shadow-xl shadow-emerald-950/30`}
            >
                <div className="px-3 py-4 h-full">
                    {isSidebarOpen && (
                        <div className="px-3 mb-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/50">Menu Utama</p>
                        </div>
                    )}
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className={`flex items-center p-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                            isActive
                                                ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/10 text-gold-400 border border-gold-500/20 shadow-sm'
                                                : 'text-emerald-300/70 hover:bg-emerald-800/40 hover:text-emerald-100'
                                        }`}
                                    >
                                        <span className={`flex-shrink-0 transition-colors duration-200 ${
                                            isActive ? 'text-gold-400' : 'text-emerald-500/60 group-hover:text-emerald-300'
                                        }`}>
                                            {item.icon}
                                        </span>
                                        {isSidebarOpen && (
                                            <span className="ml-3 whitespace-nowrap">{item.label}</span>
                                        )}
                                        {isActive && isSidebarOpen && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400"></div>
                                        )}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Bottom decoration */}
                {isSidebarOpen && (
                    <div className="absolute bottom-4 left-3 right-3">
                        <div className="p-3 rounded-xl bg-emerald-800/30 border border-emerald-700/20">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></div>
                                <span className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider">Sistem Aktif</span>
                            </div>
                            <p className="text-[10px] text-emerald-500/50">Dinar KR v1.0</p>
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
}
