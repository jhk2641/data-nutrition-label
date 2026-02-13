import { useNavigate } from 'react-router-dom';
import { createLabel } from '../api';
import LabelForm from '../components/LabelForm';
import type { DataNutritionLabel } from '../types';

export default function CreateLabel() {
  const navigate = useNavigate();

  async function handleSubmit(
    data: Omit<DataNutritionLabel, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    try {
      const label = await createLabel(data);
      navigate(`/labels/${label.id}`);
    } catch {
      alert('Failed to create label. Is the server running?');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Label
      </h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <LabelForm onSubmit={handleSubmit} submitLabel="Create Label" />
      </div>
    </div>
  );
}
