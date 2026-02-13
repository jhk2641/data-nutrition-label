interface QualityMeterProps {
  label: string;
  value: number;
}

export default function QualityMeter({ label, value }: QualityMeterProps) {
  const color =
    value >= 80
      ? 'bg-green-500'
      : value >= 60
        ? 'bg-yellow-500'
        : value >= 40
          ? 'bg-orange-500'
          : 'bg-red-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
