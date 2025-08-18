export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private static instance: Logger;
  private isProduction = import.meta.env.PROD;
  private sessionId = this.generateSessionId();

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId,
    };
  }

  private sendToExternalService(logEntry: LogEntry) {
    if (!this.isProduction) return;

    // Example: Send to external logging service
    // fetch('/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(logEntry),
    // }).catch(console.error);

    // For now, just log to console in production
    console.log('Production Log:', logEntry);
  }

  debug(message: string, data?: any) {
    const logEntry = this.createLogEntry(LogLevel.DEBUG, message, data);
    
    if (!this.isProduction) {
      console.debug(`[DEBUG] ${message}`, data);
    }
    
    this.sendToExternalService(logEntry);
  }

  info(message: string, data?: any) {
    const logEntry = this.createLogEntry(LogLevel.INFO, message, data);
    
    if (!this.isProduction) {
      console.info(`[INFO] ${message}`, data);
    }
    
    this.sendToExternalService(logEntry);
  }

  warn(message: string, data?: any) {
    const logEntry = this.createLogEntry(LogLevel.WARN, message, data);
    
    if (!this.isProduction) {
      console.warn(`[WARN] ${message}`, data);
    }
    
    this.sendToExternalService(logEntry);
  }

  error(message: string, error?: Error | any) {
    const logEntry = this.createLogEntry(LogLevel.ERROR, message, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    });
    
    if (!this.isProduction) {
      console.error(`[ERROR] ${message}`, error);
    }
    
    this.sendToExternalService(logEntry);
  }

  // Specialized logging methods
  logUserAction(action: string, details?: any) {
    this.info(`User Action: ${action}`, details);
  }

  logApiCall(endpoint: string, method: string, status: number, duration?: number) {
    this.info(`API Call: ${method} ${endpoint}`, {
      status,
      duration,
      timestamp: new Date().toISOString(),
    });
  }

  logError(error: Error, context?: string) {
    this.error(`Application Error${context ? ` in ${context}` : ''}`, error);
  }

  logPerformance(operation: string, duration: number) {
    this.info(`Performance: ${operation}`, { duration, unit: 'ms' });
  }
}

export const logger = Logger.getInstance();
