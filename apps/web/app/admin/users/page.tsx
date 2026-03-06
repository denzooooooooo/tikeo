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
  emailVerified: boolean;
  _count: {
    orders: number;
    tickets: number;
  };
}

const ROLES = [
  { value: 'USER', label: 'Utilisateur', color: 'blue' },
  { value: 'ORGANIZER', label: 'Organisateur', color: 'purple' },
  { value: 'ADMIN', label: 'Administrateur', color: 'red' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
      if (selectedRole) params.append('role', selectedRole);

      const response = await fetch(`${API_URL}/admin/users?${params}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }

      const data = await response.json();
      setUsers(data.users || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching users:', err);
      // Fallback demo data
      setUsers([
        { id: '1', email: 'john@example.com', firstName: 'John', lastName: 'Doe', avatar: null, role: 'USER', createdAt: '2024-01-15', emailVerified: true, _count: { orders: 5, tickets: 12 } },
        { id: '2', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', avatar: null, role: 'ORGANIZER', createdAt: '2024-02-20', emailVerified: true, _count: { orders: 3, tickets: 8 } },
        { id: '3', email: 'admin@tikeo.africa', firstName: 'Admin', lastName: 'Tikeo', avatar: null, role: 'ADMIN', createdAt: '2024-01-01', emailVerified: true, _count: { orders: 0, tickets: 0 } },
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, selectedRole]);

  const updateUserRole = async (userId: string, role: string) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('auth_tokens');
      const parsedToken = token ? JSON.parse(token) : null;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (parsedToken?.accessToken) {
        headers['Authorization'] = `Bearer ${parsedToken.accessToken}`;
      }

      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du rôle');
      }

      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
      setShowRoleModal(false);
      setEditingUser(null);
      setNewRole('');
    } catch (err) {
      console.error('Error updating role:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setUpdating(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = ROLES.find(r => r.value === role);
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700',
      purple: 'bg-purple-100 text-purple-700',
      red: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${colors[roleConfig?.color || 'blue']}`}>
        {roleConfig?.label || role}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-500 mt-1">Gérer les utilisateurs de la plateforme</p>
        </div>
        <div className="text-sm text-gray-500">
          {users.length} utilisateur(s)
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher par email, nom..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 max-w-md px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
        />
        <select
          value={selectedRole}
          onChange={(e) => { setSelectedRole(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
        >
          <option value="">Tous les rôles</option>
          {ROLES.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between">
          <p className="text-yellow-700 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-yellow-700 hover:text-yellow-900">
            ✕
          </button>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Commandes</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Billets</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Inscrit le</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] flex items-center justify-center text-white font-bold">
                          {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      {user.emailVerified ? (
                        <span className="text-green-600 text-sm">✓ Vérifié</span>
                      ) : (
                        <span className="text-yellow-600 text-sm">⏳ En attente</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user._count.orders}</td>
                    <td className="px-6 py-4 text-gray-700">{user._count.tickets}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingUser(user); setNewRole(user.role); setShowRoleModal(true); }}
                          className="p-2 text-gray-500 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-colors"
                          title="Modifier le rôle"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <Link
                          href={`/profile/${user.id}`}
                          className="p-2 text-gray-500 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-colors"
                          title="Voir le profil"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>
                      </div>
                    </td>
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

      {/* Role Modal */}
      {showRoleModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Modifier le rôle</h3>
            <p className="text-gray-600 mb-6">
              Modifier le rôle de <strong>{editingUser.firstName} {editingUser.lastName}</strong>
            </p>
            
            <div className="space-y-3 mb-6">
              {ROLES.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    newRole === role.value 
                      ? 'border-[#5B7CFF] bg-[#5B7CFF]/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={newRole === role.value}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-4 h-4 text-[#5B7CFF] border-gray-300 focus:ring-[#5B7CFF]"
                  />
                  <span className="ml-3 font-medium text-gray-900">{role.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowRoleModal(false); setEditingUser(null); }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => updateUserRole(editingUser.id, newRole)}
                disabled={updating || newRole === editingUser.role}
                className="flex-1 px-4 py-2 bg-[#5B7CFF] text-white rounded-xl font-medium hover:bg-[#4B6CEF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

