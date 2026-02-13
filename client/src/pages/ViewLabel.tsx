import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { DataNutritionLabel } from '../types';
import { fetchLabel, deleteLabel } from '../api';
import NutritionLabelView from '../components/NutritionLabelView';

export default function ViewLabel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [label, setLabel] = useState<DataNutritionLabel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchLabel(id)
      .then(setLabel)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function handleDelete() {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this label?')) return;
    try {
      await deleteLabel(id);
      navigate('/');
    } catch {
      alert('Failed to delete label.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-label-600" />
      </div>
    );
  }

  if (!label) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-gray-700 font-medium"
        >
          &larr; Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to={`/labels/${id}/edit`}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      <NutritionLabelView label={label} />
    </div>
  );
}
