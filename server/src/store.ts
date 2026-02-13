import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { DataNutritionLabel } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data', 'labels.json');

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function readLabels(): DataNutritionLabel[] {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function writeLabels(labels: DataNutritionLabel[]): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(labels, null, 2));
}
