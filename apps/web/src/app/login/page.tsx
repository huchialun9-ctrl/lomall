'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true);
    window.location.href = `${API_URL}/auth/discord`;
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-2xl text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2">Lomall</h1>
        <p className="text-gray-400 mb-8">Sign in to manage your tickets</p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 text-white px-8 py-3 rounded-lg font-semibold transition-colors w-full"
        >
          {loading ? 'Redirecting...' : 'Sign in with Discord'}
        </button>
      </div>
    </main>
  );
}
