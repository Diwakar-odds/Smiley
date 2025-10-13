import express from 'express';
import { logger } from '../services/logger.js';

const router = express.Router();

// Log frontend errors
router.post('/log', async (req, res) => {
  try {
    const { level, message, context, userId, sessionId, timestamp } = req.body;
    
    // Validate required fields
    if (!level || !message) {
      return res.status(400).json({ error: 'Missing required fields: level, message' });
    }

    // Create log entry with server-side context
    const logEntry = {
      level,
      message,
      context: {
        ...context,
        source: 'frontend',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      },
      userId,
      sessionId,
      timestamp: timestamp || new Date().toISOString(),
    };

    // Log based on level
    switch (level) {
      case 'error':
        logger.error(`Frontend Error: ${message}`, logEntry.context);
        break;
      case 'warn':
        logger.warn(`Frontend Warning: ${message}`, logEntry.context);
        break;
      case 'info':
        logger.info(`Frontend Info: ${message}`, logEntry.context);
        break;
      case 'debug':
        logger.debug(`Frontend Debug: ${message}`, logEntry.context);
        break;
      default:
        logger.info(`Frontend Log: ${message}`, logEntry.context);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing log request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get error statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    // This would typically query a database for error statistics
    // For now, return mock data
    const stats = {
      totalErrors: 0,
      recentErrors: [],
      errorsByType: {},
      timestamp: new Date().toISOString(),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting log stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;