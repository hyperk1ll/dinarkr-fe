"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from "next/link";
import Image from "next/image";
import React from 'react';

export default function Navbar({ onSidebarToggle }: { onSidebarToggle: () => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useState<{ nama_user: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        const nama_user = localStorage.getItem('nama_user');
        const email = localStorage.getItem('email');

        if (nama_user && email) {
          setUser({ nama_user, email });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (token) {
        await axios.post(
          `${apiBaseUrl}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        localStorage.removeItem('authToken');
        localStorage.removeItem('nama_user');
        localStorage.removeItem('email');
        setUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-emerald-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-lg font-semibold text-emerald-700">Memuat...</span>
        </div>
      </div>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-emerald-900 via-emerald-900 to-emerald-800 border-b border-emerald-700/30 shadow-lg shadow-emerald-950/50 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-screen-2xl">
        <div className="flex items-center justify-start w-full md:w-auto">
          {/* Toggle Sidebar Button */}
          <button
            className="text-emerald-200 hover:text-gold-400 focus:outline-none transition-all duration-200 mr-3 p-1.5 rounded-lg hover:bg-emerald-800/50"
            onClick={onSidebarToggle}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </button>

          <Link href="/home" className="flex items-center gap-2 group">
            <Image src="/logo.png" alt="DinarKR Logo" width={128} height={64} className="object-contain" />
          </Link>
        </div>

        {/* Profile dropdown */}
        <div className="flex items-center md:order-2 space-x-3 rtl:space-x-reverse relative">
          <button
            type="button"
            className="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500/30 p-1.5 hover:bg-emerald-800/50 transition-all rounded-xl"
            id="user-menu-button"
            aria-expanded="false"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-sm">
              <span className="text-emerald-950 font-bold text-xs">{user?.nama_user?.charAt(0)?.toUpperCase() || 'U'}</span>
            </div>
            <span className="hidden md:inline-block text-emerald-100 text-sm font-medium">{user?.nama_user}</span>
            <svg className={`w-4 h-4 text-emerald-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-emerald-800 border border-emerald-700/50 rounded-xl shadow-xl shadow-emerald-950/50 overflow-hidden animate-in fade-in slide-in-from-top-1" id="user-dropdown">
              <div className="px-4 py-3 border-b border-emerald-700/30 bg-emerald-800/50">
                <span className="block text-sm font-semibold text-white">{user?.nama_user}</span>
                <span className="block text-xs text-emerald-300/60 truncate mt-0.5">{user?.email}</span>
              </div>
              <ul className="py-1" aria-labelledby="user-menu-button">
                <li>
                  <Link href="/home" className="flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-200 hover:bg-emerald-700/50 hover:text-gold-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
