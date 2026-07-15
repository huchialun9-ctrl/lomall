'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import TicketCard from '@/components/TicketCard';

type FilterStatus = 'all' | 'open' | 'resolved' | 'closed';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guildId = localStorage.getItem('guildId');
    if (!guildId) return;

    fetchApi<any[]>(`/tickets?guildId=${guildId}`).then((data) => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  const filters: FilterStatus[] = ['all', 'open', 'resolved', 'closed'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tickets</h1>

      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-[#5865f2] text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
