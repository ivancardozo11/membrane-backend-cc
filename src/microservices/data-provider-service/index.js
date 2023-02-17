import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import winston from 'winston';
import dataProviderRouter from '../data-provider-service/api/data-provider-routes/dataProviderRoutes.js';

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
  defaultMeta: { service: 'data-provider-service' },
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

// Configuring middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Setting up routes
app.use('/data-provider', dataProviderRouter);


// Setting up error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} 🚀`);
});
