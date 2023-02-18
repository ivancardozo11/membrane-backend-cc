import { Server } from 'socket.io';

 /*
 This file contains two functions, getOrderBookTipsand getEffectivePrice, which are responsible for processing 
 the market depth data to provide useful information to the Market Depth microservice. The function getOrderBookTipsreturns 
 the best bid and ask bids for a given trading pair, while getEffectivePricecalculating the effective price and the maximum 
 order amount that can be executed for a given trading pair and price limit. These functions are called by the Market Depth 
 microservice router ( marketDepthRoutes.js) when a client requests depth of market information.

To get real-time market depth data, market-depth-analysis.jsit communicates with the Data Provider microservice server via WebSockets. 
When the Data Provider server sends order book updates, market-depth-analysis.jsit processes the data and updates the values ​​of orderbookTips, 
which can then be accessed by the getOrderBookTipsand functions getEffectivePrice.

Finally, the file market-depth-analysis.jsintegrates with the Market Depth microservice via the file index.js, where it connects to the Data Provider 
server and streams the market depth data via WebSockets to the clients of the microservice.

 */

// Create a new socket.io server instance
const io = new Server('http://localhost:3003');

// Object to store the order book tips for each pair
const orderbookTips = {};

// Handle 'connect' event
io.on('connect', () => {
  console.log('Connected to Data Provider');
});

// Handle 'disconnect' event
io.on('disconnect', () => {
  console.log('Disconnected from Data Provider');
});

// Handle 'orderbook' event
io.on('orderbook', (orderbook) => {
  // Update orderbook tips for each pair
  for (const pair in orderbook) {
    const { bids, asks } = orderbook[pair];
    orderbookTips[pair] = {
      bid: bids.length ? bids[0].price : null,
      ask: asks.length ? asks[0].price : null
    };
  }
});

// Function to get order book tips for a given pair
function getOrderBookTips(pair) {
  // Check if the given pair is valid
  if (pair in orderbookTips) {
    return orderbookTips[pair];
  } else {
    throw new Error(`Invalid pair: ${pair}`);
  }
}

// Function to get effective price for a trade of a given pair, type (buy/sell), amount, and optional limit
async function getEffectivePrice(pair, type, amount, limit) {
  // Check if we have enough order book data for the given pair
  if (!(pair in orderbookTips)) {
    throw new Error(`Invalid pair: ${pair}`);
  }

  // Get the order book for the given pair from Data Provider using socket.io
  const { bids, asks } = await io.to('dataProvider').emit('getOrderBook', pair);

  // Calculate effective price based on trade type, amount, and limit
  let totalAmount = 0;
  let totalPrice = 0;

  if (type === 'buy') {
    // Iterate through asks
    for (let i = 0; i < asks.length; i++) {
      const ask = asks[i];
      if (ask.price > limit) break;
      const amountToUse = Math.min(ask.amount, amount - totalAmount);
      totalPrice += ask.price * amountToUse;
      totalAmount += amountToUse;
      if (totalAmount === amount) break;
    }
  } else if (type === 'sell') {
    // Iterate through bids
    for (let i = 0; i < bids.length; i++) {
      const bid = bids[i];
      if (bid.price < limit) break;
      const amountToUse = Math.min(bid.amount, amount - totalAmount);
      totalPrice += bid.price * amountToUse;
      totalAmount += amountToUse;
      if (totalAmount === amount) break;
    }
  } else {
    throw new Error(`Invalid type: ${type}`);
  }

  if (totalAmount < amount) {
    throw new Error(`Insufficient liquidity for trade`);
  }
// Return the pair, trade type, trade amount, and effective price
  return {
    pair,
    type,
    amount,
    effectivePrice: totalPrice / amount
  };
}

// Export the functions
export { 
  getOrderBookTips, 
  getEffectivePrice 
};
