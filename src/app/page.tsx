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
      alert('Login gagal. Periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400 opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold-400 opacity-[0.03] rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>

      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a817' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm border border-emerald-700/30 relative z-10">
        {/* Left side - Image */}
        <div className="md:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 to-emerald-950/90 z-10"></div>
          <Image
            src="/login-pic.jpeg"
            alt="Koin Dinar"
            width={520}
            height={600}
            style={{ objectFit: "cover" }}
            className="w-full h-full object-cover min-h-[200px] md:min-h-full"
          />
          {/* Overlay content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mb-6"></div>
            <h2 className="text-gold-300 text-2xl md:text-3xl font-bold mb-3">Dinar KR</h2>
            <p className="text-emerald-200/70 text-sm md:text-base max-w-xs">Sistem manajemen transaksi dan produk koin dinar Anda</p>
            <div className="w-16 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full mt-6"></div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-emerald-900 to-emerald-950 p-8 md:p-10 flex flex-col justify-center">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center mb-4 shadow-lg shadow-gold-500/20">
              <svg className="w-7 h-7 text-emerald-950" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 12V8l4 2-4 2z"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-emerald-950">Selamat Datang</h1>
            <p className="text-emerald-700/80 text-sm mt-1">Masukkan kredensial untuk melanjutkan</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-semibold text-emerald-200/80 mb-1.5">Email</label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="nama@email.com"
                className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-950 placeholder-emerald-500/50 rounded-xl focus:bg-emerald-800/70 focus:border-gold-500/50 transition-all"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-semibold text-emerald-200/80 mb-1.5">Password</label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-950 placeholder-emerald-500/50 rounded-xl focus:bg-emerald-800/70 focus:border-gold-500/50 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-lg ${
                isLoading 
                  ? 'bg-gold-600/50 text-gold-200/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 hover:from-gold-400 hover:to-gold-500 hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98]'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Memproses...
                </span>
              ) : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
