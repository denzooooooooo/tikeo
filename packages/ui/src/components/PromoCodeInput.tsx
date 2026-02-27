'use client';

import { useState } from 'react';
import { GiftIcon, CheckCircleIcon } from './Icons';

interface PromoCodeInputProps {
  onApply?: (discount: number) => void;
  onError?: (error: string) => void;
}

interface PromoCodeResult {
  valid: boolean;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  message: string;
}

export function PromoCodeInput({ onApply, onError }: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PromoCodeResult | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/promo-codes/validate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: code.trim().toUpperCase() }),
        }
      );

      const data = await response.json();

      if (response.ok && data.valid) {
        setResult({
          valid: true,
          code: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          message: data.message || 'Code promo appliqué avec succès !',
        });
        onApply?.(data.discountType === 'percentage' 
          ? data.discountValue 
          : data.discountValue);
      } else {
        setResult({
          valid: false,
          code: code,
          discountType: 'percentage',
          discountValue: 0,
          message: data.message || 'Code promo invalide ou expiré',
        });
        onError?.(data.message);
      }
    } catch (error) {
      setResult({
        valid: false,
        code: code,
        discountType: 'percentage',
        discountValue: 0,
        message: 'Erreur de connexion',
      });
      onError?.('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setResult(null);
    onApply?.(0);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Code promo
      </label>
      
      {result?.valid ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="text-green-500" size={20} />
            <div>
              <p className="font-semibold text-green-700">{result.code}</p>
              <p className="text-sm text-green-600">{result.message}</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-700 hover:text-green-900 text-sm font-medium"
          >
            Supprimer
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <GiftIcon 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              size={18} 
            />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Entrez votre code promo"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
            />
          </div>
          <button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="px-4 py-2.5 bg-[#5B7CFF] text-white font-semibold rounded-lg hover:bg-[#4B6CFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : 'Appliquer'}
          </button>
        </div>
      )}
      
      {result && !result.valid && (
        <div className="flex items-center gap-2 mt-2 text-red-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">{result.message}</p>
        </div>
      )}
    </div>
  );
}

