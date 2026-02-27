'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  label?: string;
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const defaultAccept = 'image/jpeg,image/png,image/webp';
const defaultMaxSize = 5; // 5MB

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = 'Image',
  error,
  accept = defaultAccept,
  maxSize = defaultMaxSize,
  className = '',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    if (!accept.split(',').includes(file.type)) {
      return 'Type de fichier non supporté. Utilisez JPEG, PNG ou WebP.';
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `La taille du fichier ne doit pas dépasser ${maxSize}MB.`;
    }
    return null;
  };

  const processFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setLocalError(error);
      return;
    }

    setLocalError(null);
    setIsUploading(true);

    try {
      // Simulate upload - replace with actual upload logic
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setLocalError('Erreur lors du téléchargement.');
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [onChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [onChange]
  );

  if (value) {
    return (
      <div className={`relative ${className}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-gray-200">
          <img
            src={value}
            alt={label}
            className="h-full w-full object-cover"
          />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-80 transition-opacity hover:opacity-100"
            title="Supprimer l'image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">{label}</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            <p className="text-sm text-gray-600">Téléchargement...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <div className={`rounded-full p-3 ${isDragging ? 'bg-purple-100' : 'bg-gray-100'}`}>
              <Upload className={`h-6 w-6 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Glissez-déposez une image ici
              </p>
              <p className="mt-1 text-xs text-gray-500">
                ou cliquez pour sélectionner
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <ImageIcon className="h-3 w-3" />
              <span>JPEG, PNG, WebP • Max {maxSize}MB</span>
            </div>
          </div>
        )}
      </div>

      {(error || localError) && (
        <div className="mt-2 flex items-center gap-1 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error || localError}</span>
        </div>
      )}
    </div>
  );
}

// Multi image upload component
interface MultiImageUploadProps {
  values: string[];
  onChange: (values: string[]) => void;
  onRemove: (index: number) => void;
  label?: string;
  maxCount?: number;
  error?: string;
  className?: string;
}

export function MultiImageUpload({
  values,
  onChange,
  onRemove,
  label = 'Images',
  maxCount = 5,
  error,
  className = '',
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type.startsWith('image/')
      );

      if (values.length + files.length > maxCount) {
        return;
      }

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange([...values, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [values, onChange, maxCount]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((file) =>
        file.type.startsWith('image/')
      );

      if (values.length + files.length > maxCount) {
        return;
      }

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange([...values, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [values, onChange, maxCount]
  );

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label} ({values.length}/{maxCount})
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative mb-4 cursor-pointer rounded-lg border-2 border-dashed p-4 transition-colors ${
          isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } ${values.length >= maxCount ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          disabled={values.length >= maxCount}
        />

        <div className="flex flex-col items-center gap-2 text-center">
          <Upload className={`h-6 w-6 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600">
            Glissez-déposez jusqu&apos;à {maxCount} images
          </p>
          <p className="text-xs text-gray-400">
            ou cliquez pour sélectionner
          </p>
        </div>
      </div>

      {values.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={value}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-1 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;

