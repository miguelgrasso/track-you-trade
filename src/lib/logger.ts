// Logger seguro que se desactiva en producción
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;

  private createLogEntry(level: LogLevel, message: string, context?: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data
    };
  }

  private addToBuffer(entry: LogEntry) {
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift(); // Remover el más antiguo
    }
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) {
      return true; // Log todo en desarrollo
    }
    
    // En producción, solo log errores y warnings críticos
    return level === 'error' || level === 'warn';
  }

  debug(message: string, context?: string, data?: any) {
    const entry = this.createLogEntry('debug', message, context, data);
    this.addToBuffer(entry);
    
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${context ? `[${context}]` : ''} ${message}`, data || '');
    }
  }

  info(message: string, context?: string, data?: any) {
    const entry = this.createLogEntry('info', message, context, data);
    this.addToBuffer(entry);
    
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${context ? `[${context}]` : ''} ${message}`, data || '');
    }
  }

  warn(message: string, context?: string, data?: any) {
    const entry = this.createLogEntry('warn', message, context, data);
    this.addToBuffer(entry);
    
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${context ? `[${context}]` : ''} ${message}`, data || '');
    }
  }

  error(message: string, context?: string, error?: Error | any) {
    const entry = this.createLogEntry('error', message, context, {
      error: error?.message || error,
      stack: error?.stack
    });
    this.addToBuffer(entry);
    
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${context ? `[${context}]` : ''} ${message}`, error || '');
    }
    
    // En producción, enviar errores a servicio de monitoreo
    if (!this.isDevelopment) {
      this.sendToMonitoringService(entry);
    }
  }

  private sendToMonitoringService(entry: LogEntry) {
    // Implementar envío a servicio de monitoreo como Sentry, LogRocket, etc.
    try {
      // Ejemplo: Sentry.captureException(entry);
      // Por ahora, solo almacenar en buffer
    } catch (error) {
      // Fallo silencioso para evitar loops de error
    }
  }

  // Obtener logs para debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (!this.isDevelopment) {
      return []; // No exponer logs en producción
    }
    
    if (level) {
      return this.logBuffer.filter(entry => entry.level === level);
    }
    
    return [...this.logBuffer];
  }

  // Limpiar buffer de logs
  clearLogs() {
    if (this.isDevelopment) {
      this.logBuffer = [];
    }
  }
}

// Instancia singleton del logger
export const logger = new Logger();

// Funciones de conveniencia
export const log = {
  debug: (message: string, context?: string, data?: any) => logger.debug(message, context, data),
  info: (message: string, context?: string, data?: any) => logger.info(message, context, data),
  warn: (message: string, context?: string, data?: any) => logger.warn(message, context, data),
  error: (message: string, context?: string, error?: Error | any) => logger.error(message, context, error),
};

// Hook para desarrollo que permite ver logs en componentes
export function useDevelopmentLogs() {
  if (process.env.NODE_ENV !== 'development') {
    return { logs: [], clearLogs: () => {} };
  }
  
  return {
    logs: logger.getLogs(),
    clearLogs: () => logger.clearLogs(),
  };
}