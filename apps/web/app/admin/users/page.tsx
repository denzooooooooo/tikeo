'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
  createdAt: string;
  _count: {
    orders: number;
    tickets: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('auth_tokens');
        const parsedToken = token ? JSON.parse(token) : null;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (parsedToken?.accessToken) {
          headers['Authorization'] = `Bearer ${parsedToken.accessToken}`;
        }

        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
        });
        if (search) params.append('search', search);

        const response = await fetch(`${API_URL}/admin/users?${params}`, {
          headers,
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des utilisateurs');
        }

        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Demo data
        setUsers([
          { id: '1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', avatar: null, role: 'USER', createdAt: '2024-01-15', _count: { orders: 5, tickets: 12 } },
          { id: '2', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', avatar: null, role: 'ORGANIZER', createdAt: '2024-02-20', _count: { orders: 3, tickets: 8 } },
          { id: '3', email: 'admin@tikeo.com', firstName: 'Admin', lastName: 'Tikeo', avatar: null, role: 'ADMIN', createdAt: '2024-01-01', _count: { orders: 0, tickets: 0 } },
        ]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, search]);

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { label: string; className: string }> = {
      ADMIN: { label: 'Admin', className: 'bg-red-100 text-red-700' },
      ORGANIZER: { label: 'Organisateur', className: 'bg-purple-100 text-purple-700' },
      USER: { label: 'Utilisateur', className: 'bg-blue-100 text-blue-700' },
    };
    const r = roles[role] || { label: role, className: 'bg-gray-100 text-gray-700' };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.className}`}>{r.label}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-500 mt-1">Gérer les utilisateurs de la plateforme</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par email, nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-700 text-sm">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Commandes</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Billets</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Inscrit le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] flex items-center justify-center text-white font-bold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 text-gray-700">{user._count.orders}</td>
                  <td className="px-6 py-4 text-gray-700">{user._count.tickets}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

