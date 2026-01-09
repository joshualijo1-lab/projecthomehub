'use client';

import { useState } from 'react';
import { createQuote } from './actions';
import { Button } from '@/components/Button';
import { Input, Textarea } from '@/components/Input';

type Category = { id: string; name: string };

export function QuoteForm({ categories, providerId }: { categories: Category[]; providerId?: string }) {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage(null);
    try {
      const uploads = Array.from(files).map(async (file) => {
        const body = new FormData();
        body.append('file', file);
        const response = await fetch('/api/upload', { method: 'POST', body });
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        const data = (await response.json()) as { url: string };
        return data.url;
      });
      const urls = await Promise.all(uploads);
      setPhotoUrls((prev) => [...prev, ...urls]);
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    const payload = new FormData();
    for (const [key, value] of formData.entries()) {
      payload.append(key, value);
    }
    payload.set('photoUrls', photoUrls.join(','));
    if (providerId) payload.set('providerId', providerId);
    const result = await createQuote(payload);
    setMessage(`Quote request sent. Reference: ${result.quoteId}`);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-semibold">Service category</label>
        <select name="categoryId" className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" required>
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold">County</label>
        <Input name="locationCounty" required placeholder="e.g. Dublin" />
      </div>
      <div>
        <label className="text-sm font-semibold">Town (optional)</label>
        <Input name="locationTown" placeholder="e.g. Dundrum" />
      </div>
      <div>
        <label className="text-sm font-semibold">Job description</label>
        <Textarea name="description" rows={5} required placeholder="Describe the work you need done." />
      </div>
      <div>
        <label className="text-sm font-semibold">Photos (optional)</label>
        <Input type="file" accept="image/*" multiple onChange={(event) => handleUpload(event.target.files)} />
        {uploading && <p className="text-xs text-slate-500">Uploading...</p>}
        {photoUrls.length > 0 && (
          <ul className="mt-2 text-xs text-slate-500">
            {photoUrls.map((url) => (
              <li key={url}>{url}</li>
            ))}
          </ul>
        )}
      </div>
      <Button type="submit" disabled={uploading}>
        Send request
      </Button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
  );
}
