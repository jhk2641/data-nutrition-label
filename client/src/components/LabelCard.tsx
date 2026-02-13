import { Link } from 'react-router-dom';
import type { DataNutritionLabel } from '../types';
import QualityMeter from './QualityMeter';

interface LabelCardProps {
  label: DataNutritionLabel;
  onDelete: (id: string) => void;
}

export default function LabelCard({ label, onDelete }: LabelCardProps) {
  const avgQuality = Math.round(
    (label.quality.completeness +
      label.quality.accuracy +
      label.quality.consistency +
      label.quality.timeliness) /
      4,
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <Link
              to={`/labels/${label.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-label-600 transition-colors truncate block"
            >
              {label.metadata.name || 'Untitled Label'}
            </Link>
            <p className="text-sm text-gray-500 mt-0.5">
              v{label.metadata.version} &middot; {label.metadata.creator || 'Unknown creator'}
            </p>
          </div>
          <div className="flex items-center gap-1 ml-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                avgQuality >= 70
                  ? 'bg-green-100 text-green-800'
                  : avgQuality >= 40
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {avgQuality}% quality
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {label.metadata.description || 'No description provided.'}
        </p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-xs text-gray-500">
          <div>
            <span className="font-medium text-gray-700">Records:</span>{' '}
            {label.composition.numRecords.toLocaleString()}
          </div>
          <div>
            <span className="font-medium text-gray-700">Fields:</span>{' '}
            {label.composition.numFields}
          </div>
          <div>
            <span className="font-medium text-gray-700">Format:</span>{' '}
            {label.composition.fileFormat || 'N/A'}
          </div>
          <div>
            <span className="font-medium text-gray-700">PII:</span>{' '}
            {label.privacy.containsPII ? 'Yes' : 'No'}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <QualityMeter label="Completeness" value={label.quality.completeness} />
          <QualityMeter label="Accuracy" value={label.quality.accuracy} />
        </div>

        {label.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {label.metadata.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {label.metadata.tags.length > 4 && (
              <span className="text-xs text-gray-400">
                +{label.metadata.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Updated {new Date(label.updatedAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <Link
            to={`/labels/${label.id}`}
            className="text-sm text-label-600 hover:text-label-700 font-medium"
          >
            View
          </Link>
          <Link
            to={`/labels/${label.id}/edit`}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(label.id)}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
