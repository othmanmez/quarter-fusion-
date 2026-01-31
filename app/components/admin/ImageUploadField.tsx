'use client';

import { useMemo, useState } from 'react';

type Props = {
  label?: string;
  value: string;
  onChange: (nextUrl: string) => void;
  helpText?: string;
};

export function ImageUploadField({
  label = "Image",
  value,
  onChange,
  helpText,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return value || '';
  }, [file, value]);

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'Upload impossible');
      }

      if (!data?.url) {
        throw new Error('Réponse upload invalide (url manquante)');
      }

      onChange(String(data.url));
      setFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload impossible');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="space-y-3">
        <input
          type="text"
          inputMode="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
          placeholder="Collez une URL (https://...) ou uploadez un fichier"
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          <button
            type="button"
            onClick={upload}
            disabled={!file || uploading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Upload...' : 'Uploader'}
          </button>
        </div>

        {(helpText || error) && (
          <div className="text-sm">
            {helpText && <div className="text-gray-500">{helpText}</div>}
            {error && <div className="text-red-700">{error}</div>}
          </div>
        )}

        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Aperçu"
              className="h-32 w-32 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.svg';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

