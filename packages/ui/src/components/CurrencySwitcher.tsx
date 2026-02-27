'use client';

import React, { useState } from 'react';
import { DollarSign, Check, TrendingUp, TrendingDown } from 'lucide-react';

const CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', locale: 'fr-FR' },
  { code: 'USD', symbol: '$', name: 'Dollar US', flag: '🇺🇸', locale: 'en-US' },
  { code: 'GBP', symbol: '£', name: 'Livre sterling', flag: '🇬🇧', locale: 'en-GB' },
  { code: 'CHF', symbol: 'CHF', name: 'Franc suisse', flag: '🇨🇭', locale: 'de-CH' },
  { code: 'JPY', symbol: '¥', name: 'Yen japonais', flag: '🇯🇵', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'C$', name: 'Dollar canadien', flag: '🇨🇦', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Dollar australien', flag: '🇦🇺', locale: 'en-AU' },
];

interface CurrencySwitcherProps {
  variant?: 'dropdown' | 'buttons';
  showLabel?: boolean;
  className?: string;
  onChange?: (currency: string) => void;
  selectedCurrency?: string;
}

export function CurrencySwitcher({
  variant = 'dropdown',
  showLabel = true,
  className = '',
  onChange,
  selectedCurrency = 'EUR',
}: CurrencySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState(selectedCurrency);

  const currency = CURRENCIES.find(c => c.code === currentCurrency) || CURRENCIES[0];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currentCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSelect = (code: string) => {
    setCurrentCurrency(code);
    setIsOpen(false);
    onChange?.(code);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {CURRENCIES.slice(0, 4).map((curr) => (
          <button
            key={curr.code}
            onClick={() => handleSelect(curr.code)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
              currentCurrency === curr.code
                ? 'bg-green-100 text-green-700 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{curr.symbol}</span>
            <span className="text-xs opacity-75">{curr.code}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
      >
        <DollarSign className="h-4 w-4 text-gray-500" />
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            {currency.symbol} {currency.code}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">
                Choisir la devise
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleSelect(curr.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                    currentCurrency === curr.code ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{curr.flag}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {curr.symbol} {curr.name}
                      </p>
                      <p className="text-xs text-gray-500">{curr.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentCurrency === curr.code && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Les prix seront convertis dans la devise sélectionnée
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Demo component to show currency conversion
interface CurrencyDemoProps {
  basePrice: number;
}

export function CurrencyDemo({ basePrice }: CurrencyDemoProps) {
  const [currency, setCurrency] = useState('EUR');

  const conversionRates: Record<string, number> = {
    EUR: 1,
    USD: 1.08,
    GBP: 0.86,
    CHF: 0.94,
    JPY: 162.5,
    CAD: 1.47,
    AUD: 1.65,
  };

  const formatPrice = (price: number, curr: string) => {
    const currData = CURRENCIES.find(c => c.code === curr);
    return new Intl.NumberFormat(currData?.locale || 'fr-FR', {
      style: 'currency',
      currency: curr,
    }).format(price * conversionRates[curr]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Prix de base:</span>
        <span className="font-medium">{formatPrice(basePrice, 'EUR')}</span>
      </div>
      <CurrencySwitcher
        variant="buttons"
        selectedCurrency={currency}
        onChange={setCurrency}
      />
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Prix converti:</span>
        <span className="font-bold text-green-600">
          {formatPrice(basePrice, currency)}
        </span>
      </div>
    </div>
  );
}

export default CurrencySwitcher;

