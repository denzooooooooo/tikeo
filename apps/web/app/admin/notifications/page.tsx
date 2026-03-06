'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

interface NotificationTemplate {
  id: string;
  type: string;
  emoji: string;
  label: string;
  title: string;
  message: string;
  defaultTitle: string;
  defaultMessage: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface NotificationHistory {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminNotificationsPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');

  // Form state
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sendMode, setSendMode] = useState<'single' | 'broadcast'>('single');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [targetRole, setTargetRole] = useState<string>('all');
  const [sendEmail, setSendEmail] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTemplates();
    fetchUsers();
    fetchHistory();
  }, [page]);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('auth_tokens');
      const parsedToken = token ? JSON.parse(token) : null;
      
      const response = await fetch(`${API_URL}/notifications/admin/templates`, {
        headers: {
          'Authorization': `Bearer ${parsedToken?.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      setTemplates([
        { id: 'TICKET_READY', type: 'TICKET_READY', emoji: '🎫', label: 'Billets prêts', title: '', message: '', defaultTitle: 'Vos billets sont prêts!', defaultMessage: 'Vos billets pour l\'événement sont désormais disponibles.' },
        { id: 'EVENT_REMINDER', type: 'EVENT_REMINDER', emoji: '⏰', label: 'Rappel événement', title: '', message: '', defaultTitle: 'Rappel: événement à venir', defaultMessage: 'N\'oubliez pas votre événement!' },
        { id: 'PAYMENT_RECEIVED', type: 'PAYMENT_RECEIVED', emoji: '💰', label: 'Paiement reçu', title: '', message: '', defaultTitle: 'Paiement reçu!', defaultMessage: 'Un paiement a été effectué sur votre compte.' },
        { id: 'EVENT_CANCELLED', type: 'EVENT_CANCELLED', emoji: '❌', label: 'Événement annulé', title: '', message: '', defaultTitle: 'Événement annulé', defaultMessage: 'Un événement a été annulé.' },
        { id: 'REVIEW_REQUEST', type: 'REVIEW_REQUEST', emoji: '⭐', label: 'Demande d\'avis', title: '', message: '', defaultTitle: 'Partagez votre expérience', defaultMessage: 'Votre avis nous aide!' },
        { id: 'MARKETING', type: 'MARKETING', emoji: '🏷️', label: 'Promotion', title: '', message: '', defaultTitle: 'Offre spéciale', defaultMessage: 'Profitez de notre offre!' },
        { id: 'SYSTEM', type: 'SYSTEM', emoji: '🔔', label: 'Système', title: '', message: '', defaultTitle: 'Information importante', defaultMessage: 'Une information de Tikeo.' },
        { id: 'NEW_FOLLOWER', type: 'NEW_FOLLOWER', emoji: '👤', label: 'Nouvel abonné', title: '', message: '', defaultTitle: 'Nouvel abonné!', defaultMessage: 'Quelqu\'un vous suit.' },
        { id: 'RECOMMENDATION', type: 'RECOMMENDATION', emoji: '✨', label: 'Recommandation', title: '', message: '', defaultTitle: 'Nous vous recommandons', defaultMessage: 'Découvrez cet événement!' },
      ]);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth_tokens');
      const parsedToken = token ? JSON.parse(token) : null;
      
      const response = await fetch(`${API_URL}/users?limit=100`, {
        headers: {
          'Authorization': `Bearer ${parsedToken?.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('auth_tokens');
      const parsedToken = token ? JSON.parse(token) : null;
      
      const response = await fetch(`${API_URL}/notifications/admin/history?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${parsedToken?.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setCustomTitle(template.defaultTitle);
      setCustomMessage(template.defaultMessage);
    }
  };

  const handleSend = async () => {
    if (!customTitle.trim() || !customMessage.trim()) {
      setError('Veuillez entrer un titre et un message');
      return;
    }

    if (sendMode === 'single' && !selectedUserId) {
      setError('Veuillez sélectionner un utilisateur');
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('auth_tokens');
      const parsedToken = token ? JSON.parse(token) : null;
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parsedToken?.accessToken}`,
      };

      let response;

      if (sendMode === 'single' && selectedUserId) {
        const selectedUser = users.find(u => u.id === selectedUserId);
        
        response = await fetch(`${API_URL}/notifications/admin/send`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            userId: selectedUserId,
            email: selectedUser?.email,
            type: selectedTemplate || 'SYSTEM',
            title: customTitle,
            message: customMessage,
            sendEmail,
          }),
        });
      } else {
        response = await fetch(`${API_URL}/notifications/admin/broadcast`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            type: selectedTemplate || 'SYSTEM',
            title: customTitle,
            message: customMessage,
            sendEmail,
            targetRole: targetRole === 'all' ? undefined : targetRole,
          }),
        });
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Notification envoyée avec succès! ${data.sentCount ? `(${data.sentCount} destinataire(s))` : ''}`);
        setCustomTitle('');
        setCustomMessage('');
        setSelectedTemplate('');
        fetchHistory();
      } else {
        setError(data.error || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      console.error('Error sending notification:', err);
      setError('Erreur lors de l\'envoi de la notification');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeEmoji = (type: string) => {
    const template = templates.find(t => t.type === type);
    return template?.emoji || '📧';
  };

  if (loading && templates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B7CFF]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Envoyer des notifications aux utilisateurs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('send')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'send'
              ? 'bg-white text-[#5B7CFF] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📤 Envoyer
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'history'
              ? 'bg-white text-[#5B7CFF] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📋 Historique
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center justify-between">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900">✕</button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <span className="text-red-700 text-sm">❌ {error}</span>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">✕</button>
        </div>
      )}

      {activeTab === 'send' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Template Selection */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Modèles de notification</h2>
            <div className="space-y-2">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    selectedTemplate === template.id
                      ? 'bg-[#5B7CFF] text-white shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{template.emoji}</span>
                  <span className="font-medium text-sm">{template.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Compose & Send */}
          <div className="lg:col-span-2 space-y-6">
            {/* Send Mode */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Mode d'envoi</h2>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setSendMode('single')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    sendMode === 'single'
                      ? 'bg-[#5B7CFF] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  👤 Utilisateur unique
                </button>
                <button
                  onClick={() => setSendMode('broadcast')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                    sendMode === 'broadcast'
                      ? 'bg-[#5B7CFF] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📢 Diffusion massive
                </button>
              </div>

              {sendMode === 'single' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner un utilisateur</label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
                  >
                    <option value="">Sélectionner...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Audience cible</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
                  >
                    <option value="all">Tous les utilisateurs</option>
                    <option value="organizers">Organisateurs uniquement</option>
                    <option value="customers">Clients uniquement</option>
                  </select>
                </div>
              )}
            </div>

            {/* Compose */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contenu de la notification</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Entrez le titre de la notification"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Entrez le message de la notification"
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF] resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="w-4 h-4 text-[#5B7CFF] border-gray-300 rounded focus:ring-[#5B7CFF]"
                  />
                  <label htmlFor="sendEmail" className="text-sm text-gray-700">
                    Envoyer également par email
                  </label>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Aperçu</h2>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] flex items-center justify-center text-white text-lg">
                    {selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.emoji || '📧' : '📧'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{customTitle || 'Titre de la notification'}</p>
                    <p className="text-sm text-gray-600 mt-1">{customMessage || 'Contenu de la notification...'}</p>
                    <p className="text-xs text-gray-400 mt-2">À l'instant</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={sending || !customTitle.trim() || !customMessage.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold rounded-xl shadow-lg shadow-[#5B7CFF]/25 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Envoyer la notification</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Historique des notifications</h2>
            <p className="text-sm text-gray-500 mt-1">Historique de toutes les notifications envoyées</p>
          </div>
          
          {history.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-500">Aucune notification envoyée</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {history.map(notification => (
                <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                      {getTypeEmoji(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-900 truncate">{notification.title}</p>
                        <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(notification.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                      {notification.user && (
                        <p className="text-xs text-gray-400 mt-2">
                          Destinataire: {notification.user.firstName} {notification.user.lastName} ({notification.user.email})
                        </p>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notification.read 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {notification.read ? 'Lu' : 'Non lu'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Précédent
              </button>
              <span className="text-sm text-gray-600">
                Page {page} sur {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

