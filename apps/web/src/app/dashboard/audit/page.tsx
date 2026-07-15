'use client';

import { useEffect, useState } from 'react';
import { fetchApi, getStoredGuild } from '@/lib/api';

const actionLabels: Record<string, string> = {
  ticket_create: '建立工單',
  ticket_close: '關閉工單',
  ticket_reopen: '重新開啟',
  ticket_assign: '指派工單',
  message_delete: '刪除訊息',
  settings_update: '修改設定',
};

interface AuditEntry {
  id: string;
  action: string;
  details?: any;
  createdAt: string;
  user: { username: string };
  ticket?: { subject: string };
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guildId = getStoredGuild();
    if (!guildId) return;

    fetchApi<AuditEntry[]>(`/guilds/${guildId}/audit-logs`).then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">審計日誌</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-500">載入中...</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">📋</p>
          <p>尚無審計記錄</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-gray-900 rounded-xl px-5 py-3.5 border border-gray-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#5865f2] font-medium">
                  {log.user?.username || '未知'}
                </span>
                <span className="text-gray-400">
                  {actionLabels[log.action] || log.action}
                </span>
                {log.ticket && (
                  <span className="text-gray-500 text-sm">
                    在工單「{log.ticket.subject}」
                  </span>
                )}
              </div>
              <span className="text-gray-600 text-sm whitespace-nowrap ml-4">
                {new Date(log.createdAt).toLocaleString('zh-TW')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
