'use client';

import Link from 'next/link';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  category?: string;
  priority?: string;
  createdAt: string;
  user: { username: string; avatar?: string };
}

const statusMap: Record<string, { label: string; color: string }> = {
  open: { label: '開啟中', color: 'bg-green-500/20 text-green-400' },
  resolved: { label: '已解決', color: 'bg-yellow-500/20 text-yellow-400' },
  closed: { label: '已關閉', color: 'bg-gray-500/20 text-gray-400' },
};

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const s = statusMap[ticket.status] || { label: ticket.status, color: 'bg-gray-500/20 text-gray-400' };

  return (
    <Link
      href={`/dashboard/tickets/${ticket.id}`}
      className="block bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-colors border border-gray-800"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold truncate flex-1 mr-2">{ticket.subject}</h3>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${s.color}`}>
          {s.label}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <span>👤</span>
          {ticket.user?.username || '未知'}
        </span>
        <span>{new Date(ticket.createdAt).toLocaleDateString('zh-TW')}</span>
      </div>
      {ticket.category && (
        <div className="mt-2">
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
            {ticket.category}
          </span>
        </div>
      )}
    </Link>
  );
}
