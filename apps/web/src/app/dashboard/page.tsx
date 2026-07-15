'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi, getStoredGuild } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import TicketCard from '@/components/TicketCard';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  category?: string;
  createdAt: string;
  user: { username: string; avatar?: string };
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [guildName, setGuildName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const guildId = getStoredGuild();
    if (!guildId) return;

    fetchApi<any>(`/guilds/${guildId}`)
      .then((g) => setGuildName(g.name))
      .catch(() => {});

    fetchApi<Ticket[]>(`/tickets?guildId=${guildId}`).then((data) => {
      setTickets(data);
      setLoading(false);
    });

    const socket = getSocket(guildId);
    socket.on('ticket:created', (t: Ticket) => setTickets((prev) => [t, ...prev]));
    socket.on('ticket:updated', (t: Ticket) =>
      setTickets((prev) => prev.map((x) => (x.id === t.id ? t : x))),
    );

    return () => {
      socket.off('ticket:created');
      socket.off('ticket:updated');
    };
  }, []);

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;
  const closedCount = tickets.filter((t) => t.status === 'closed').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">儀表板總覽</h1>
          {guildName && <p className="text-gray-500 text-sm">{guildName}</p>}
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('lomall_guild');
            router.push('/dashboard/select-guild');
          }}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          🔄 切換伺服器
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">總工單數</p>
          <p className="text-3xl font-bold mt-1">{tickets.length}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">🟢 開啟中</p>
          <p className="text-3xl font-bold mt-1 text-green-400">{openCount}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">🟡 已解決</p>
          <p className="text-3xl font-bold mt-1 text-yellow-400">{resolvedCount}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">⚫ 已關閉</p>
          <p className="text-3xl font-bold mt-1 text-gray-400">{closedCount}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">最近工單</h2>
      {loading ? (
        <div className="text-center py-12 text-gray-500">載入中...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">📭</p>
          <p>目前沒有任何工單</p>
          <p className="text-sm mt-2">在 Discord 中使用 <code className="bg-gray-800 px-2 py-0.5 rounded">/ticket create</code> 建立第一張工單</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tickets.slice(0, 9).map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
