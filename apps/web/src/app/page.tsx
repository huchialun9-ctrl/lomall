'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('lomall_token');
    const guild = localStorage.getItem('lomall_guild');

    if (token) {
      if (guild) {
        router.push('/dashboard');
      } else {
        router.push('/dashboard/select-guild');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">重新導向中...</p>
    </main>
  );
}
