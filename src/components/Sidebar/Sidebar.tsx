import React from 'react';

export default function Sidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
    return (
        <div className="relative flex">
              <aside
                    className={`fixed inset-t-4 left-0 transform min-h-screen ${
                    isSidebarOpen ? 'translate-x-0 ' : '-translate-x-full md:w-16'
                    } w-64  bg-gray-50 border-r-2 z-40 transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
                >
                    <div className="px-3 py-4 h-full">
                    <ul className="space-y-2">
                        <li>
                            <a href="/home"
                                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                <svg className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                                </svg>
                                {isSidebarOpen && <span className="ml-3">Dashboard</span>}
                            </a>
                        </li>
                        <li>
                            <a href="/produk"
                                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                                        clipRule="evenodd"></path>
                                </svg>
                                {isSidebarOpen && <span className="ml-3">Lihat Produk</span>}
                            </a>
                        </li>
                        <li>
                            <a href="/transaksi"
                                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z">
                                    </path>
                                    <path
                                        d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z">
                                    </path>
                                </svg>
                                {isSidebarOpen && <span className="ml-3">Tambah Transaksi</span>}
                            </a>
                        </li>
                        <li>
                            <a href="/riwayat"
                                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                    fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="currentColor">
                                        <g id="Icon-Set" transform="translate(-310.000000, -101.000000)" fill="currentColor">
                                            <path d="M334,111 L318,111 C317.447,111 317,110.553 317,110 C317,109.448 317.447,109 318,109 L334,109 C334.553,109 335,109.448 335,110 C335,110.553 334.553,111 334,111 L334,111 Z M334,117 L318,117 C317.447,117 317,116.553 317,116 C317,115.448 317.447,115 318,115 L334,115 C334.553,115 335,115.448 335,116 C335,116.553 334.553,117 334,117 L334,117 Z M334,123 L318,123 C317.447,123 317,122.553 317,122 C317,121.448 317.447,121 318,121 L334,121 C334.553,121 335,121.448 335,122 C335,122.553 334.553,123 334,123 L334,123 Z M338,101 L314,101 C311.806,101 310,102.969 310,105.165 L310,129.023 C310,131.22 311.779,133 313.974,133 L337.817,133 C340.012,133 342,131.196 342,129 L342,105 C342,102.804 340.194,101 338,101 L338,101 Z">
                                            </path>
                                        </g>
                                    </g>
                                </svg>
                                {isSidebarOpen && <span className="ml-3">Riwayat Transaksi</span>}
                            </a>
                        </li>
                        <li>
                            <a href="/pembelian"
                                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
                                    <path className="sharpcorners_een" d="M10,27h4c0,1.105-0.895,2-2,2S10,28.105,10,27z M23,29c1.105,0,2-0.895,2-2h-4C21,28.105,21.895,29,23,29z M30,9H6.819l-1-5H2v2h2.181l4,20H26v-2H9.819l-0.6-3H26L30,9z"/>
                                </svg>
                                {isSidebarOpen && <span className="ml-3">Pembelian</span>}
                            </a>
                        </li>
                        <li>
                            <a href="/penjualan"
                                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
                                    </path>
                                </svg>
                                {isSidebarOpen && <span className="ml-3">Penjualan</span>}
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}
