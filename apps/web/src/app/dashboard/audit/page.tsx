'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

const actionLabels: Record<string, string> = {
  ticket_create: 'Ticket Created',
  ticket_close: 'Ticket Closed',
  ticket_reopen: 'Ticket Reopened',
  ticket_assign: 'Ticket Assigned',
  message_delete: 'Message Deleted',
  settings_update: 'Settings Updated',
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guildId = localStorage.getItem('guildId');
    if (!guildId) return;

    fetchApi<any[]>(`/guilds/${guildId}/audit-logs`).then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No audit logs yet.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-gray-900 rounded-xl px-5 py-3 border border-gray-800 flex items-center justify-between"
            >
              <div>
                <span className="text-[#5865f2] font-medium">{log.user?.username}</span>
                <span className="text-gray-400 mx-2">
                  {actionLabels[log.action] || log.action}
                </span>
                {log.ticket && (
                  <span className="text-gray-500">
                    on {log.ticket.subject}
                  </span>
                )}
              </div>
              <span className="text-gray-600 text-sm">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
