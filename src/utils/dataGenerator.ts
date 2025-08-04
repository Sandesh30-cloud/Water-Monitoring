export interface WaterQualityData {
  pH: number;
  turbidity: number;
  salinity: number;
  dissolvedOxygen: number;
  temperature: number;
  timestamp: Date;
}

export interface MetricConfig {
  min: number;
  max: number;
  optimal: { min: number; max: number };
  unit: string;
}

export const metricConfigs: Record<keyof Omit<WaterQualityData, 'timestamp'>, MetricConfig> = {
  pH: { min: 0, max: 14, optimal: { min: 6.5, max: 8.5 }, unit: 'pH' },
  turbidity: { min: 0, max: 100, optimal: { min: 0, max: 5 }, unit: 'NTU' },
  salinity: { min: 0, max: 50, optimal: { min: 30, max: 35 }, unit: 'ppt' },
  dissolvedOxygen: { min: 0, max: 20, optimal: { min: 6, max: 12 }, unit: 'mg/L' },
  temperature: { min: 0, max: 40, optimal: { min: 20, max: 28 }, unit: '°C' }
};

class DataGenerator {
  private baseValues: WaterQualityData;
  private trends: Record<string, number> = {};

  constructor() {
    this.baseValues = {
      pH: 7.2,
      turbidity: 2.5,
      salinity: 32.8,
      dissolvedOxygen: 8.5,
      temperature: 24.2,
      timestamp: new Date()
    };

    // Initialize trends
    Object.keys(this.baseValues).forEach(key => {
      if (key !== 'timestamp') {
        this.trends[key] = (Math.random() - 0.5) * 0.02;
      }
    });
  }

  generateReading(): WaterQualityData {
    const reading: WaterQualityData = {
      pH: this.updateValue('pH', 0.05),
      turbidity: this.updateValue('turbidity', 0.3),
      salinity: this.updateValue('salinity', 0.2),
      dissolvedOxygen: this.updateValue('dissolvedOxygen', 0.1),
      temperature: this.updateValue('temperature', 0.3),
      timestamp: new Date()
    };

    return reading;
  }

  private updateValue(key: keyof WaterQualityData, maxChange: number): number {
    if (key === 'timestamp') return 0;

    const config = metricConfigs[key];
    let currentValue = this.baseValues[key] as number;
    
    // Add some randomness
    const randomChange = (Math.random() - 0.5) * maxChange;
    
    // Apply trend
    currentValue += this.trends[key] + randomChange;
    
    // Occasionally change trend direction
    if (Math.random() < 0.05) {
      this.trends[key] = (Math.random() - 0.5) * 0.02;
    }
    
    // Keep within reasonable bounds
    currentValue = Math.max(config.min + 1, Math.min(config.max - 1, currentValue));
    
    this.baseValues[key] = currentValue;
    return currentValue;
  }

  generateHistoricalData(points: number = 20): WaterQualityData[] {
    const data: WaterQualityData[] = [];
    const now = new Date();
    
    for (let i = points - 1; i >= 0; i--) {
      const reading = this.generateReading();
      reading.timestamp = new Date(now.getTime() - i * 60000); // 1 minute intervals
      data.push(reading);
    }
    
    return data;
  }
}

export const dataGenerator = new DataGenerator();

export class MultiDeviceDataGenerator {
  private generators: Map<string, DataGenerator> = new Map();
  private deviceConfigs = {
    'device-001': {
      name: 'Sensor Station Alpha',
      location: 'North Monitoring Point',
      baseValues: { pH: 7.1, turbidity: 1.8, salinity: 33.2, dissolvedOxygen: 8.8, temperature: 23.5 }
    },
    'device-002': {
      name: 'Sensor Station Beta',
      location: 'Central Monitoring Point',
      baseValues: { pH: 7.4, turbidity: 3.2, salinity: 32.1, dissolvedOxygen: 7.9, temperature: 25.1 }
    },
    'device-003': {
      name: 'Sensor Station Gamma',
      location: 'South Monitoring Point',
      baseValues: { pH: 6.9, turbidity: 2.1, salinity: 34.0, dissolvedOxygen: 8.2, temperature: 24.8 }
    }
  };

  constructor() {
    Object.entries(this.deviceConfigs).forEach(([deviceId, config]) => {
      const generator = new DataGenerator();
      // Set custom base values for each device
      Object.entries(config.baseValues).forEach(([key, value]) => {
        (generator as any).baseValues[key] = value;
      });
      this.generators.set(deviceId, generator);
    });
  }

  getDeviceInfo() {
    return Object.entries(this.deviceConfigs).map(([id, config]) => ({
      id,
      name: config.name,
      location: config.location,
      status: Math.random() > 0.1 ? 'online' as const : (Math.random() > 0.5 ? 'warning' as const : 'offline' as const),
      lastSeen: new Date(Date.now() - Math.random() * 300000) // Random time within last 5 minutes
    }));
  }

  generateReading(deviceId: string): WaterQualityData {
    const generator = this.generators.get(deviceId);
    if (!generator) {
      throw new Error(`Device ${deviceId} not found`);
    }
    return generator.generateReading();
  }

  generateHistoricalData(deviceId: string, points: number = 20): WaterQualityData[] {
    const generator = this.generators.get(deviceId);
    if (!generator) {
      throw new Error(`Device ${deviceId} not found`);
    }
    return generator.generateHistoricalData(points);
  }
}

export const multiDeviceGenerator = new MultiDeviceDataGenerator();

export const getStatus = (value: number, config: MetricConfig): 'normal' | 'warning' | 'critical' => {
  if (value >= config.optimal.min && value <= config.optimal.max) {
    return 'normal';
  }
  
  const warningThreshold = 0.2;
  const optimalRange = config.optimal.max - config.optimal.min;
  const lowerWarning = config.optimal.min - optimalRange * warningThreshold;
  const upperWarning = config.optimal.max + optimalRange * warningThreshold;
  
  if (value >= lowerWarning && value <= upperWarning) {
    return 'warning';
  }
  
  return 'critical';
};

export const getTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
  const diff = Math.abs(current - previous);
  const threshold = 0.01;
  
  if (diff < threshold) return 'stable';
  return current > previous ? 'up' : 'down';
};