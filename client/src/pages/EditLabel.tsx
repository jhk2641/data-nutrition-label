import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { DataNutritionLabel } from '../types';
import { fetchLabel, updateLabel } from '../api';
import LabelForm from '../components/LabelForm';

export default function EditLabel() {
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

  async function handleSubmit(
    data: Omit<DataNutritionLabel, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    if (!id) return;
    try {
      await updateLabel(id, data);
      navigate(`/labels/${id}`);
    } catch {
      alert('Failed to update label.');
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Label</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <LabelForm
          initialData={{
            metadata: label.metadata,
            composition: label.composition,
            provenance: label.provenance,
            quality: label.quality,
            usage: label.usage,
            privacy: label.privacy,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
