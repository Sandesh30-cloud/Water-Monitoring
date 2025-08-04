import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';

interface StatusIndicatorProps {
  overallStatus: 'excellent' | 'good' | 'warning' | 'critical';
  lastUpdate: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ overallStatus, lastUpdate }) => {
  const getStatusConfig = () => {
    switch (overallStatus) {
      case 'excellent':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'Excellent',
          description: 'All parameters within optimal range'
        };
      case 'good':
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          text: 'Good',
          description: 'Parameters within acceptable range'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: 'Warning',
          description: 'Some parameters need attention'
        };
      case 'critical':
        return {
          icon: <XCircle className="w-6 h-6" />,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'Critical',
          description: 'Immediate action required'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">System Status</h2>
        <Activity className="w-5 h-5 text-gray-600 animate-pulse" />
      </div>
      
      <div className="flex items-center space-x-3 mb-3">
        <div className={config.color}>
          {config.icon}
        </div>
        <div>
          <div className={`text-xl font-bold ${config.color}`}>
            {config.text}
          </div>
          <div className="text-sm text-gray-600">
            {config.description}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        Last updated: {lastUpdate}
      </div>
    </div>
  );
};