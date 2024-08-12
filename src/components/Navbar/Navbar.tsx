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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <nav className="bg-blue-600 border-gray-200">
      <div className="flex flex-wrap items-center justify-between p-4 mx-auto max-w-screen-xl">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/home">
            <Image src="/logo.png" className="h-8" alt="Flowbite Logo" quality={100} width={100} height={32} />
          </Link>
          {/* Toggle Sidebar Button */}
          <button
            className="text-white focus:outline-none md:hidden"
            onClick={onSidebarToggle}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
          </button>
        </div>
        <div className={`flex-col items-center justify-between md:flex-row md:flex ${navbarOpen ? 'block' : 'hidden'} w-full md:w-auto md:space-x-3`}>
          <div className="flex items-center md:order-2 space-x-3 rtl:space-x-reverse">
            <button
              type="button"
              className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Image src="/avatar.png" className="w-8 h-8 rounded-full bg-gray-800" alt="User avatar" width={32} height={32} />
              {user && <span className="ml-2 text-white">{user.nama_user}</span>}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-14 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow" id="user-dropdown">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900">{user?.nama_user}</span>
                  <span className="block text-sm text-gray-500 truncate">{user?.email}</span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
