import type { DataNutritionLabel } from '../types';
import QualityMeter from './QualityMeter';

interface NutritionLabelViewProps {
  label: DataNutritionLabel;
}

export default function NutritionLabelView({ label }: NutritionLabelViewProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Label Header - styled like a nutrition facts panel */}
      <div className="bg-white border-4 border-gray-900 rounded-lg overflow-hidden">
        <div className="bg-gray-900 text-white px-6 py-4">
          <h1 className="text-2xl font-black tracking-tight">
            Data Nutrition Facts
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            {label.metadata.name}
          </p>
        </div>

        <div className="px-6 py-4 border-b-8 border-gray-900">
          <p className="text-sm text-gray-600">{label.metadata.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {label.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Composition Section */}
        <div className="border-b-4 border-gray-900">
          <div className="px-6 py-3 bg-gray-50">
            <h2 className="text-lg font-extrabold">Composition</h2>
          </div>
          <div className="px-6 py-3 space-y-1.5">
            <LabelRow label="Total Records" value={label.composition.numRecords.toLocaleString()} bold />
            <LabelRow label="Number of Fields" value={String(label.composition.numFields)} />
            <LabelRow label="File Format" value={label.composition.fileFormat} />
            <LabelRow label="File Size" value={label.composition.fileSize} />
          </div>
          {label.composition.fields.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200">
              <h3 className="text-sm font-bold mb-2">Fields</h3>
              <div className="space-y-2">
                {label.composition.fields.map((field) => (
                  <div
                    key={field.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <span className="font-medium">{field.name}</span>
                      <span className="text-gray-400 ml-1">({field.type})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-label-500 h-1.5 rounded-full"
                          style={{ width: `${field.completeness}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        {field.completeness}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quality Section */}
        <div className="border-b-4 border-gray-900">
          <div className="px-6 py-3 bg-gray-50">
            <h2 className="text-lg font-extrabold">Quality Metrics</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            <QualityMeter label="Completeness" value={label.quality.completeness} />
            <QualityMeter label="Accuracy" value={label.quality.accuracy} />
            <QualityMeter label="Consistency" value={label.quality.consistency} />
            <QualityMeter label="Timeliness" value={label.quality.timeliness} />
          </div>
          {label.quality.knownIssues && (
            <div className="px-6 pb-3">
              <p className="text-sm">
                <span className="font-semibold">Known Issues: </span>
                <span className="text-gray-600">{label.quality.knownIssues}</span>
              </p>
            </div>
          )}
        </div>

        {/* Provenance Section */}
        <div className="border-b-4 border-gray-900">
          <div className="px-6 py-3 bg-gray-50">
            <h2 className="text-lg font-extrabold">Provenance</h2>
          </div>
          <div className="px-6 py-3 space-y-1.5">
            <LabelRow label="Source" value={label.provenance.source} />
            <LabelRow label="Collection Method" value={label.provenance.collectionMethod} />
            <LabelRow label="Collection Date" value={label.provenance.collectionDate} />
            <LabelRow label="Update Frequency" value={label.provenance.updateFrequency} />
            <LabelRow label="Geographic Coverage" value={label.provenance.geographicCoverage} />
            <LabelRow label="Time Period" value={label.provenance.timePeriod} />
          </div>
        </div>

        {/* Usage Section */}
        <div className="border-b-4 border-gray-900">
          <div className="px-6 py-3 bg-gray-50">
            <h2 className="text-lg font-extrabold">Usage & Licensing</h2>
          </div>
          <div className="px-6 py-3 space-y-1.5">
            <LabelRow label="Intended Use" value={label.usage.intendedUse} />
            <LabelRow label="Restrictions" value={label.usage.restrictions} />
            <LabelRow label="License" value={label.usage.license} />
            <LabelRow label="Citation" value={label.usage.citation} />
          </div>
        </div>

        {/* Privacy Section */}
        <div>
          <div className="px-6 py-3 bg-gray-50">
            <h2 className="text-lg font-extrabold">Privacy & Consent</h2>
          </div>
          <div className="px-6 py-3 space-y-1.5">
            <LabelRow
              label="Contains PII"
              value={label.privacy.containsPII ? 'Yes' : 'No'}
              bold
            />
            {label.privacy.piiTypes.length > 0 && (
              <LabelRow label="PII Types" value={label.privacy.piiTypes.join(', ')} />
            )}
            <LabelRow label="Anonymization" value={label.privacy.anonymizationMethod} />
            <LabelRow
              label="Consent Obtained"
              value={label.privacy.consentObtained ? 'Yes' : 'No'}
            />
            <LabelRow label="Retention Policy" value={label.privacy.dataRetentionPolicy} />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white px-6 py-3 flex justify-between text-xs">
          <span>v{label.metadata.version}</span>
          <span>By {label.metadata.creator || 'Unknown'}</span>
          <span>Updated {new Date(label.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

function LabelRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm py-0.5 border-b border-gray-100 last:border-0">
      <span className={bold ? 'font-bold' : 'text-gray-600'}>{label}</span>
      <span className={`text-right max-w-[60%] ${bold ? 'font-bold' : ''}`}>
        {value || 'N/A'}
      </span>
    </div>
  );
}
