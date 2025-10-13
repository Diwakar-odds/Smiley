import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { performanceMonitor } from '../services/performanceMonitor';
import { logger } from '../services/logger';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memoryUsage?: number;
  errorRate: number;
  responseTime: number;
}

const SystemMonitoringPage: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<Record<string, any>>({});
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: 0,
    errorRate: 0,
    responseTime: 0,
  });
  const [recentErrors, setRecentErrors] = useState<any[]>([]);

  useEffect(() => {
    // Load performance data
    const loadPerformanceData = () => {
      const data = performanceMonitor.getPerformanceSummary();
      setPerformanceData(data);
    };

    // Load system health
    const loadSystemHealth = () => {
      // Mock system health data - in production, this would come from your backend
      setSystemHealth({
        status: 'healthy',
        uptime: Date.now() - (Date.now() - 3600000), // 1 hour uptime
        errorRate: 0.02, // 2% error rate
        responseTime: 245, // 245ms average response time
      });
    };

    // Initial load
    loadPerformanceData();
    loadSystemHealth();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadPerformanceData();
      loadSystemHealth();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getHealthStatus = (status: string) => {
    switch (status) {
      case 'healthy':
        return { color: 'text-green-600', bg: 'bg-green-100', label: 'Healthy' };
      case 'warning':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Warning' };
      case 'critical':
        return { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Unknown' };
    }
  };

  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const statusConfig = getHealthStatus(systemHealth.status);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">System Monitoring</h1>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
          {statusConfig.label}
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${statusConfig.color}`}>
              {statusConfig.label}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatUptime(systemHealth.uptime)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${systemHealth.errorRate > 0.05 ? 'text-red-600' : 'text-green-600'}`}>
              {(systemHealth.errorRate * 100).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${systemHealth.responseTime > 500 ? 'text-red-600' : 'text-green-600'}`}>
              {systemHealth.responseTime}ms
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Core Web Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['LCP', 'FID', 'CLS'].map((metric) => {
                const data = performanceData[metric];
                if (!data) return null;
                
                return (
                  <div key={metric} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{metric}</div>
                      <div className="text-sm text-gray-600">
                        {metric === 'LCP' && 'Largest Contentful Paint'}
                        {metric === 'FID' && 'First Input Delay'}
                        {metric === 'CLS' && 'Cumulative Layout Shift'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {metric === 'CLS' ? data.latest?.toFixed(3) : `${Math.round(data.latest || 0)}ms`}
                      </div>
                      <div className="text-sm text-gray-600">
                        Avg: {metric === 'CLS' ? data.avg?.toFixed(3) : `${Math.round(data.avg || 0)}ms`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(performanceData).map(([key, data]) => {
                if (['LCP', 'FID', 'CLS'].includes(key)) return null;
                
                return (
                  <div key={key} className="flex justify-between items-center">
                    <div className="font-medium capitalize">
                      {key.replace('-', ' ')}
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{Math.round(data.avg || 0)}ms</div>
                      <div className="text-sm text-gray-600">
                        {data.count} samples
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  logger.info('Manual performance report generated', {
                    timestamp: new Date().toISOString(),
                    performanceData,
                    systemHealth,
                  });
                  alert('Performance report generated and logged');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Generate Report
              </button>
              
              <button
                onClick={() => {
                  const report = performanceMonitor.getPerformanceSummary();
                  console.log('Performance Summary:', report);
                  alert('Check console for detailed performance data');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Console Debug
              </button>
              
              <button
                onClick={() => {
                  // Clear performance data
                  setPerformanceData({});
                  logger.info('Performance data cleared');
                  alert('Performance data cleared');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Clear Data
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoringPage;