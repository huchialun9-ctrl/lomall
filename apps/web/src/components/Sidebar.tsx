'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout, getStoredGuild } from '@/lib/api';

const navItems = [
  { href: '/dashboard', label: '總覽', icon: '📊' },
  { href: '/dashboard/tickets', label: '工單列表', icon: '🎫' },
  { href: '/dashboard/audit', label: '審計日誌', icon: '📋' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-gray-900 min-h-screen p-4 flex flex-col border-r border-gray-800">
      <div className="flex items-center gap-2 mb-8 px-3">
        <span className="text-2xl">🎫</span>
        <span className="text-xl font-bold">
          <span className="text-[#5865f2]">Lomall</span>
        </span>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                active
                  ? 'bg-[#5865f2]/20 text-[#5865f2]'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors w-full text-left"
        >
          <span>🚪</span>
          <span>登出</span>
        </button>
      </div>
    </aside>
  );
}
