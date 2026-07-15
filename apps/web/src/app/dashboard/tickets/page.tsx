'use client';

import { useEffect, useState } from 'react';
import { fetchApi, getStoredGuild } from '@/lib/api';
import TicketCard from '@/components/TicketCard';

type Filter = 'all' | 'open' | 'resolved' | 'closed';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  category?: string;
  createdAt: string;
  user: { username: string; avatar?: string };
}

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'open', label: '🟢 開啟中' },
  { key: 'resolved', label: '🟡 已解決' },
  { key: 'closed', label: '⚫ 已關閉' },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guildId = getStoredGuild();
    if (!guildId) return;

    fetchApi<Ticket[]>(`/tickets?guildId=${guildId}`).then((data) => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">工單列表</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-[#5865f2] text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">載入中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">📭</p>
          <p>沒有工單</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
