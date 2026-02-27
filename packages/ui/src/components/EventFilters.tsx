'use client';

import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Calendar, MapPin, DollarSign } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';
import { PriceRangeSlider } from './PriceRangeSlider';

interface EventFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  categories?: string[];
  className?: string;
}

export interface FilterState {
  category?: string;
  dateRange?: { start: Date | null; end: Date | null };
  priceRange?: [number, number];
  city?: string;
  isFree?: boolean;
  isOnline?: boolean;
}

const DEFAULT_CATEGORIES = [
  'Musique', 'Sports', 'Arts', 'Technologie', 'Business',
  'Gastronomie', 'Santé', 'Éducation', 'Divertissement', 'Autre'
];

export function EventFilters({
  onFilterChange,
  categories = DEFAULT_CATEGORIES,
  className = '',
}: EventFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const hasActiveFilters = Object.values(filters).some(v => 
    v !== undefined && v !== null && 
    (Array.isArray(v) ? v.some(val => val !== 0) : true)
  );

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Filtres</h2>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                Actif
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Effacer tout
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('isFree', !filters.isFree)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filters.isFree
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Gratuit
          </button>
          <button
            onClick={() => handleFilterChange('isOnline', !filters.isOnline)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filters.isOnline
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En ligne
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Categories */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900">Catégories</span>
              {activeSection === 'category' ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {activeSection === 'category' && (
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange(
                      'category',
                      filters.category === cat ? undefined : cat
                    )}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.category === cat
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('date')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Dates
              </span>
              {activeSection === 'date' ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {activeSection === 'date' && (
              <DateRangePicker
                value={
                  filters.dateRange 
                    ? { start: filters.dateRange.start, end: filters.dateRange.end }
                    : { start: null, end: null }
                }
                onChange={(range) => handleFilterChange('dateRange', range)}
                placeholder="Sélectionner une période"
              />
            )}
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                Prix
              </span>
              {activeSection === 'price' ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {activeSection === 'price' && (
              <PriceRangeSlider
                min={0}
                max={500}
                defaultMin={0}
                defaultMax={500}
                onChange={(range) => handleFilterChange('priceRange', range)}
              />
            )}
          </div>

          {/* City */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('city')}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Ville
              </span>
              {activeSection === 'city' ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {activeSection === 'city' && (
              <input
                type="text"
                placeholder="Ville..."
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            )}
          </div>
        </div>
      )}

      {/* Footer with Active Filters */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {filters.category}
                <button
                  onClick={() => handleFilterChange('category', undefined)}
                  className="hover:text-purple-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {filters.city}
                <button
                  onClick={() => handleFilterChange('city', undefined)}
                  className="hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.dateRange?.start && filters.dateRange?.end && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Du {filters.dateRange.start.toLocaleDateString('fr-FR')}
                <button
                  onClick={() => handleFilterChange('dateRange', undefined)}
                  className="hover:text-green-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventFilters;

