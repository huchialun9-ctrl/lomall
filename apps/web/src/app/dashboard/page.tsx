'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import TicketCard from '@/components/TicketCard';

export default function DashboardPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guildId = localStorage.getItem('guildId');
    if (!guildId) return;

    fetchApi<any[]>(`/tickets?guildId=${guildId}`).then((data) => {
      setTickets(data);
      setLoading(false);
    });

    const socket = getSocket(guildId);
    socket.on('ticket:created', (ticket: any) => {
      setTickets((prev) => [ticket, ...prev]);
    });
    socket.on('ticket:updated', (updated: any) => {
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    });

    return () => {
      socket.off('ticket:created');
      socket.off('ticket:updated');
    };
  }, []);

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Tickets</p>
          <p className="text-3xl font-bold mt-1">{tickets.length}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Open</p>
          <p className="text-3xl font-bold mt-1 text-green-400">{openCount}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm">Resolved</p>
          <p className="text-3xl font-bold mt-1 text-yellow-400">{resolvedCount}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-500">No tickets yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.slice(0, 6).map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
