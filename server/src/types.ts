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
  completeness: number;
}

export interface DatasetProvenance {
  source: string;
  collectionMethod: string;
  collectionDate: string;
  updateFrequency: string;
  geographicCoverage: string;
  timePeriod: string;
}

export interface DatasetQuality {
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
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
