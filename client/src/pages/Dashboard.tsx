import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { DataNutritionLabel } from '../types';
import { fetchLabels, deleteLabel } from '../api';
import LabelCard from '../components/LabelCard';

export default function Dashboard() {
  const [labels, setLabels] = useState<DataNutritionLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLabels();
  }, []);

  async function loadLabels() {
    try {
      setLoading(true);
      const data = await fetchLabels();
      setLabels(data);
      setError(null);
    } catch {
      setError('Failed to load labels. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this label?')) return;
    try {
      await deleteLabel(id);
      setLabels((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError('Failed to delete label.');
    }
  }

  const filtered = labels.filter(
    (l) =>
      l.metadata.name.toLowerCase().includes(search.toLowerCase()) ||
      l.metadata.description.toLowerCase().includes(search.toLowerCase()) ||
      l.metadata.tags.some((t) =>
        t.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-label-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dataset Labels
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {labels.length} label{labels.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-label-600 text-white text-sm font-medium rounded-lg hover:bg-label-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Label
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
          <button
            onClick={loadLabels}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {labels.length > 0 && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search labels by name, description, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full max-w-md"
          />
        </div>
      )}

      {labels.length === 0 && !error ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            No labels yet
          </h2>
          <p className="text-gray-500 mb-4">
            Create your first data nutrition label to get started.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-label-600 text-white text-sm font-medium rounded-lg hover:bg-label-700 transition-colors"
          >
            Create Label
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((label) => (
            <LabelCard
              key={label.id}
              label={label}
              onDelete={handleDelete}
            />
          ))}
          {filtered.length === 0 && search && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No labels match &quot;{search}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
