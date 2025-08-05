import React, { useState, useEffect } from 'react';
import { Droplets, Thermometer, Beaker, Eye, Waves } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { TrendChart } from './components/TrendChart';
import { StatusIndicator } from './components/StatusIndicator';
import { DeviceSelector, type Device } from './components/DeviceSelector';
import { 
  multiDeviceGenerator,
  metricConfigs, 
  getStatus, 
  getTrend, 
  type WaterQualityData 
} from './utils/dataGenerator';

function App() {
  const [devices, setDevices] = useState<Device[]>(multiDeviceGenerator.getDeviceInfo());
  const [selectedDevice, setSelectedDevice] = useState<string>('device-001');
  const [currentData, setCurrentData] = useState<WaterQualityData>(
    multiDeviceGenerator.generateReading('device-001')
  );
  const [previousData, setPreviousData] = useState<WaterQualityData>(
    multiDeviceGenerator.generateReading('device-001')
  );
  const [historicalData, setHistoricalData] = useState<WaterQualityData[]>(
    multiDeviceGenerator.generateHistoricalData('device-001')
  );
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString());

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    const newReading = multiDeviceGenerator.generateReading(deviceId);
    const newHistorical = multiDeviceGenerator.generateHistoricalData(deviceId);
    
    setPreviousData(currentData);
    setCurrentData(newReading);
    setHistoricalData(newHistorical);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousData(currentData);
      const newReading = multiDeviceGenerator.generateReading(selectedDevice);
      setCurrentData(newReading);
      
      setHistoricalData(prevData => {
        const newData = [...prevData.slice(1), newReading];
        return newData;
      });
      
      // Update device status periodically
      setDevices(multiDeviceGenerator.getDeviceInfo());
      setLastUpdate(new Date().toLocaleTimeString());
    }, 30000);

    return () => clearInterval(interval);
  }, [currentData, selectedDevice]);

  const getOverallStatus = (): 'excellent' | 'good' | 'warning' | 'critical' => {
    const statuses = [
      getStatus(currentData.pH, metricConfigs.pH),
      getStatus(currentData.turbidity, metricConfigs.turbidity),
      getStatus(currentData.salinity, metricConfigs.salinity),
      getStatus(currentData.dissolvedOxygen, metricConfigs.dissolvedOxygen),
      getStatus(currentData.temperature, metricConfigs.temperature)
    ];

    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    if (statuses.every(s => s === 'normal')) return 'excellent';
    return 'good';
  };

  const formatChartData = (key: keyof Omit<WaterQualityData, 'timestamp'>) => {
    return historicalData.map(reading => ({
      time: reading.timestamp.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      value: reading[key] as number
    }));
  };

  const metricIcons = {
    pH: <Beaker className="w-6 h-6" />,
    turbidity: <Eye className="w-6 h-6" />,
    salinity: <Waves className="w-6 h-6" />,
    dissolvedOxygen: <Droplets className="w-6 h-6" />,
    temperature: <Thermometer className="w-6 h-6" />
  };

  const chartColors = {
    pH: '#3B82F6',
    turbidity: '#8B5CF6',
    salinity: '#06B6D4',
    dissolvedOxygen: '#059669',
    temperature: '#DC2626'
  };

  const selectedDeviceInfo = devices.find(d => d.id === selectedDevice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Water Monitoring Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Real-time monitoring and analysis
          </p>
        </div>

        {/* Device Selector */}
        <DeviceSelector
          devices={devices}
          selectedDevice={selectedDevice}
          onDeviceSelect={handleDeviceSelect}
        />

        {/* Status Overview */}
        <div className="mb-8 relative">
          <StatusIndicator 
            overallStatus={getOverallStatus()} 
            lastUpdate={lastUpdate}
          />
          {selectedDeviceInfo && (
            <div className="absolute top-4 right-4 text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              📍 {selectedDeviceInfo.name}
            </div>
          )}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title="pH Level"
            value={currentData.pH}
            unit={metricConfigs.pH.unit}
            status={getStatus(currentData.pH, metricConfigs.pH)}
            trend={getTrend(currentData.pH, previousData.pH)}
            min={metricConfigs.pH.min}
            max={metricConfigs.pH.max}
            optimal={metricConfigs.pH.optimal}
          />
          <MetricCard
            title="Turbidity"
            value={currentData.turbidity}
            unit={metricConfigs.turbidity.unit}
            status={getStatus(currentData.turbidity, metricConfigs.turbidity)}
            trend={getTrend(currentData.turbidity, previousData.turbidity)}
            min={metricConfigs.turbidity.min}
            max={metricConfigs.turbidity.max}
            optimal={metricConfigs.turbidity.optimal}
          />
          <MetricCard
            title="Salinity"
            value={currentData.salinity}
            unit={metricConfigs.salinity.unit}
            status={getStatus(currentData.salinity, metricConfigs.salinity)}
            trend={getTrend(currentData.salinity, previousData.salinity)}
            min={metricConfigs.salinity.min}
            max={metricConfigs.salinity.max}
            optimal={metricConfigs.salinity.optimal}
          />
          <MetricCard
            title="Dissolved Oxygen"
            value={currentData.dissolvedOxygen}
            unit={metricConfigs.dissolvedOxygen.unit}
            status={getStatus(currentData.dissolvedOxygen, metricConfigs.dissolvedOxygen)}
            trend={getTrend(currentData.dissolvedOxygen, previousData.dissolvedOxygen)}
            min={metricConfigs.dissolvedOxygen.min}
            max={metricConfigs.dissolvedOxygen.max}
            optimal={metricConfigs.dissolvedOxygen.optimal}
          />
          <MetricCard
            title="Temperature"
            value={currentData.temperature}
            unit={metricConfigs.temperature.unit}
            status={getStatus(currentData.temperature, metricConfigs.temperature)}
            trend={getTrend(currentData.temperature, previousData.temperature)}
            min={metricConfigs.temperature.min}
            max={metricConfigs.temperature.max}
            optimal={metricConfigs.temperature.optimal}
          />
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <TrendChart
              data={formatChartData('pH')}
              color={chartColors.pH}
              title="pH"
              unit="pH"
            />
          </div>
          <div className="xl:col-span-1">
            <TrendChart
              data={formatChartData('turbidity')}
              color={chartColors.turbidity}
              title="Turbidity"
              unit="NTU"
            />
          </div>
          <div className="xl:col-span-1">
            <TrendChart
              data={formatChartData('salinity')}
              color={chartColors.salinity}
              title="Salinity"
              unit="ppt"
            />
          </div>
          <div className="lg:col-span-1">
            <TrendChart
              data={formatChartData('dissolvedOxygen')}
              color={chartColors.dissolvedOxygen}
              title="Dissolved Oxygen"
              unit="mg/L"
            />
          </div>
          <div className="lg:col-span-1">
            <TrendChart
              data={formatChartData('temperature')}
              color={chartColors.temperature}
              title="Temperature"
              unit="°C"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Environmental Monitoring System • Data updates every 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
