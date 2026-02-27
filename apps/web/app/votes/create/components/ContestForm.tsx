'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CalendarIcon, TrophyIcon, UsersIcon, SettingsIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@tikeo/ui';
import { Input, ImageUpload, Button, LoadingSpinner, ErrorAlert } from '@tikeo/ui';

// Local category type
type ContestCategory = 'MUSIC' | 'DANCE' | 'PHOTOGRAPHY' | 'ART' | 'COOKING' | 'SPORTS' | 'TECHNOLOGY' | 'BUSINESS' | 'FASHION' | 'TALENT' | 'BEAUTY' | 'OTHER';

interface ContestFormProps {
  initialData?: Partial<CreateContestData>;
  onSubmit?: (data: CreateContestData) => Promise<void>;
  isEditing?: boolean;
}

interface CreateContestData {
  title: string;
  description: string;
  shortDescription?: string;
  coverImage: string;
  category: ContestCategory;
  startDate: string;
  endDate: string;
  prize?: string;
  rules?: string;
  maxContestants: number;
  votesPerUser: number;
  isPublicResults: boolean;
}

const CATEGORIES: { value: ContestCategory; label: string; imageSeed: string }[] = [
  { value: 'MUSIC', label: 'Musique', imageSeed: 'music-concert' },
  { value: 'DANCE', label: 'Danse', imageSeed: 'dance-performance' },
  { value: 'PHOTOGRAPHY', label: 'Photographie', imageSeed: 'photography-camera' },
  { value: 'ART', label: 'Art', imageSeed: 'art-painting' },
  { value: 'COOKING', label: 'Cuisine', imageSeed: 'cooking-food' },
  { value: 'SPORTS', label: 'Sports', imageSeed: 'sports-football' },
  { value: 'TECHNOLOGY', label: 'Technologie', imageSeed: 'technology-tech' },
  { value: 'BUSINESS', label: 'Business', imageSeed: 'business-meeting' },
  { value: 'FASHION', label: 'Mode', imageSeed: 'fashion-model' },
  { value: 'TALENT', label: 'Talents', imageSeed: 'talent-show' },
  { value: 'BEAUTY', label: 'Beauté', imageSeed: 'beauty-makeup' },
  { value: 'OTHER', label: 'Autre', imageSeed: 'other-general' },
];

const STEPS = [
  { id: 'basics', title: 'Informations de base', icon: TrophyIcon },
  { id: 'dates', title: 'Dates', icon: CalendarIcon },
  { id: 'details', title: 'Détails', icon: SettingsIcon },
  { id: 'settings', title: 'Paramètres', icon: UsersIcon },
];

