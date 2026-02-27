'use client';

import React from 'react';
import Link from 'next/link';
import { ContestForm } from './components/ContestForm';
import { ArrowLeftIcon, TrophyIcon } from '@tikeo/ui';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function CreateContestPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/votes"
            className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Retour aux concours
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Créer un Concours</h1>
              <p className="text-purple-100 mt-1">
                Organisez votre propre concours de vote sur Tikeo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ContestForm />
      </div>

      {/* Tips Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="rounded-2xl bg-blue-50 p-8">
          <h3 className="text-xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
            💡 Conseils pour un concours réussi
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h4 className="font-medium text-blue-700 mb-2">Une belle couverture</h4>
              <p className="text-sm text-blue-600">
                Utilisez une image de couverture attrayante pour attirer l&apos;attention
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h4 className="font-medium text-blue-700 mb-2">Des règles claires</h4>
              <p className="text-sm text-blue-600">
                Détaillez les conditions de participation pour éviter les malentendus
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h4 className="font-medium text-blue-700 mb-2">Récompenses attractives</h4>
              <p className="text-sm text-blue-600">
                Proposez des récompenses qui motiveront les participants
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h4 className="font-medium text-blue-700 mb-2">Promotion active</h4>
              <p className="text-sm text-blue-600">
                Partagez votre concours sur les réseaux sociaux
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h4 className="font-medium text-blue-700 mb-2">Dates réalistes</h4>
              <p className="text-sm text-blue-600">
                Choisissez une durée suffisante pour mobiliser les participants
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h4 className="font-medium text-blue-700 mb-2">Engagement</h4>
              <p className="text-sm text-blue-600">
                Restez disponible pour répondre aux questions des participants
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

