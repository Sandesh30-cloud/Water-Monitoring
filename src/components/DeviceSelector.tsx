import React from 'react';
import { Monitor, Wifi, WifiOff, MapPin } from 'lucide-react';

export interface Device {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: Date;
}

interface DeviceSelectorProps {
  devices: Device[];
  selectedDevice: string;
  onDeviceSelect: (deviceId: string) => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  selectedDevice,
  onDeviceSelect
}) => {
  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50 border-green-200';
      case 'offline': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusIcon = (status: Device['status']) => {
    switch (status) {
      case 'online': return <Wifi className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      case 'warning': return <Wifi className="w-4 h-4" />;
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Monitoring Device</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => onDeviceSelect(device.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 text-left ${
              selectedDevice === device.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">{device.name}</h3>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(device.status)}`}>
                {getStatusIcon(device.status)}
                <span className="capitalize">{device.status}</span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {device.location}
            </div>
            
            <div className="text-xs text-gray-500">
              Last seen: {device.lastSeen.toLocaleString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};