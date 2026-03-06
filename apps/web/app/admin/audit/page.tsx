'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  entity: string;
  entityId: string | null;
  oldValue: string | null;
  newValue: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('auth_tokens');
        const parsedToken = token ? JSON.parse(token) : null;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (parsedToken?.accessToken) {
          headers['Authorization'] = `Bearer ${parsedToken.accessToken}`;
        }

        const response = await fetch(`${API_URL}/admin/audit-logs?page=${page}&limit=50`, {
          headers,
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des logs');
        }

        const data = await response.json();
        setLogs(data.logs);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Demo data
        setLogs([
          { id: '1', adminId: 'admin1', action: 'CREATE_PAYOUT', entity: 'PayoutRecord', entityId: 'pay123', oldValue: null, newValue: '{"amount": 500000}', ipAddress: '192.168.1.1', createdAt: '2024-03-15T10:30:00Z' },
          { id: '2', adminId: 'admin1', action: 'UPDATE_USER', entity: 'User', entityId: 'user456', oldValue: '{"role": "USER"}', newValue: '{"role": "ORGANIZER"}', ipAddress: '192.168.1.1', createdAt: '2024-03-14T15:20:00Z' },
          { id: '3', adminId: 'admin1', action: 'DELETE_EVENT', entity: 'Event', entityId: 'event789', oldValue: '{"title": "Old Event"}', newValue: null, ipAddress: '192.168.1.2', createdAt: '2024-03-13T09:15:00Z' },
        ]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page]);

  const getActionBadge = (action: string) => {
    const actions: Record<string, { label: string; className: string }> = {
      CREATE: { label: 'Création', className: 'bg-green-100 text-green-700' },
      UPDATE: { label: 'Modification', className: 'bg-blue-100 text-blue-700' },
      DELETE: { label: 'Suppression', className: 'bg-red-100 text-red-700' },
      LOGIN: { label: 'Connexion', className: 'bg-gray-100 text-gray-700' },
      CREATE_PAYOUT: { label: 'Paiement', className: 'bg-purple-100 text-purple-700' },
    };
    const a = actions[action] || { label: action, className: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${a.className}`}>{a.label}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs d'audit</h1>
          <p className="text-gray-500 mt-1">Historique des actions administrateur</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-700 text-sm">{error}</p>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 animate-pulse">
                <div className="w-20 h-6 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Entité</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID Entité</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(log.createdAt).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.entity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.entityId || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.ipAddress || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Précédent
          </button>
          <span className="text-sm text-gray-600">Page {page} sur {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

