type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatDate(date: Date): string {
    return date.toISOString();
  }

  private addLog(level: LogLevel, message: string, details?: any) {
    const log: LogEntry = {
      timestamp: this.formatDate(new Date()),
      level,
      message,
      details
    };

    this.logs.push(log);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console[level](log.timestamp, log.message, log.details || '');
    }

    // In production, you might want to send logs to a service like Sentry
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement production logging service integration
      // Example: Sentry.captureException(details);
    }
  }

  info(message: string, details?: any) {
    this.addLog('info', message, details);
  }

  warn(message: string, details?: any) {
    this.addLog('warn', message, details);
  }

  error(message: string, details?: any) {
    this.addLog('error', message, details);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance(); 