export function ContestForm({ initialData, onSubmit, isEditing = false }: ContestFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateContestData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    shortDescription: initialData?.shortDescription || '',
    coverImage: initialData?.coverImage || '',
    category: initialData?.category || 'OTHER',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    prize: initialData?.prize || '',
    rules: initialData?.rules || '',
    maxContestants: initialData?.maxContestants || 100,
    votesPerUser: initialData?.votesPerUser || 1,
    isPublicResults: initialData?.isPublicResults ?? true,
  });

  const updateFormData = (field: keyof CreateContestData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Basics
        if (!formData.title.trim()) {
          setError('Le titre est requis');
          return false;
        }
        if (!formData.description.trim()) {
          setError('La description est requise');
          return false;
        }
        if (!formData.coverImage) {
          setError("L'image de couverture est requise");
          return false;
        }
        if (!formData.category) {
          setError('La catégorie est requise');
          return false;
        }
        break;
      case 1: // Dates
        if (!formData.startDate) {
          setError('La date de début est requise');
          return false;
        }
        if (!formData.endDate) {
          setError('La date de fin est requise');
          return false;
        }
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
          setError('La date de fin doit être après la date de début');
          return false;
        }
        break;
      case 2: // Details
        // Optional fields, no validation needed
        break;
      case 3: // Settings
        if (formData.maxContestants < 1) {
          setError('Le nombre max de participants doit être au moins 1');
          return false;
        }
        if (formData.votesPerUser < 1) {
          setError('Le nombre de votes par utilisateur doit être au moins 1');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);
    setError(null);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default API call
        const response = await fetch('/api/contests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la création du concours');
        }

        router.push('/votes');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Image de couverture *
              </label>
              <ImageUpload
                value={formData.coverImage}
                onChange={(value: string) => updateFormData('coverImage', value)}
                onRemove={() => updateFormData('coverImage', '')}
                label="Cover image"
                className="w-full max-w-md"
              />
            </div>

            <Input
              label="Titre du concours *"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('title', e.target.value)}
              placeholder="Ex: Meilleur Talent Musical 2024"
              required
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('description', e.target.value)}
                placeholder="Décrivez votre concours en détail..."
                className="min-h-[120px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description courte
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('shortDescription', e.target.value)}
                placeholder="Un résumé court pour l'aperçu..."
                className="h-20 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Catégorie *
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateFormData('category', cat.value)}
                    className={`group relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      formData.category === cat.value
                        ? 'border-purple-500 ring-2 ring-purple-500 ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={`https://picsum.photos/seed/${cat.imageSeed}/400/300`}
                        alt={cat.label}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    {/* Category Name */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-sm font-semibold ${
                        formData.category === cat.value ? 'text-white' : 'text-white'
                      } drop-shadow-lg`}>
                        {cat.label}
                      </span>
                    </div>
                    {/* Selected Checkmark */}
                    {formData.category === cat.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Date et heure de début *"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('startDate', e.target.value)}
                required
              />

              <Input
                label="Date et heure de fin *"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('endDate', e.target.value)}
                min={formData.startDate}
                required
              />
            </div>

            {formData.startDate && formData.endDate && (
              <div className="rounded-lg bg-purple-50 p-4">
                <h4 className="mb-2 font-medium text-purple-900">Durée du concours</h4>
                <p className="text-sm text-purple-700">
                  {Math.ceil(
                    (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  jours
                </p>
              </div>
            )}

            <Input
              label="Récompense (optionnel)"
              value={formData.prize}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('prize', e.target.value)}
              placeholder="Ex: 1000€ + Interview exclusive"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Règles du concours
              </label>
              <textarea
                value={formData.rules}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('rules', e.target.value)}
                placeholder="Détaillez les règles de participation..."
                className="min-h-[150px] w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 font-medium text-blue-900">Conseils pour les règles</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-blue-700">
                <li>Critères d&apos;éligibilité</li>
                <li>Processus de vote</li>
                <li>Critères de sélection des gagnants</li>
                <li>Dates importantes</li>
                <li>Contact pour questions</li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Participants maximum"
                type="number"
                value={formData.maxContestants}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('maxContestants', parseInt(e.target.value) || 0)}
                min={1}
                max={10000}
              />

              <Input
                label="Votes par utilisateur"
                type="number"
                value={formData.votesPerUser}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('votesPerUser', parseInt(e.target.value) || 1)}
                min={1}
                max={100}
              />
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
              <input
                type="checkbox"
                id="isPublicResults"
                checked={formData.isPublicResults}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('isPublicResults', e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="isPublicResults" className="flex-1 cursor-pointer">
                <span className="font-medium text-gray-900">Résultats publics</span>
                <p className="text-sm text-gray-500">
                  Les résultats et classements seront visibles par tous
                </p>
              </label>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-3 font-medium text-gray-900">Récapitulatif</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Participants max:</dt>
                  <dd className="font-medium">{formData.maxContestants}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Votes/user:</dt>
                  <dd className="font-medium">{formData.votesPerUser}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Résultats:</dt>
                  <dd className="font-medium">{formData.isPublicResults ? 'Publics' : 'Privés'}</dd>
                </div>
              </dl>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs ${
                    isActive ? 'font-medium text-purple-600' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="relative mt-2">
          <div className="h-1 rounded-full bg-gray-200" />
          <div
            className="absolute left-0 top-0 h-1 rounded-full bg-purple-600 transition-all"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      {/* Form Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          {STEPS[currentStep].title}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          renderStepContent()
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Précédent
        </Button>

        {currentStep < STEPS.length - 1 ? (
          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            Suivant
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            className="flex items-center gap-2"
          >
            <CheckIcon className="h-4 w-4" />
            {isEditing ? 'Mettre à jour' : 'Créer le concours'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ContestForm;

