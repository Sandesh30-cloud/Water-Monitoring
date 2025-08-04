import React from 'react';

interface DataPoint {
  time: string;
  value: number;
}

interface TrendChartProps {
  data: DataPoint[];
  color: string;
  title: string;
  unit: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, color, title, unit }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const getY = (value: number) => {
    return 100 - ((value - minValue) / range) * 80 + 10;
  };

  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = getY(point.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title} Trend</h3>
      <div className="relative h-48">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill={`url(#gradient-${title})`}
          />
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            className="drop-shadow-sm"
          />
          {data.map((point, index) => (
            <circle
              key={index}
              cx={(index / (data.length - 1)) * 100}
              cy={getY(point.value)}
              r="0.8"
              fill={color}
              className="opacity-80"
            />
          ))}
        </svg>
        <div className="absolute top-2 right-2 text-sm text-gray-600">
          {data[data.length - 1]?.value.toFixed(2)} {unit}
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{data[0]?.time}</span>
        <span>{data[data.length - 1]?.time}</span>
      </div>
    </div>
  );
};