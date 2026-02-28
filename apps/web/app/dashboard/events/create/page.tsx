'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ImageIcon,
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  TicketIcon,
  PlusIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  MusicIcon,
  SportsIcon,
  ConferenceIcon,
  FestivalIcon,
  TheaterIcon,
  ArtIcon,
} from '@tikeo/ui';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    category: '',
    coverImage: '',
    
    // Date & Time
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    
    // Location
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueCountry: 'France',
    
    // Tickets
    ticketTypes: [
      {
        name: 'Standard',
        description: '',
        price: '',
        quantity: '',
      },
    ],
  });

  const categories = [
    { name: 'Musique', icon: MusicIcon },
    { name: 'Sport', icon: SportsIcon },
    { name: 'Conférence', icon: ConferenceIcon },
    { name: 'Festival', icon: FestivalIcon },
    { name: 'Théâtre', icon: TheaterIcon },
    { name: 'Exposition', icon: ArtIcon },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const storedTokens = localStorage.getItem('auth_tokens');
      const accessToken = storedTokens ? JSON.parse(storedTokens).accessToken : null;
      if (!accessToken) {
        setError('Vous devez être connecté pour créer un événement.');
        setIsLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(`${formData.startDate}T${formData.startTime}`).toISOString(),
          endDate: new Date(`${formData.endDate}T${formData.endTime}`).toISOString(),
          ticketTypes: formData.ticketTypes.map(ticket => ({
            ...ticket,
            price: parseFloat(ticket.price) || 0,
            quantity: parseInt(ticket.quantity) || 0,
          })),
        }),
      });

      if (res.ok) {
        const event = await res.json();
        router.push(`/dashboard/events/${event.id}`);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.message || `Erreur ${res.status} — veuillez réessayer.`);
      }
    } catch (err) {
      console.error('Create event error:', err);
      setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [
        ...formData.ticketTypes,
        { name: '', description: '', price: '', quantity: '' },
      ],
    });
  };

  const removeTicketType = (index: number) => {
    setFormData({
      ...formData,
      ticketTypes: formData.ticketTypes.filter((_, i) => i !== index),
    });
  };

  const updateTicketType = (index: number, field: string, value: string) => {
    const newTicketTypes = [...formData.ticketTypes];
    newTicketTypes[index] = { ...newTicketTypes[index], [field]: value };
    setFormData({ ...formData, ticketTypes: newTicketTypes });
  };

  const steps = [
    { number: 1, title: 'Informations de base', icon: ImageIcon },
    { number: 2, title: 'Date et lieu', icon: CalendarIcon },
    { number: 3, title: 'Billetterie', icon: TicketIcon },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="text-gray-600" size={24} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Créer un événement</h1>
                <p className="text-gray-600 mt-1">Remplissez les informations de votre événement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isCompleted
                          ? 'bg-green-500'
                          : isActive
                          ? 'bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF]'
                          : 'bg-gray-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon className="text-white" size={24} />
                      ) : (
                        <IconComponent
                          className={isActive ? 'text-white' : 'text-gray-500'}
                          size={24}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          isActive ? 'text-[#5B7CFF]' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        Étape {step.number}
                      </p>
                      <p className="text-sm text-gray-600">{step.title}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCompleted ? 'bg-green-500 w-full' : 'w-0'
                        }`}
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de base</h2>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre de l&apos;événement *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                  placeholder="Ex: Concert de Jazz au Parc"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900 resize-none"
                  placeholder="Décrivez votre événement en détail..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Catégorie *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    const isSelected = formData.category === category.name;

                    return (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: category.name })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                          isSelected
                            ? 'border-[#5B7CFF] bg-[#5B7CFF]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent
                          className={isSelected ? 'text-[#5B7CFF]' : 'text-gray-600'}
                          size={24}
                        />
                        <span
                          className={`font-semibold ${
                            isSelected ? 'text-[#5B7CFF]' : 'text-gray-700'
                          }`}
                        >
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image de couverture (URL)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ImageIcon className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Location */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Date et lieu</h2>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de début *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CalendarIcon className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Heure de début *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <ClockIcon className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de fin *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CalendarIcon className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Heure de fin *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <ClockIcon className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Lieu de l&apos;événement</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom du lieu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                    placeholder="Ex: Salle Pleyel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LocationIcon className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.venueAddress}
                      onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                      placeholder="252 Rue du Faubourg Saint-Honoré"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.venueCity}
                      onChange={(e) => setFormData({ ...formData, venueCity: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                      placeholder="Paris"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pays *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.venueCountry}
                      onChange={(e) => setFormData({ ...formData, venueCountry: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                      placeholder="France"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tickets */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Types de billets</h2>
                <button
                  type="button"
                  onClick={addTicketType}
                  className="flex items-center gap-2 px-4 py-2 bg-[#5B7CFF] text-white rounded-lg hover:bg-[#7B61FF] transition-colors"
                >
                  <PlusIcon size={20} />
                  Ajouter un type
                </button>
              </div>

              <div className="space-y-4">
                {formData.ticketTypes.map((ticket, index) => (
                  <div
                    key={index}
                    className="p-6 border-2 border-gray-200 rounded-xl space-y-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-gray-900">
                        Billet #{index + 1}
                      </h3>
                      {formData.ticketTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTicketType(index)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nom du billet *
                        </label>
                        <input
                          type="text"
                          required
                          value={ticket.name}
                          onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                          placeholder="Ex: Standard, VIP, Early Bird"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Prix (€) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={ticket.price}
                          onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                          placeholder="50.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Quantité disponible *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={ticket.quantity}
                          onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                          placeholder="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={ticket.description}
                          onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900"
                          placeholder="Accès standard à l'événement"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-colors"
              >
                Précédent
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon size={20} />
                    Créer l&apos;événement
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
    </ProtectedRoute>
  );
}
