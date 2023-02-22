import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import dataConsumer from './data-consumer.js';
import dataProviderRoutes from '../data-provider-service/api/data-provider-routes/dataProviderRoutes.js';
import winston from 'winston';

const app = express();

// Enable CORS
app.use(cors());

/*
Enable Morgan to log HTTP requests, 
using the Combined format for detailed loggingIP address, HTTP method, requested URL, 
response status, and more.
*/
app.use(morgan('combined'));

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'data-provider-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/data-provider-service.log' }),
    new winston.transports.File({
      filename: 'logs/data-provider-service-error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
    }),
  ],
});

// Log a message when the server starts
logger.info('Starting data provider service...');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Connect to the external exchange API through a WebSocket connection
dataConsumer(io);

// Register data provider routes
app.use('/data-provider', dataProviderRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Data provider service running on port ${PORT}`);
});

// Handle WebSocket connection errors
io.on('connect_error', (err) => {
  logger.error(`Socket.io connection error: ${err.message}`);
});

// Handle WebSocket disconnections
io.on('disconnect', (reason) => {
  logger.warn(`Socket.io disconnected: ${reason}`);
  logger.warn(`Trying to reconnect to Socket.io...`);
  dataConsumer(io);
});


export default dataProviderServer;