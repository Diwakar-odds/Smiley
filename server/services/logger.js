// Server-side logging service
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ServerLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatLogEntry(level, message, context = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      ...context,
    }) + '\n';
  }

  writeToFile(filename, content) {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, content);
  }

  debug(message, context = {}) {
    const logEntry = this.formatLogEntry('debug', message, context);
    console.debug(logEntry.trim());
    
    if (process.env.NODE_ENV === 'development') {
      this.writeToFile('debug.log', logEntry);
    }
  }

  info(message, context = {}) {
    const logEntry = this.formatLogEntry('info', message, context);
    console.info(logEntry.trim());
    this.writeToFile('app.log', logEntry);
  }

  warn(message, context = {}) {
    const logEntry = this.formatLogEntry('warn', message, context);
    console.warn(logEntry.trim());
    this.writeToFile('app.log', logEntry);
    this.writeToFile('warnings.log', logEntry);
  }

  error(message, context = {}) {
    const logEntry = this.formatLogEntry('error', message, context);
    console.error(logEntry.trim());
    this.writeToFile('app.log', logEntry);
    this.writeToFile('errors.log', logEntry);
  }

  // Log API requests
  logRequest(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userId: req.user?.id,
    };

    if (res.statusCode >= 400) {
      this.warn(`HTTP ${res.statusCode}: ${req.method} ${req.originalUrl}`, logData);
    } else {
      this.info(`HTTP ${res.statusCode}: ${req.method} ${req.originalUrl}`, logData);
    }
  }

  // Log database operations
  logDatabase(operation, table, context = {}) {
    this.debug(`Database ${operation} on ${table}`, context);
  }

  // Log authentication events
  logAuth(event, userId, context = {}) {
    this.info(`Auth ${event} for user ${userId}`, context);
  }
}

export const logger = new ServerLogger();
export default logger;