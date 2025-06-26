interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
  tti: number; // Time to Interactive
}

interface PerformanceObserver {
  observe: (options: any) => void;
  disconnect: () => void;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    this.observeFCP();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeTTFB();
    
    this.isInitialized = true;
  }

  private observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime;
          this.logMetric('FCP', this.metrics.fcp);
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    }
  }

  private observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1] as any;
        if (lcpEntry) {
          this.metrics.lcp = lcpEntry.startTime;
          this.logMetric('LCP', this.metrics.lcp);
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    }
  }

  private observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.logMetric('FID', this.metrics.fid);
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    }
  }

  private observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
            this.logMetric('CLS', this.metrics.cls);
          }
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    }
  }

  private observeTTFB() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            this.metrics.ttfb = entry.responseStart - entry.requestStart;
            this.logMetric('TTFB', this.metrics.ttfb);
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    }
  }

  private logMetric(name: string, value: number) {
    console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
    
    // Send to analytics
    this.sendToAnalytics(name, value);
    
    // Check if metric meets thresholds
    this.checkThresholds(name, value);
  }

  private sendToAnalytics(name: string, value: number) {
    // Send to your analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        page_location: window.location.href,
      });
    }
  }

  private checkThresholds(name: string, value: number) {
    const thresholds = {
      FCP: 1800,
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      TTFB: 600,
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (threshold && value > threshold) {
      console.warn(`Performance warning: ${name} (${value}ms) exceeds threshold (${threshold}ms)`);
      
      // Send warning to monitoring service
      this.sendWarning(name, value, threshold);
    }
  }

  private sendWarning(metric: string, value: number, threshold: number) {
    // Send to your monitoring service
    console.warn(`Performance warning sent for ${metric}`);
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  getScore(): number {
    const scores = {
      fcp: this.getScoreForMetric(this.metrics.fcp, 1800, 900),
      lcp: this.getScoreForMetric(this.metrics.lcp, 2500, 1200),
      fid: this.getScoreForMetric(this.metrics.fid, 100, 50),
      cls: this.getScoreForMetric(this.metrics.cls, 0.1, 0.05),
      ttfb: this.getScoreForMetric(this.metrics.ttfb, 600, 300),
    };

    const validScores = Object.values(scores).filter(score => score !== null);
    return validScores.length > 0 
      ? validScores.reduce((sum, score) => sum + score!, 0) / validScores.length 
      : 0;
  }

  private getScoreForMetric(value: number | undefined, poor: number, good: number): number | null {
    if (value === undefined) return null;
    
    if (value <= good) return 100;
    if (value >= poor) return 0;
    
    return Math.round(((poor - value) / (poor - good)) * 100);
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }
}

// Bundle size monitoring
export function getBundleSize() {
  if (typeof window === 'undefined') return null;

  const scripts = Array.from(document.scripts);
  const totalSize = scripts.reduce((size, script) => {
    if (script.src) {
      // This is a simplified calculation
      return size + (script.src.length * 2); // Rough estimate
    }
    return size;
  }, 0);

  return {
    totalSize,
    scriptCount: scripts.length,
    averageSize: totalSize / scripts.length,
  };
}

// Memory usage monitoring
export function getMemoryUsage() {
  if (typeof performance === 'undefined' || !performance.memory) {
    return null;
  }

  const memory = performance.memory;
  return {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit,
    percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };
}

// Network monitoring
export function getNetworkInfo() {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return null;
  }

  const connection = navigator.connection;
  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  };
}

export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<Partial<PerformanceMetrics>>({});
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    performanceMonitor.init();

    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
      setScore(performanceMonitor.getScore());
    }, 1000);

    return () => {
      clearInterval(interval);
      performanceMonitor.destroy();
    };
  }, []);

  return { metrics, score };
}

export default performanceMonitor; 