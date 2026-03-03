'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TicketIcon, MoneyIcon, CalendarIcon, CheckCircleIcon } from '@tikeo/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

function getAuthToken(): string | null {
  try {
    const storedTokens = localStorage.getItem('auth_tokens');
    if (storedTokens) {
      const parsed = JSON.parse(storedTokens);
      return parsed.accessToken || null;
    }
  } catch {
    // ignore
  }
  return null;
}

interface OrderItem {
  id: string;
  ticketType?: { name: string };
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  createdAt: string;
  event?: {
    id: string;
    title: string;
    startDate?: string;
    venueName?: string;
    coverImage?: string;
  };
  items?: OrderItem[];
}

function statusLabel(status: string): { label: string; color: string } {
  switch (status?.toUpperCase()) {
    case 'PAID':
    case 'CONFIRMED':
      return { label: 'Validée', color: 'text-green-600' };
    case 'PENDING':
      return { label: 'En attente', color: 'text-yellow-600' };
    case 'CANCELLED':
      return { label: 'Annulée', color: 'text-red-500' };
    case 'REFUNDED':
      return { label: 'Remboursée', color: 'text-gray-500' };
    default:
      return { label: status || 'Inconnu', color: 'text-gray-500' };
  }
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${API_URL}/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Impossible de charger les commandes');
      }

      const data = await res.json();
      // Handle both array and paginated response
      const orderList = Array.isArray(data) ? data : (data.orders || data.data || []);
      setOrders(orderList);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Mes commandes</h1>
              <p className="text-sm text-gray-600">Historique de vos achats et billets.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 border rounded-2xl bg-gray-50 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mes commandes</h1>
            <p className="text-sm text-gray-600">Historique de vos achats et billets.</p>
          </div>
          <Link
            href="/tickets"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B7CFF] text-white rounded-lg hover:bg-[#4B6CFF] transition-colors"
          >
            <TicketIcon size={18} /> Mes billets
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
            <button onClick={fetchOrders} className="ml-4 underline text-sm">Réessayer</button>
          </div>
        )}

        {!error && orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TicketIcon size={36} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucune commande</h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore effectué d'achat. Découvrez nos événements !
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#7B61FF] text-white rounded-xl font-semibold hover:bg-[#6B51EF] transition-colors"
            >
              Découvrir des événements
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => {
              const { label, color } = statusLabel(order.status);
              const eventTitle = order.event?.title || 'Événement';
              const eventDate = order.event?.startDate
                ? new Date(order.event.startDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });
              const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });
              const ticketName = order.items?.[0]?.ticketType?.name || '';
              const quantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 1;

              return (
                <article key={order.id} className="p-6 border rounded-2xl bg-gray-50 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{eventTitle}</h3>
                      {ticketName && (
                        <p className="text-sm text-gray-500 mt-0.5">{ticketName} × {quantity}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        Commande <span className="font-medium font-mono text-xs">{order.id.slice(0, 16)}...</span>
                      </p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="text-lg font-bold text-gray-900">{order.total.toFixed(2)} €</div>
                      <div className="text-sm text-gray-500">{orderDate}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon size={16} />
                      <span>{eventDate}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 font-semibold text-sm ${color}`}>
                      {(order.status?.toUpperCase() === 'PAID' || order.status?.toUpperCase() === 'CONFIRMED') && (
                        <CheckCircleIcon size={16} />
                      )}
                      {label}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <Link
                      href={`/tickets?orderId=${order.id}`}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 transition-colors"
                    >
                      <TicketIcon size={16} /> Voir le billet
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50 transition-colors"
                    >
                      <MoneyIcon size={16} /> Reçu
                    </button>
                  </div>
                </article>
              );
            })}

            {/* CTA card */}
            <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-white text-center">
              <div className="text-xl font-bold mb-2 text-gray-700">Acheter plus de billets ?</div>
              <p className="text-sm text-gray-500 mb-4">
                Découvrez tous les événements disponibles près de chez vous.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#7B61FF] text-white rounded-lg hover:bg-[#6B51EF] transition-colors font-semibold"
              >
                Découvrir des événements
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
