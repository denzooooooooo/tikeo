'use client';

import React, { useState } from 'react';
import { Filter } from 'lucide-react';

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  defaultMin?: number;
  defaultMax?: number;
  step?: number;
  currency?: string;
  onChange?: (range: [number, number]) => void;
  className?: string;
}

export function PriceRangeSlider({
  min = 0,
  max = 500,
  defaultMin = 0,
  defaultMax = 500,
  step = 10,
  currency = 'EUR',
  onChange,
  className = '',
}: PriceRangeSliderProps) {
  const [value, setValue] = useState<[number, number]>([defaultMin, defaultMax]);

  const handleChange = (newValue: number[]) => {
    const range = newValue as [number, number];
    setValue(range);
    onChange?.(range);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-900">Prix</span>
        </div>
        <button
          onClick={() => {
            setValue([min, max]);
            onChange?.([min, max]);
          }}
          className="text-xs text-purple-600 hover:text-purple-700 font-medium"
        >
          Reinitialiser
        </button>
      </div>

      {/* Range Display */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Min</label>
          <input
            type="number"
            value={value[0]}
            onChange={(e) => {
              const newMin = Math.min(Number(e.target.value), value[1] - step);
              const newValue: [number, number] = [Math.max(newMin, min), value[1]];
              setValue(newValue);
              onChange?.(newValue);
            }}
            min={min}
            max={value[1] - step}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center pt-5">
          <span className="text-gray-400">-</span>
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Max</label>
          <input
            type="number"
            value={value[1]}
            onChange={(e) => {
              const newMax = Math.max(Number(e.target.value), value[0] + step);
              const newValue: [number, number] = [value[0], Math.min(newMax, max)];
              setValue(newValue);
              onChange?.(newValue);
            }}
            min={value[0] + step}
            max={max}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Dual Range Slider */}
      <div className="relative h-2 bg-gray-200 rounded-lg mx-2">
        <div
          className="absolute h-full bg-purple-500 rounded-lg"
          style={{
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((value[1] - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => {
            const newMin = Math.min(Number(e.target.value), value[1] - step);
            const newValue: [number, number] = [Math.max(newMin, min), value[1]];
            setValue(newValue);
            onChange?.(newValue);
          }}
          className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
          style={{}}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => {
            const newMax = Math.max(Number(e.target.value), value[0] + step);
            const newValue: [number, number] = [value[0], Math.min(newMax, max)];
            setValue(newValue);
            onChange?.(newValue);
          }}
          className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute w-5 h-5 bg-white border-2 border-purple-500 rounded-full shadow top-1/2 transform -translate-y-1/2 cursor-pointer z-20"
          style={{ left: `calc(${((value[0] - min) / (max - min)) * 100}% - 10px)` }}
        />
        <div
          className="absolute w-5 h-5 bg-white border-2 border-purple-500 rounded-full shadow top-1/2 transform -translate-y-1/2 cursor-pointer z-20"
          style={{ left: `calc(${((value[1] - min) / (max - min)) * 100}% - 10px)` }}
        />
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Gratuit', range: [0, 0] as [number, number] },
          { label: 'Moins de 50', range: [0, 50] as [number, number] },
          { label: '50 - 100', range: [50, 100] as [number, number] },
          { label: '100 - 200', range: [100, 200] as [number, number] },
          { label: '200+', range: [200, max] as [number, number] },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setValue(preset.range);
              onChange?.(preset.range);
            }}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
              value[0] === preset.range[0] && value[1] === preset.range[1]
                ? 'bg-purple-100 text-purple-700 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Selected Range Display */}
      <div className="bg-purple-50 rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-600">Fourchette selectionnee:</span>
          <span className="font-semibold text-purple-900">
            {value[0] === value[1] 
              ? formatPrice(value[0])
              : `${formatPrice(value[0])} - ${formatPrice(value[1])}`
            }
          </span>
        </div>
      </div>
    </div>
  );
}

// Compact version for filters sidebar
interface PriceRangeCompactProps {
  min?: number;
  max?: number;
  onChange?: (range: [number, number]) => void;
}

export function PriceRangeCompact({
  min = 0,
  max = 500,
  onChange,
}: PriceRangeCompactProps) {
  const [value, setValue] = useState<[number, number]>([min, max]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900">Prix</span>
        <span className="text-gray-500">
          {value[0]} - {value[1]}
        </span>
      </div>
      <div className="relative h-1 bg-gray-200 rounded-full mx-1">
        <div
          className="absolute h-full bg-purple-500 rounded-full"
          style={{
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((value[1] - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => {
            const newValue: [number, number] = [
              Math.min(Number(e.target.value), value[1] - 10),
              value[1],
            ];
            setValue(newValue);
            onChange?.(newValue);
          }}
          className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => {
            const newValue: [number, number] = [
              value[0],
              Math.max(Number(e.target.value), value[0] + 10),
            ];
            setValue(newValue);
            onChange?.(newValue);
          }}
          className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute w-4 h-4 bg-white border-2 border-purple-500 rounded-full shadow top-1/2 transform -translate-y-1/2 cursor-pointer z-20"
          style={{ left: `calc(${((value[0] - min) / (max - min)) * 100}% - 8px)` }}
        />
        <div
          className="absolute w-4 h-4 bg-white border-2 border-purple-500 rounded-full shadow top-1/2 transform -translate-y-1/2 cursor-pointer z-20"
          style={{ left: `calc(${((value[1] - min) / (max - min)) * 100}% - 8px)` }}
        />
      </div>
    </div>
  );
}

export default PriceRangeSlider;

