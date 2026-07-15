'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { getSocket } from '@/lib/socket';

interface Message {
  id: string;
  content: string;
  isStaff: boolean;
  createdAt: string;
  user: { username: string; avatar?: string };
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  category?: string;
  priority?: string;
  user: { username: string; avatar?: string };
  messages: Message[];
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchApi<Ticket>(`/tickets/${id}`).then((data) => {
      setTicket(data);
      setMessages(data.messages);
      setLoading(false);
    });

    const socket = getSocket();
    socket.on('message:created', (data: { ticketId: string; message: Message }) => {
      if (data.ticketId === id) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => {
      socket.off('message:created');
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await fetchApi(`/tickets/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content: input, isStaff: true }),
    });
    setInput('');
  };

  const handleClose = async () => {
    await fetchApi(`/tickets/${id}/close`, { method: 'PATCH' });
    setTicket((prev) => prev ? { ...prev, status: 'closed' } : null);
  };

  const handleReopen = async () => {
    await fetchApi(`/tickets/${id}/reopen`, { method: 'PATCH' });
    setTicket((prev) => prev ? { ...prev, status: 'open' } : null);
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!ticket) return <p className="text-gray-500">Ticket not found.</p>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <p className="text-gray-500 text-sm">
            by {ticket.user.username} &middot; {ticket.category} &middot; {ticket.priority}
          </p>
        </div>
        <div className="flex gap-2">
          {ticket.status === 'open' && (
            <button
              onClick={handleClose}
              className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
            >
              Close
            </button>
          )}
          {ticket.status === 'closed' && (
            <button
              onClick={handleReopen}
              className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
            >
              Reopen
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 mb-4 max-h-[60vh] overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center py-8">No messages yet.</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isStaff ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-xl px-4 py-2 ${
                msg.isStaff
                  ? 'bg-[#5865f2] text-white'
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              <p className="text-xs opacity-70 mb-1">{msg.user.username}</p>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {ticket.status === 'open' && (
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#5865f2]"
          />
          <button
            onClick={sendMessage}
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-3 rounded-xl transition-colors"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
