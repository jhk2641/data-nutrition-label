export interface DataNutritionLabel {
  id: string;
  metadata: DatasetMetadata;
  composition: DatasetComposition;
  provenance: DatasetProvenance;
  quality: DatasetQuality;
  usage: DatasetUsage;
  privacy: DatasetPrivacy;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetMetadata {
  name: string;
  description: string;
  version: string;
  creator: string;
  contactEmail: string;
  tags: string[];
}

export interface DatasetComposition {
  numRecords: number;
  numFields: number;
  fileFormat: string;
  fileSize: string;
  fields: FieldInfo[];
}

export interface FieldInfo {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'categorical' | 'other';
  description: string;
  completeness: number; // 0–100
}

export interface DatasetProvenance {
  source: string;
  collectionMethod: string;
  collectionDate: string;
  updateFrequency: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'irregular';
  geographicCoverage: string;
  timePeriod: string;
}

export interface DatasetQuality {
  completeness: number; // 0–100
  accuracy: number; // 0–100
  consistency: number; // 0–100
  timeliness: number; // 0–100
  knownIssues: string;
}

export interface DatasetUsage {
  intendedUse: string;
  restrictions: string;
  license: string;
  citation: string;
}

export interface DatasetPrivacy {
  containsPII: boolean;
  piiTypes: string[];
  anonymizationMethod: string;
  consentObtained: boolean;
  dataRetentionPolicy: string;
}

export function createEmptyLabel(): Omit<DataNutritionLabel, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    metadata: {
      name: '',
      description: '',
      version: '1.0.0',
      creator: '',
      contactEmail: '',
      tags: [],
    },
    composition: {
      numRecords: 0,
      numFields: 0,
      fileFormat: '',
      fileSize: '',
      fields: [],
    },
    provenance: {
      source: '',
      collectionMethod: '',
      collectionDate: '',
      updateFrequency: 'one-time',
      geographicCoverage: '',
      timePeriod: '',
    },
    quality: {
      completeness: 0,
      accuracy: 0,
      consistency: 0,
      timeliness: 0,
      knownIssues: '',
    },
    usage: {
      intendedUse: '',
      restrictions: '',
      license: '',
      citation: '',
    },
    privacy: {
      containsPII: false,
      piiTypes: [],
      anonymizationMethod: '',
      consentObtained: false,
      dataRetentionPolicy: '',
    },
  };
}
