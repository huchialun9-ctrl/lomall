'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi, getStoredGuild } from '@/lib/api';
import { getSocket } from '@/lib/socket';

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface Message {
  id: string;
  content: string;
  isStaff: boolean;
  createdAt: string;
  user: User;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  category?: string;
  priority?: string;
  assignedTo?: string;
  createdAt: string;
  user: User;
  messages: Message[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  open: { label: '開啟中', color: 'bg-green-500/20 text-green-400' },
  resolved: { label: '已解決', color: 'bg-yellow-500/20 text-yellow-400' },
  closed: { label: '已關閉', color: 'bg-gray-500/20 text-gray-400' },
};

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTicket();
    const guildId = getStoredGuild();
    if (guildId) {
      const socket = getSocket(guildId);
      socket.on('message:created', (data: { ticketId: string; message: Message }) => {
        if (data.ticketId === id) setMessages((prev) => [...prev, data.message]);
      });
      socket.on('ticket:updated', (t: Ticket) => {
        if (t.id === id) setTicket(t);
      });
      return () => {
        socket.off('message:created');
        socket.off('ticket:updated');
      };
    }
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadTicket = async () => {
    try {
      const data = await fetchApi<Ticket>(`/tickets/${id}`);
      setTicket(data);
      setMessages(data.messages);
    } catch { }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await fetchApi(`/tickets/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ userId: 'staff', content: input, isStaff: true }),
      });
      setInput('');
      loadTicket();
    } catch { }
    setSending(false);
  };

  const handleClose = async () => {
    try {
      await fetchApi(`/tickets/${id}/close`, { method: 'PATCH' });
      loadTicket();
    } catch { }
  };

  const handleReopen = async () => {
    try {
      await fetchApi(`/tickets/${id}/reopen`, { method: 'PATCH' });
      loadTicket();
    } catch { }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">載入中...</div>;
  if (!ticket) return <div className="text-center py-12 text-gray-500">工單不存在</div>;

  const statusStyle = statusLabels[ticket.status] || statusLabels.open;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.push('/dashboard/tickets')}
        className="text-gray-400 hover:text-white mb-4 inline-block transition-colors"
      >
        ← 返回工單列表
      </button>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{ticket.subject}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full ${statusStyle.color}`}>
                {statusStyle.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>👤 {ticket.user?.username || '未知'}</span>
              {ticket.category && <span>📁 {ticket.category}</span>}
              {ticket.priority && <span>🏷️ {ticket.priority}</span>}
              {ticket.assignedTo && <span>👑 指派給：{ticket.assignedTo}</span>}
              <span>📅 {new Date(ticket.createdAt).toLocaleDateString('zh-TW')}</span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            {ticket.status === 'open' && (
              <button
                onClick={handleClose}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
              >
                🔒 關閉工單
              </button>
            )}
            {ticket.status === 'closed' && (
              <button
                onClick={handleReopen}
                className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
              >
                🔓 重新開啟
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-4 max-h-[55vh] overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">💬</p>
            <p>尚無對話記錄</p>
          </div>
        )}
        {messages.map((msg) => {
          const time = new Date(msg.createdAt).toLocaleString('zh-TW');
          return (
            <div key={msg.id} className={`flex ${msg.isStaff ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                msg.isStaff
                  ? 'bg-[#5865f2]/20 border border-[#5865f2]/30'
                  : 'bg-gray-800 border border-gray-700'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {msg.isStaff ? '🛠️ ' : ''}{msg.user?.username || '未知'}
                  </span>
                  {msg.isStaff && (
                    <span className="text-[10px] bg-[#5865f2]/30 text-[#5865f2] px-1.5 py-0.5 rounded">
                      STAFF
                    </span>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-[10px] text-gray-600 mt-1 text-right">{time}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {ticket.status === 'open' && (
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="輸入回覆訊息... (Enter 送出，Shift+Enter 換行)"
            rows={2}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#5865f2] resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors self-end"
          >
            {sending ? '發送中...' : '發送 ➤'}
          </button>
        </div>
      )}
      {ticket.status === 'closed' && (
        <div className="text-center py-4 text-gray-500 text-sm bg-gray-900 rounded-xl border border-gray-800">
          此工單已關閉。如需重新開啟請點擊上方「重新開啟」按鈕。
        </div>
      )}
    </div>
  );
}
