import { useState } from 'react';
import type { DataNutritionLabel, FieldInfo } from '../types';
import { createEmptyLabel } from '../types';

type LabelFormData = Omit<DataNutritionLabel, 'id' | 'createdAt' | 'updatedAt'>;

interface LabelFormProps {
  initialData?: LabelFormData;
  onSubmit: (data: LabelFormData) => void;
  submitLabel: string;
}

export default function LabelForm({
  initialData,
  onSubmit,
  submitLabel,
}: LabelFormProps) {
  const [data, setData] = useState<LabelFormData>(
    initialData ?? createEmptyLabel(),
  );
  const [tagsInput, setTagsInput] = useState(data.metadata.tags.join(', '));
  const [piiTypesInput, setPiiTypesInput] = useState(
    data.privacy.piiTypes.join(', '),
  );
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    'Metadata',
    'Composition',
    'Provenance',
    'Quality',
    'Usage',
    'Privacy',
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      ...data,
      metadata: {
        ...data.metadata,
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      },
      privacy: {
        ...data.privacy,
        piiTypes: piiTypesInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      },
    });
  }

  function addField() {
    setData((d) => ({
      ...d,
      composition: {
        ...d.composition,
        fields: [
          ...d.composition.fields,
          { name: '', type: 'string', description: '', completeness: 100 },
        ],
      },
    }));
  }

  function updateField(index: number, updates: Partial<FieldInfo>) {
    setData((d) => ({
      ...d,
      composition: {
        ...d.composition,
        fields: d.composition.fields.map((f, i) =>
          i === index ? { ...f, ...updates } : f,
        ),
      },
    }));
  }

  function removeField(index: number) {
    setData((d) => ({
      ...d,
      composition: {
        ...d.composition,
        fields: d.composition.fields.filter((_, i) => i !== index),
      },
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
        {sections.map((section, i) => (
          <button
            key={section}
            type="button"
            onClick={() => setActiveSection(i)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeSection === i
                ? 'border-label-600 text-label-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Metadata */}
      {activeSection === 0 && (
        <div className="space-y-4">
          <SectionHeading>Dataset Metadata</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Dataset Name *"
              value={data.metadata.name}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  metadata: { ...d.metadata, name: v },
                }))
              }
              required
            />
            <Input
              label="Version"
              value={data.metadata.version}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  metadata: { ...d.metadata, version: v },
                }))
              }
            />
            <Input
              label="Creator"
              value={data.metadata.creator}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  metadata: { ...d.metadata, creator: v },
                }))
              }
            />
            <Input
              label="Contact Email"
              type="email"
              value={data.metadata.contactEmail}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  metadata: { ...d.metadata, contactEmail: v },
                }))
              }
            />
          </div>
          <TextArea
            label="Description"
            value={data.metadata.description}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                metadata: { ...d.metadata, description: v },
              }))
            }
          />
          <Input
            label="Tags (comma-separated)"
            value={tagsInput}
            onChange={setTagsInput}
            placeholder="e.g. healthcare, demographics, public"
          />
        </div>
      )}

      {/* Composition */}
      {activeSection === 1 && (
        <div className="space-y-4">
          <SectionHeading>Dataset Composition</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Number of Records"
              type="number"
              value={String(data.composition.numRecords)}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  composition: {
                    ...d.composition,
                    numRecords: parseInt(v) || 0,
                  },
                }))
              }
            />
            <Input
              label="Number of Fields"
              type="number"
              value={String(data.composition.numFields)}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  composition: {
                    ...d.composition,
                    numFields: parseInt(v) || 0,
                  },
                }))
              }
            />
            <Input
              label="File Format"
              value={data.composition.fileFormat}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  composition: { ...d.composition, fileFormat: v },
                }))
              }
              placeholder="e.g. CSV, JSON, Parquet"
            />
            <Input
              label="File Size"
              value={data.composition.fileSize}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  composition: { ...d.composition, fileSize: v },
                }))
              }
              placeholder="e.g. 1.2 GB"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Field Definitions
              </h3>
              <button
                type="button"
                onClick={addField}
                className="text-sm text-label-600 hover:text-label-700 font-medium"
              >
                + Add Field
              </button>
            </div>
            <div className="space-y-3">
              {data.composition.fields.map((field, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <input
                      className="input-field"
                      placeholder="Field name"
                      value={field.name}
                      onChange={(e) =>
                        updateField(i, { name: e.target.value })
                      }
                    />
                    <select
                      className="input-field"
                      value={field.type}
                      onChange={(e) =>
                        updateField(i, {
                          type: e.target.value as FieldInfo['type'],
                        })
                      }
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                      <option value="date">Date</option>
                      <option value="categorical">Categorical</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      className="input-field"
                      placeholder="Description"
                      value={field.description}
                      onChange={(e) =>
                        updateField(i, { description: e.target.value })
                      }
                    />
                    <input
                      className="input-field"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Completeness %"
                      value={field.completeness}
                      onChange={(e) =>
                        updateField(i, {
                          completeness: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeField(i)}
                    className="mt-1 text-red-400 hover:text-red-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              {data.composition.fields.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No fields defined. Click &quot;+ Add Field&quot; to add one.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Provenance */}
      {activeSection === 2 && (
        <div className="space-y-4">
          <SectionHeading>Data Provenance</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Source"
              value={data.provenance.source}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  provenance: { ...d.provenance, source: v },
                }))
              }
              placeholder="e.g. US Census Bureau"
            />
            <Input
              label="Collection Method"
              value={data.provenance.collectionMethod}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  provenance: { ...d.provenance, collectionMethod: v },
                }))
              }
              placeholder="e.g. Survey, API, Web Scraping"
            />
            <Input
              label="Collection Date"
              type="date"
              value={data.provenance.collectionDate}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  provenance: { ...d.provenance, collectionDate: v },
                }))
              }
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Frequency
              </label>
              <select
                className="input-field w-full"
                value={data.provenance.updateFrequency}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    provenance: {
                      ...d.provenance,
                      updateFrequency: e.target.value as typeof d.provenance.updateFrequency,
                    },
                  }))
                }
              >
                <option value="one-time">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
                <option value="irregular">Irregular</option>
              </select>
            </div>
            <Input
              label="Geographic Coverage"
              value={data.provenance.geographicCoverage}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  provenance: { ...d.provenance, geographicCoverage: v },
                }))
              }
              placeholder="e.g. United States, Global"
            />
            <Input
              label="Time Period"
              value={data.provenance.timePeriod}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  provenance: { ...d.provenance, timePeriod: v },
                }))
              }
              placeholder="e.g. 2020-2024"
            />
          </div>
        </div>
      )}

      {/* Quality */}
      {activeSection === 3 && (
        <div className="space-y-4">
          <SectionHeading>Quality Metrics</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RangeInput
              label="Completeness"
              value={data.quality.completeness}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  quality: { ...d.quality, completeness: v },
                }))
              }
            />
            <RangeInput
              label="Accuracy"
              value={data.quality.accuracy}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  quality: { ...d.quality, accuracy: v },
                }))
              }
            />
            <RangeInput
              label="Consistency"
              value={data.quality.consistency}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  quality: { ...d.quality, consistency: v },
                }))
              }
            />
            <RangeInput
              label="Timeliness"
              value={data.quality.timeliness}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  quality: { ...d.quality, timeliness: v },
                }))
              }
            />
          </div>
          <TextArea
            label="Known Issues"
            value={data.quality.knownIssues}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                quality: { ...d.quality, knownIssues: v },
              }))
            }
            placeholder="Describe any known data quality issues"
          />
        </div>
      )}

      {/* Usage */}
      {activeSection === 4 && (
        <div className="space-y-4">
          <SectionHeading>Usage & Licensing</SectionHeading>
          <TextArea
            label="Intended Use"
            value={data.usage.intendedUse}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                usage: { ...d.usage, intendedUse: v },
              }))
            }
            placeholder="Describe the intended use cases for this dataset"
          />
          <TextArea
            label="Restrictions"
            value={data.usage.restrictions}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                usage: { ...d.usage, restrictions: v },
              }))
            }
            placeholder="Any restrictions on usage"
          />
          <Input
            label="License"
            value={data.usage.license}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                usage: { ...d.usage, license: v },
              }))
            }
            placeholder="e.g. MIT, CC BY 4.0, Proprietary"
          />
          <Input
            label="Citation"
            value={data.usage.citation}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                usage: { ...d.usage, citation: v },
              }))
            }
            placeholder="How to cite this dataset"
          />
        </div>
      )}

      {/* Privacy */}
      {activeSection === 5 && (
        <div className="space-y-4">
          <SectionHeading>Privacy & Consent</SectionHeading>
          <div className="flex items-center gap-6">
            <Checkbox
              label="Contains PII"
              checked={data.privacy.containsPII}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  privacy: { ...d.privacy, containsPII: v },
                }))
              }
            />
            <Checkbox
              label="Consent Obtained"
              checked={data.privacy.consentObtained}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  privacy: { ...d.privacy, consentObtained: v },
                }))
              }
            />
          </div>
          {data.privacy.containsPII && (
            <Input
              label="PII Types (comma-separated)"
              value={piiTypesInput}
              onChange={setPiiTypesInput}
              placeholder="e.g. Name, Email, Phone Number, SSN"
            />
          )}
          <Input
            label="Anonymization Method"
            value={data.privacy.anonymizationMethod}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                privacy: { ...d.privacy, anonymizationMethod: v },
              }))
            }
            placeholder="e.g. k-anonymity, differential privacy, pseudonymization"
          />
          <TextArea
            label="Data Retention Policy"
            value={data.privacy.dataRetentionPolicy}
            onChange={(v) =>
              setData((d) => ({
                ...d,
                privacy: { ...d.privacy, dataRetentionPolicy: v },
              }))
            }
            placeholder="Describe the data retention and deletion policy"
          />
        </div>
      )}

      {/* Navigation and Submit */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          disabled={activeSection === 0}
          onClick={() => setActiveSection((s) => s - 1)}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex gap-3">
          {activeSection < sections.length - 1 && (
            <button
              type="button"
              onClick={() => setActiveSection((s) => s + 1)}
              className="px-4 py-2 text-sm font-medium text-label-600 hover:text-label-700"
            >
              Next
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-label-600 text-white text-sm font-medium rounded-lg hover:bg-label-700 transition-colors"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="input-field w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        className="input-field w-full min-h-[80px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function RangeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const color =
    value >= 80
      ? 'accent-green-500'
      : value >= 60
        ? 'accent-yellow-500'
        : value >= 40
          ? 'accent-orange-500'
          : 'accent-red-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <label className="font-medium text-gray-700">{label}</label>
        <span className="text-gray-500">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full ${color}`}
      />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-label-600 focus:ring-label-500"
      />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}
