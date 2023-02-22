import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import winston from 'winston';
import marketDepthRoutes from '../market-depth-service/api/market-depth-routes/marketDepthRoutes.js';

const app = express();

// Initialize the winston logger for logging server events
const logger = winston.createLogger({
  // Set logging level to info
  level: 'info',
  // Format log messages with timestamp and JSON
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
  ),
  // Set default metadata to identify the service
  defaultMeta: { service: 'market-depth-service' },
  // Define transports to handle logging
  transports: [
    // Log to the console
    new winston.transports.Console(),
    // Log errors to a separate file
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      // Format error messages with timestamp and JSON
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
    }),
    // Log all messages to a combined file
    new winston.transports.File({
      filename: 'combined.log',
      // Format messages with timestamp and JSON
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
    }),
  ],
});
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Add routes
app.use('/market-depth', marketDepthRoutes);

// Create and export server
const server = app.listen(3001, () => {
  logger.info('Market Depth Service is running on port 3001');
});

export default marketDepthServer;
