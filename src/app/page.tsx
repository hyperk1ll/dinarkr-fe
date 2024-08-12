"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token, nama } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('nama_user', nama);
      localStorage.setItem('email', email);

      router.push('/home');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row sm:flex-col-reverse w-full max-w-4xl bg-white rounded-lg shadow-lg">
        <div className="md:w-1/2">
          <Image
            src="/login-pic.jpeg"
            alt="logo"
            width={520}
            height={100}
            style={{
              objectFit: "cover",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              borderBottomLeftRadius: "6px",
              borderBottomRightRadius: "6px"
            }}
            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
          />
        </div>
        <div className="w-full md:w-1/2 sm:mb-2 p-8 flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <Image src="/logo-text.png" alt="Logo" width={150} height={150} />
          </div>
          <span className="text-l text-start text-gray-800">Harap Masukkan Email dan Password!</span>
          
          <form onSubmit={handleLogin} className="space-y-4 mt-2">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email"
                className="mt-1 px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="mt-1 px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600">
            Don&apos;t have an account?
            <a href="/register" className="text-blue-500 hover:underline"> Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}
