"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        name,
        email,
        password
      });
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400 opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md bg-emerald-100 border border-emerald-700/30 rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center mb-4 shadow-lg shadow-gold-500/20">
            <svg className="w-7 h-7 text-emerald-950" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-emerald-950">Daftar Akun Baru</h2>
          <p className="text-emerald-700/80 text-sm mt-1">Isi data di bawah untuk mendaftar</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-semibold text-emerald-200/80 mb-1.5">Nama</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Nama lengkap"
              className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-950 placeholder-emerald-500/50 rounded-xl focus:bg-emerald-800/70 focus:border-gold-500/50 transition-all"
              required
            />
          </div>
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
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm tracking-wide bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 hover:from-gold-400 hover:to-gold-500 hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg"
          >
            Daftar
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-emerald-700/80">
          Sudah punya akun?{' '}
          <a href="/" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">Masuk</a>
        </p>
      </div>
    </div>
  );
}
