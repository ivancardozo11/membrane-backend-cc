import express from 'express';
import morgan from 'morgan';
import winston from 'winston';
import apiRoutes from './src/api/routes/routes.js';
import dataProviderService from './src/microservices/data-provider-service/index.js';

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
  defaultMeta: { service: 'membrane-backend-cc' },
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

// Create an instance of Express
const app = express();

// Use morgan for logging incoming requests
app.use(morgan('dev'));

// Parse request bodies as JSON
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api', apiRoutes);

// Start the data provider service
dataProviderService.start();

// Set the server port
const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  // Use the winston logger to log server startup event
  logger.info(`Server started on port ${port}🚀🚀🚀`);
});

export default appServer;