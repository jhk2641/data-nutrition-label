import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readLabels, writeLabels } from '../store.js';
import type { DataNutritionLabel } from '../types.js';

export const labelsRouter = Router();

// GET all labels
labelsRouter.get('/', (_req, res) => {
  const labels = readLabels();
  res.json(labels);
});

// GET single label
labelsRouter.get('/:id', (req, res) => {
  const labels = readLabels();
  const label = labels.find((l) => l.id === req.params.id);
  if (!label) {
    res.status(404).json({ error: 'Label not found' });
    return;
  }
  res.json(label);
});

// POST create label
labelsRouter.post('/', (req, res) => {
  const labels = readLabels();
  const now = new Date().toISOString();
  const newLabel: DataNutritionLabel = {
    id: uuidv4(),
    ...req.body,
    createdAt: now,
    updatedAt: now,
  };
  labels.push(newLabel);
  writeLabels(labels);
  res.status(201).json(newLabel);
});

// PUT update label
labelsRouter.put('/:id', (req, res) => {
  const labels = readLabels();
  const index = labels.findIndex((l) => l.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Label not found' });
    return;
  }
  const updated: DataNutritionLabel = {
    ...labels[index],
    ...req.body,
    id: labels[index].id,
    createdAt: labels[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  labels[index] = updated;
  writeLabels(labels);
  res.json(updated);
});

// DELETE label
labelsRouter.delete('/:id', (req, res) => {
  const labels = readLabels();
  const index = labels.findIndex((l) => l.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Label not found' });
    return;
  }
  labels.splice(index, 1);
  writeLabels(labels);
  res.status(204).end();
});
