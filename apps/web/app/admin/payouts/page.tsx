'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

interface OrganizerPayout {
  id: string;
  companyName: string;
  user: { email: string; firstName: string; lastName: string };
  totalEvents: number;
  grossRevenue: number;
  commission: number;
  netPayout: number;
  alreadyPaid: number;
  pendingPayout: number;
  isPayoutConfigured: boolean;
  payoutMethod: string | null;
  payoutStatus: string | null;
}

export default function AdminPayoutsPage() {
  const [organizers, setOrganizers] = useState<OrganizerPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const token = localStorage.getItem('auth_tokens');
        const parsedToken = token ? JSON.parse(token) : null;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (parsedToken?.accessToken) {
          headers['Authorization'] = `Bearer ${parsedToken.accessToken}`;
        }

        const response = await fetch(`${API_URL}/admin/organizers/payouts`, {
          headers,
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des paiements');
        }

        const data = await response.json();
        setOrganizers(data);
      } catch (err) {
        console.error('Error fetching payouts:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Demo data
        setOrganizers([
          {
            id: '1', companyName: 'Tikeo Events', user: { email: 'contact@tikeo.com', firstName: 'John', lastName: 'Doe' },
            totalEvents: 12, grossRevenue: 15000000, commission: 150000, netPayout: 14850000, alreadyPaid: 10000000,
            pendingPayout: 4850000, isPayoutConfigured: true, payoutMethod: 'BANK_TRANSFER', payoutStatus: 'VERIFIED'
          },
          {
            id: '2', companyName: 'Dakar Events', user: { email: 'dakar@events.com', firstName: 'Marie', lastName: 'Diallo' },
            totalEvents: 5, grossRevenue: 5000000, commission: 50000, netPayout: 4950000, alreadyPaid: 0,
            pendingPayout: 4950000, isPayoutConfigured: true, payoutMethod: 'MOBILE_MONEY', payoutStatus: 'PENDING'
          },
          {
            id: '3', companyName: 'Lagos Festival', user: { email: 'lagos@festival.com', firstName: 'Peter', lastName: 'Obi' },
            totalEvents: 3, grossRevenue: 2000000, commission: 20000, netPayout: 1980000, alreadyPaid: 1980000,
            pendingPayout: 0, isPayoutConfigured: false, payoutMethod: null, payoutStatus: null
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' XOF';
  };

  const getPayoutStatusBadge = (status: string | null) => {
    const statuses: Record<string, { label: string; className: string }> = {
      VERIFIED: { label: 'Vérifié', className: 'bg-green-100 text-green-700' },
      PENDING: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
      REJECTED: { label: 'Rejeté', className: 'bg-red-100 text-red-700' },
    };
    if (!status) return <span className="text-gray-400 text-xs">Non configuré</span>;
    const s = statuses[status] || { label: status, className: 'bg-gray-100 text-gray-600' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.className}`}>{s.label}</span>;
  };

  const totalPending = organizers.reduce((sum, o) => sum + o.pendingPayout, 0);
  const totalPaid = organizers.reduce((sum, o) => sum + o.alreadyPaid, 0);
  const totalCommission = organizers.reduce((sum, o) => sum + o.commission, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paiements & Commissions</h1>
          <p className="text-gray-500 mt-1">Gérer les paiements aux organisateurs</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total en attente</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalPending)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total payé</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Commission (1%)</p>
          <p className="text-2xl font-bold text-[#5B7CFF]">{formatCurrency(totalCommission)}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-700 text-sm">{error}</p>
        </div>
      )}

      {/* Organizers Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 animate-pulse">
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Organisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Événements</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Revenus bruts</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Commission (1%)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Net à payer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Déjà payé</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">En attente</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {organizers.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{org.companyName}</p>
                        <p className="text-xs text-gray-500">{org.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{org.totalEvents}</td>
                    <td className="px-6 py-4 text-gray-700">{formatCurrency(org.grossRevenue)}</td>
                    <td className="px-6 py-4 text-orange-600">{formatCurrency(org.commission)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(org.netPayout)}</td>
                    <td className="px-6 py-4 text-green-600">{formatCurrency(org.alreadyPaid)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${org.pendingPayout > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                        {formatCurrency(org.pendingPayout)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {org.isPayoutConfigured ? (
                        <div className="flex flex-col gap-1">
                          {getPayoutStatusBadge(org.payoutStatus)}
                          <span className="text-xs text-gray-400">{org.payoutMethod}</span>
                        </div>
                      ) : (
                        <span className="text-red-500 text-xs">Non configuré</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

