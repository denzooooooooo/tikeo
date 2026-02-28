'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  TicketIcon,
  PercentIcon,
  CalendarIcon,
  UsersIcon,
  SearchIcon,
  CopyIcon,
  CheckCircleIcon,
  XCircleIcon,
  LoadingSpinner,
  EmptyState,
} from '@tikeo/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableEvents?: string[];
}

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: 0,
    minPurchase: 0,
    maxUses: 1,
    validFrom: '',
    validUntil: '',
    isActive: true,
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/promo-codes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data.promoCodes || []);
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingCode ? 'PUT' : 'POST';
      const url = editingCode 
        ? `${API_URL}/promo-codes/${editingCode.id}`
        : `${API_URL}/promo-codes`;
        
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchPromoCodes();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving promo code:', error);
      // Demo: add locally
      const newCode: PromoCode = {
        ...formData,
        id: Date.now().toString(),
        usedCount: 0,
      };
      setPromoCodes([...promoCodes, newCode]);
      setShowModal(false);
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce code promo?')) return;
    
    try {
      await fetch(`${API_URL}/promo-codes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchPromoCodes();
    } catch (error) {
      console.error('Error deleting promo code:', error);
      setPromoCodes(promoCodes.filter(pc => pc.id !== id));
    }
  };

  const handleToggleActive = async (code: PromoCode) => {
    const updatedCode = { ...code, isActive: !code.isActive };
    
    try {
      await fetch(`${API_URL}/promo-codes/${code.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCode),
      });
      fetchPromoCodes();
    } catch (error) {
      console.error('Error toggling promo code:', error);
      setPromoCodes(promoCodes.map(pc => 
        pc.id === code.id ? updatedCode : pc
      ));
    }
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 0,
      minPurchase: 0,
      maxUses: 1,
      validFrom: '',
      validUntil: '',
      isActive: true,
    });
    setEditingCode(null);
  };

  const openEditModal = (code: PromoCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      description: code.description || '',
      discountType: code.discountType,
      discountValue: code.discountValue,
      minPurchase: code.minPurchase || 0,
      maxUses: code.maxUses || 1,
      validFrom: code.validFrom.split('T')[0],
      validUntil: code.validUntil.split('T')[0],
      isActive: code.isActive,
    });
    setShowModal(true);
  };

  const filteredCodes = promoCodes.filter(pc => 
    pc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Codes Promo
            </h1>
            <p className="text-gray-600">
              Gérez vos codes de réduction et promotions
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <PlusIcon size={20} />
            Nouveau code
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <TicketIcon className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{promoCodes.length}</p>
                <p className="text-sm text-gray-600">Total codes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircleIcon className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {promoCodes.filter(pc => pc.isActive && !isExpired(pc.validUntil)).length}
                </p>
                <p className="text-sm text-gray-600">Actifs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <PercentIcon className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {promoCodes.reduce((sum, pc) => sum + pc.usedCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Utilisations</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <UsersIcon className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {promoCodes.filter(pc => pc.isActive).reduce((sum, pc) => sum + (pc.maxUses || 0) - pc.usedCount, 0)}
                </p>
                <p className="text-sm text-gray-600">Restants</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
            />
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredCodes.length === 0 ? (
          <EmptyState
            title="Aucun code promo"
            description="Créez votre premier code promo pour attirer plus de clients"
            icon={TicketIcon}
            actionLabel="Créer un code"
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Code</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Réduction</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Utilisation</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Validité</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.map((code) => (
                  <tr key={code.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-lg text-gray-900">{code.code}</span>
                        <button
                          onClick={() => copyToClipboard(code.code, code.id)}
                          className="p-1.5 text-gray-400 hover:text-[#5B7CFF] transition-colors"
                          title="Copier"
                        >
                          {copiedId === code.id ? (
                            <CheckCircleIcon className="text-green-500" size={16} />
                          ) : (
                            <CopyIcon size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{code.description || '-'}</td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#5B7CFF]">
                        {code.discountType === 'PERCENTAGE' 
                          ? `${code.discountValue}%` 
                          : `${code.discountValue}€`}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#5B7CFF] rounded-full"
                            style={{ 
                              width: `${Math.min(100, (code.usedCount / (code.maxUses || 1)) * 100)}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {code.usedCount}/{code.maxUses || '∞'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon size={16} />
                        <span>
                          {new Date(code.validFrom).toLocaleDateString('fr-FR')} - {new Date(code.validUntil).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {isExpired(code.validUntil) ? (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          Expiré
                        </span>
                      ) : code.isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Actif
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(code)}
                          className={`p-2 rounded-lg transition-colors ${
                            code.isActive 
                              ? 'text-gray-400 hover:text-orange-500 hover:bg-orange-50' 
                              : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                          }`}
                          title={code.isActive ? 'Désactiver' : 'Activer'}
                        >
                          {code.isActive ? (
                            <XCircleIcon size={20} />
                          ) : (
                            <CheckCircleIcon size={20} />
                          )}
                        </button>
                        <button
                          onClick={() => openEditModal(code)}
                          className="p-2 text-gray-400 hover:text-[#5B7CFF] hover:bg-[#5B7CFF]/5 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <EditIcon size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(code.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <TrashIcon size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCode ? 'Modifier le code' : 'Nouveau code promo'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code promo *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF] font-mono"
                    placeholder="EXEMPLE2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
                    placeholder="Description optionnelle"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de réduction
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
                    >
                      <option value="PERCENTAGE">Pourcentage (%)</option>
                      <option value="FIXED">Montant fixe (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valeur *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achat minimum (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Utilisations max
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxUses}
                      onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début *
                    </label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin *
                    </label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-[#5B7CFF] rounded focus:ring-[#5B7CFF]"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Activer immédiatement
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    {editingCode ? 'Enregistrer' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

