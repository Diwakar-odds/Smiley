// Centralized logging service for the application
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogContext = Record<string, string | number | boolean | null | undefined>;

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  userId?: string;
  sessionId?: string;
  url?: string;
}

class Logger {
  private sessionId: string;
  private isDevelopment: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId: this.getUserId(),
      sessionId: this.sessionId,
      url: window.location.href,
    };
  }

  private getUserId(): string | undefined {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).id : undefined;
    } catch {
      return undefined;
    }
  }

  private async sendToServer(logEntry: LogEntry): Promise<void> {
    if (!this.isDevelopment) {
      try {
        await fetch('/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEntry),
        });
      } catch (error) {
        console.error('Failed to send log to server:', error);
      }
    }
  }

  private formatConsoleMessage(logEntry: LogEntry): string {
    const { timestamp, level, message, context, userId } = logEntry;
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    const userStr = userId ? ` | User: ${userId}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${userStr}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    const logEntry = this.createLogEntry('debug', message, context);
    
    if (this.isDevelopment) {
      console.debug(this.formatConsoleMessage(logEntry));
    }
  }

  info(message: string, context?: LogContext): void {
    const logEntry = this.createLogEntry('info', message, context);
    
    console.info(this.formatConsoleMessage(logEntry));
    this.sendToServer(logEntry);
  }

  warn(message: string, context?: LogContext): void {
    const logEntry = this.createLogEntry('warn', message, context);
    
    console.warn(this.formatConsoleMessage(logEntry));
    this.sendToServer(logEntry);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = {
      ...context,
      ...(error && {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
      }),
    };

    const logEntry = this.createLogEntry('error', message, errorContext);
    
    console.error(this.formatConsoleMessage(logEntry));
    this.sendToServer(logEntry);
  }

  // Log API requests and responses
  logApiRequest(method: string, url: string, data?: unknown): void {
    this.debug(`API Request: ${method} ${url}`, { requestData: String(data) });
  }

  logApiResponse(method: string, url: string, status: number, responseTime?: number): void {
    const context: LogContext = { status };
    if (responseTime) context.responseTime = responseTime;

    if (status >= 200 && status < 300) {
      this.info(`API Success: ${method} ${url}`, context);
    } else if (status >= 400) {
      this.warn(`API Error: ${method} ${url}`, context);
    }
  }

  // Log user actions for analytics
  logUserAction(action: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, { ...context, category: 'user_action' });
  }

  // Log performance metrics
  logPerformance(metric: string, value: number, context?: LogContext): void {
    this.info(`Performance: ${metric}`, { ...context, value, category: 'performance' });
  }
}

// Create singleton instance
export const logger = new Logger();

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
  logger.error('Unhandled JavaScript Error', event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', undefined, {
    reason: event.reason,
  });
});

export default logger;