import { Server } from 'socket.io';

const dataConsumer = (io) => {
  const socket = io('wss://api.bitfinex.com/ws/2');

  // Subscribe to the order book channels for BTC-USD and ETH-USD
  const defaultSymbols = ['tBTCUSD', 'tETHUSD'];
  const subscribedSymbols = new Set(defaultSymbols);
  
  const subscribeToSymbol = (symbol) => {
    socket.send(JSON.stringify({
      event: 'subscribe',
      channel: 'book',
      symbol: symbol,
      prec: 'P0',
      freq: 'F0',
      len: 25,
    }));
  };
  
  defaultSymbols.forEach((symbol) => {
    subscribeToSymbol(symbol);
  });

  // Listen for real-time order book updates
  socket.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      if (message[1] !== 'hb') {
        const symbol = message[0];
        const pair = symbol.slice(1, -3);
        if (!subscribedSymbols.has(symbol)) {
          subscribedSymbols.add(symbol);
          subscribeToSymbol(symbol);
        }
        const updates = message[1];
        const processedData = processOrderBookData(pair, updates);

        // Send the processed data to the market-depth-service
        io.emit('market-data', processedData);
      }
    } catch (error) {
      console.error('Error parsing market data:', error);
    }
  });

  // Handle errors and lost connections
  socket.on('error', (error) => {
    console.error('Error in WebSocket connection:', error);
  });

  socket.on('disconnect', () => {
    console.warn('Lost connection to WebSocket, attempting to reconnect...');
    dataConsumer(io);
  });
};

const processOrderBookData = (pair, updates) => {
  // Process the order book data and return the formatted market data object

  // Filter the updates for bid orders
  const bids = updates.filter(update => update[2] > 0);
  // Filter the updates for ask orders
  const asks = updates.filter(update => update[2] < 0);

  // Map the bid orders to a formatted object
  const processedBids = bids.map(bid => ({
    price: bid[0].toFixed(2),
    size: Math.abs(bid[2]).toFixed(6),
  }));

  // Map the ask orders to a formatted object
  const processedAsks = asks.map(ask => ({
    price: ask[0].toFixed(2),
    size: Math.abs(ask[2]).toFixed(6),
  }));

  // Return the formatted market data object
  return {
    pair: pair,
    bids: processedBids,
    asks: processedAsks,
    timestamp: new Date().toISOString(),
  };
};

export default dataConsumer;
