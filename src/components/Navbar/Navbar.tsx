"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from "next/link";
import Image from "next/image";
import React from 'react';

export default function Navbar() {
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
        setIsLoading(false); // Set loading state to false after data is fetched
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
      <div className="flex flex-wrap items-center justify-between p-4 mx-5">
        <Link href="/home" className="flex items-center rtl:space-x-reverse">
          <Image src="/logo.png" className="h-8" alt="Flowbite Logo" quality={100} width={100} height={32} />
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="flex text-sm rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded="false"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Image src="/avatar.png" className="w-8 h-8 rounded-full bg-gray-800" alt="User avatar" width={32} height={32} />
            {user && <span className="mx-2 my-auto text-white">{user.nama_user}</span>}
          </button>
          {dropdownOpen && (
            <div className="absolute top-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow " id="user-dropdown">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 ">{user?.nama_user}</span>
                <span className="block text-sm text-gray-500 truncate ">{user?.email}</span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  ">Dashboard</Link>
                </li>
                <li>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  ">Settings</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  ">Logout</button>
                </li>
              </ul>
            </div>
          )}
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
    </nav>
  );
}
