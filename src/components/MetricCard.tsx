import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  min: number;
  max: number;
  optimal: { min: number; max: number };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  status,
  trend,
  min,
  max,
  optimal
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      case 'stable': return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    if (status === 'normal') {
      return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-blue-600' : 'text-gray-600';
    }
    return trend === 'up' ? 'text-red-600' : 'text-green-600';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 ${getStatusColor()} p-6 transition-all duration-300 hover:scale-105`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className={`flex items-center ${getTrendColor()}`}>
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {value.toFixed(2)} <span className="text-lg font-normal text-gray-600">{unit}</span>
        </div>
        <div className="text-sm text-gray-500">
          Range: {min} - {max} {unit}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Min</span>
          <span>Optimal</span>
          <span>Max</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-400 h-2 rounded-full relative"
            style={{
              marginLeft: `${(optimal.min - min) / (max - min) * 100}%`,
              width: `${(optimal.max - optimal.min) / (max - min) * 100}%`
            }}
          >
            <div 
              className="absolute w-3 h-3 bg-blue-600 border-2 border-white rounded-full -top-0.5 transform -translate-x-1/2"
              style={{
                left: `${(value - optimal.min) / (optimal.max - optimal.min) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};