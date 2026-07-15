'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getStoredGuild } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('lomall_token');
    const guild = getStoredGuild();

    if (!token) {
      router.push('/login');
      return;
    }

    if (!guild) {
      router.push('/dashboard/select-guild');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
    </div>
  );
}
