import type { DataNutritionLabel } from './types';

const BASE = '/api/labels';

export async function fetchLabels(): Promise<DataNutritionLabel[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch labels');
  return res.json();
}

export async function fetchLabel(id: string): Promise<DataNutritionLabel> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch label');
  return res.json();
}

export async function createLabel(
  data: Omit<DataNutritionLabel, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<DataNutritionLabel> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create label');
  return res.json();
}

export async function updateLabel(
  id: string,
  data: Omit<DataNutritionLabel, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<DataNutritionLabel> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update label');
  return res.json();
}

export async function deleteLabel(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete label');
}
