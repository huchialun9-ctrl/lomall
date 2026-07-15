'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi, getStoredGuild } from '@/lib/api';

interface Guild {
  id: string;
  name: string;
  icon?: string;
}

export default function SelectGuildPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = getStoredGuild();
    if (stored) {
      router.push('/dashboard');
      return;
    }

    fetchApi<any>('/auth/me').then(async (user) => {
      try {
        const res = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        const allGuilds: any[] = await res.json();

        const managed = allGuilds.filter((g: any) => (g.permissions & 0x8) === 0x8);

        const checked: Guild[] = [];
        for (const g of managed) {
          try {
            await fetchApi(`/guilds/${g.id}`);
            checked.push({ id: g.id, name: g.name, icon: g.icon || undefined });
          } catch { }
        }
        setGuilds(checked);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }).catch(() => {
      router.push('/login');
    });
  }, [router]);

  const select = (id: string) => {
    localStorage.setItem('lomall_guild', id);
    router.push('/dashboard');
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-900 p-10 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-800">
        <h1 className="text-2xl font-bold mb-2 text-center">選擇伺服器</h1>
        <p className="text-gray-400 text-center mb-6">選擇要管理的 Discord 伺服器</p>

        {loading ? (
          <p className="text-gray-500 text-center">載入中...</p>
        ) : guilds.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400 mb-4">沒有找到已註冊 Lomall 的伺服器。</p>
            <p className="text-gray-500 text-sm">請先在 Discord 中執行 <code className="bg-gray-800 px-2 py-0.5 rounded">/lomall setup</code></p>
          </div>
        ) : (
          <div className="space-y-2">
            {guilds.map((g) => (
              <button
                key={g.id}
                onClick={() => select(g.id)}
                className="w-full flex items-center gap-3 bg-gray-800 hover:bg-gray-700 transition-colors rounded-xl px-4 py-3 text-left"
              >
                {g.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-white font-bold">
                    {g.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium">{g.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
