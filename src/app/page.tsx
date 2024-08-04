"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState<{ nama_user: string } | null>(null);
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const nama_user = localStorage.getItem('nama_user');
    if (nama_user) {
      setUser({ nama_user });
    }
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
        localStorage.removeItem('username');
        setUser(null);
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Home</h1>
        {user ? (
          <p className="text-xl text-gray-800 mb-4">
            Halo, <span className="font-semibold">{user.nama_user}</span>!
          </p>
        ) : (
          <p className="text-lg text-gray-600">
            Please <a href="/login" className="text-blue-500 hover:underline">login</a> or
            <a href="/register" className="text-blue-500 hover:underline"> register</a>.
          </p>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
