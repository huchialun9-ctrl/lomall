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

const statusColors: Record<string, string> = {
  open: 'bg-green-500/20 text-green-400',
  resolved: 'bg-yellow-500/20 text-yellow-400',
  closed: 'bg-gray-500/20 text-gray-400',
};

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <Link
      href={`/dashboard/tickets/${ticket.id}`}
      className="block bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-colors border border-gray-800"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold truncate">{ticket.subject}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full capitalize ${
            statusColors[ticket.status] || 'bg-gray-500/20 text-gray-400'
          }`}
        >
          {ticket.status}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{ticket.user.username}</span>
        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
