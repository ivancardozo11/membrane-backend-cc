import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import winston from 'winston';
import morgan from 'morgan';
import marketDepthRouter from './api/market-depth-routes/marketDepthRoutes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 4000;

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/market-depth', marketDepthRouter);

server.listen(PORT, () => {
  winston.info(`Market Depth server listening on port ${PORT}`);

  // Connect to Data Provider server and listen to market depth events
  const dataProviderServer = 'http://localhost:3004';
  const dataProviderSocket = new Server(dataProviderServer);
  dataProviderSocket.on('connect', () => {
    winston.info(`Connected to Data Provider server at ${dataProviderServer}`);
  });
  dataProviderSocket.on('market-depth', (data) => {
    io.emit('market-depth', data);
  });
});
