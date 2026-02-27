'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SettingsIcon, BellIcon, ShieldIcon, GlobeIcon, MoonIcon, LockIcon, TrashIcon } from '@tikeo/ui';

interface UserPreferences {
  language: string;
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
}

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'fr',
    currency: 'EUR',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    darkMode: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/preferences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences({
          language: data.language || 'fr',
          currency: data.currency || 'EUR',
          emailNotifications: data.emailNotifications !== false,
          pushNotifications: data.pushNotifications !== false,
          smsNotifications: data.smsNotifications === true,
          darkMode: data.darkMode === true,
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-2">Gérez vos préférences et votre compte</p>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BellIcon className="text-[#5B7CFF]" size={20} />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">Emails</div>
                <div className="text-sm text-gray-500">Recevoir les mises à jour par email</div>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.emailNotifications ? 'bg-[#5B7CFF]' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <div className="font-medium text-gray-900">Notifications push</div>
                <div className="text-sm text-gray-500">Recevoir les notifications sur mobile</div>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, pushNotifications: !preferences.pushNotifications })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.pushNotifications ? 'bg-[#5B7CFF]' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div>
                <div className="font-medium text-gray-900">SMS</div>
                <div className="text-sm text-gray-500">Recevoir les alertes par SMS</div>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, smsNotifications: !preferences.smsNotifications })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.smsNotifications ? 'bg-[#5B7CFF]' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  preferences.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MoonIcon className="text-[#5B7CFF]" size={20} />
            Apparence
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">Mode sombre</div>
                <div className="text-sm text-gray-500">Activer le thème sombre</div>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, darkMode: !preferences.darkMode })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.darkMode ? 'bg-[#5B7CFF]' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <GlobeIcon className="text-[#5B7CFF]" size={20} />
            Langue et région
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
              <select
                value={preferences.currency}
                onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar ($)</option>
                <option value="GBP">Livre (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldIcon className="text-[#5B7CFF]" size={20} />
            Sécurité
          </h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#5B7CFF]/10 rounded-full flex items-center justify-center">
                  <LockIcon className="text-[#5B7CFF]" size={20} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Mot de passe</div>
                  <div className="text-sm text-gray-500">Dernière modification: jamais</div>
                </div>
              </div>
              <span className="text-[#5B7CFF] font-medium">Modifier</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#5B7CFF]/10 rounded-full flex items-center justify-center">
                  <ShieldIcon className="text-[#5B7CFF]" size={20} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Authentification à deux facteurs</div>
                  <div className="text-sm text-gray-500">Non activé</div>
                </div>
              </div>
              <span className="text-[#5B7CFF] font-medium">Activer</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
            <TrashIcon size={20} />
            Zone dangereuse
          </h2>
          <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrashIcon className="text-red-600" size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-red-600">Supprimer mon compte</div>
                <div className="text-sm text-red-400">Cette action est irréversible</div>
              </div>
            </div>
          </button>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#7B61FF] transition-colors"
          >
            {saved ? '✓ Enregistré!' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
