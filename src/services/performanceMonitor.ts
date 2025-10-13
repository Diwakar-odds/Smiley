import React from 'react';
import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: Record<string, string | number>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observer?: PerformanceObserver;

  constructor() {
    this.initializePerformanceObserver();
    this.initializeWebVitals();
  }

  private initializePerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry.duration, {
            entryType: entry.entryType,
          });
        }
      });

      try {
        this.observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
      } catch (error) {
        logger.warn('Performance observer not supported', { error: String(error) });
      }
    }
  }

  private initializeWebVitals(): void {
    // Core Web Vitals monitoring
    this.observeLCP(); // Largest Contentful Paint
    this.observeFID(); // First Input Delay
    this.observeCLS(); // Cumulative Layout Shift
  }

  private observeLCP(): void {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('LCP', lastEntry.startTime, {
        metric: 'largest-contentful-paint',
      });
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  }

  private observeFID(): void {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const fidEntry = entry as PerformanceEventTiming;
        this.recordMetric('FID', fidEntry.processingStart - entry.startTime, {
          metric: 'first-input-delay',
        });
      }
    }).observe({ type: 'first-input', buffered: true });
  }

  private observeCLS(): void {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const layoutEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!layoutEntry.hadRecentInput) {
          clsValue += layoutEntry.value || 0;
        }
      }
      this.recordMetric('CLS', clsValue, {
        metric: 'cumulative-layout-shift',
      });
    }).observe({ type: 'layout-shift', buffered: true });
  }

  recordMetric(name: string, value: number, context?: Record<string, string | number>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      context,
    };

    this.metrics.push(metric);
    
    // Log significant performance issues
    if (this.isPerformanceIssue(name, value)) {
      logger.warn(`Performance Issue: ${name}`, {
        value,
        threshold: this.getThreshold(name),
        ...context,
      });
    } else {
      logger.logPerformance(name, value, context);
    }

    // Keep only last 100 metrics to prevent memory leak
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  private isPerformanceIssue(name: string, value: number): boolean {
    const thresholds = {
      LCP: 2500, // 2.5s
      FID: 100,  // 100ms
      CLS: 0.1,  // 0.1
      'page-load': 3000, // 3s
      'api-response': 1000, // 1s
    };

    return value > (thresholds[name as keyof typeof thresholds] || Infinity);
  }

  private getThreshold(name: string): number {
    const thresholds = {
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      'page-load': 3000,
      'api-response': 1000,
    };

    return thresholds[name as keyof typeof thresholds] || 0;
  }

  // Measure page load time
  measurePageLoad(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      this.recordMetric('page-load', loadTime, {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
      });
    });
  }

  // Measure API response times
  measureApiCall(url: string, startTime: number, endTime: number, status: number): void {
    const duration = endTime - startTime;
    this.recordMetric('api-response', duration, {
      url,
      status,
    });
  }

  // Measure React component render time
  measureRender(componentName: string, renderTime: number): void {
    this.recordMetric('component-render', renderTime, {
      component: componentName,
    });
  }

  // Get performance summary
  getPerformanceSummary(): Record<string, { count: number; avg: number; min: number; max: number; latest: number }> {
    const summary: Record<string, { count: number; avg: number; min: number; max: number; latest: number }> = {};
    
    // Group metrics by name
    const groupedMetrics = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) acc[metric.name] = [];
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    // Calculate statistics for each metric
    Object.entries(groupedMetrics).forEach(([name, values]) => {
      summary[name] = {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        latest: values[values.length - 1],
      };
    });

    return summary;
  }

  // Start monitoring
  start(): void {
    this.measurePageLoad();
    logger.info('Performance monitoring started');
  }

  // Stop monitoring
  stop(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    logger.info('Performance monitoring stopped');
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Helper hook for React components
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = performance.now();
  
  React.useEffect(() => {
    const endTime = performance.now();
    performanceMonitor.measureRender(componentName, endTime - startTime);
  });
  
  return {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    measureApiCall: performanceMonitor.measureApiCall.bind(performanceMonitor),
  };
};

export default performanceMonitor;