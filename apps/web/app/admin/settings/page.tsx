'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      alert('Paramètres enregistrés avec succès !');
    }, 1000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres Admin</h1>
        <p className="text-gray-500 mt-1">Configurer les paramètres globaux de la plateforme</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Commission Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Commission</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taux de commission (%)
              </label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                min={0}
                max={100}
                step={0.1}
                className="w-full max-w-xs px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/20 focus:border-[#5B7CFF]"
              />
              <p className="text-sm text-gray-500 mt-2">
                Commission prélevée sur chaque vente de billet. Actuellement : 1%
              </p>
            </div>
          </div>
        </div>

        {/* Platform Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Informations de la plateforme</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Version</span>
              <span className="font-medium text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Base de données</span>
              <span className="font-medium text-gray-900">Supabase (PostgreSQL)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Environnement</span>
              <span className="font-medium text-green-600">Production</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#5B7CFF] text-white font-bold rounded-xl hover:bg-[#4a6beb] transition-colors disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>
    </div>
  );
}

