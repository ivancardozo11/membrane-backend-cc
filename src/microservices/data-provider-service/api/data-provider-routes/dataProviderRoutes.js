import express from 'express';
import { Server } from 'socket.io';
import axios from 'axios';

const dataProviderRoutes = express.Router();

// Retrieve the latest market data for the requested pair from the market-depth-service
const getLatestMarketData = async (pair) => {
  // URL for the market depth service
  const marketDepthServiceUrl = 'http://localhost:3001';

  // Make a GET request to the market depth service to retrieve the latest market data for the specified pair
  const response = await axios.get(`${marketDepthServiceUrl}/market-data/${pair}`);
  // Return the latest market data
  return response.data;
};

// Handle GET requests for market data
dataProviderRoutes.get('/:pair', async (req, res) => {
  const pair = req.params.pair;

  try {
    // Retrieve the latest market data for the requested pair from the market-depth-service
    const latestMarketData = await getLatestMarketData(pair);
    // Send the latest market data as a response to the client
    res.json(latestMarketData);
  } catch (error) {
    console.error(`Error retrieving market data for ${pair}: ${error}`);
    // Send an error response to the client
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle WebSocket connections for real-time market data updates
dataProviderRoutes.ws('/:pair', (ws, req) => {
  const pair = req.params.pair;

  // Register the WebSocket client to receive real-time market data updates from the market-depth-service
  const io = new Server();
  const socket = io('http://localhost:3001');
  socket.emit('subscribe', pair);

  // Send real-time market data updates to the client
  socket.on('market-data', (data) => {
    ws.send(JSON.stringify(data));
  });
});

export default dataProviderRoutes;
