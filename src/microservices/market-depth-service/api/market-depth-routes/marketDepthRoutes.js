import express from 'express';
import { processOrderBook } from '../../market-depth-analysis.js';
import axios from 'axios';

const marketDepthRoutes = express.Router();

// Route for retrieving best bid and ask prices for a given currency pair
marketDepthRoutes.get('/tips/:pair', async (req, res) => {
  try {
    // Retrieve order book data from external data provider
    const { data } = await axios.get(`http://localhost:3000/data-provider/${req.params.pair}`);

    // Extract bid and ask data from the order book
    const bids = data.bids;
    const asks = data.asks;

    // Return the top bid and ask prices and quantities
    res.json({
      currencyPair: req.params.pair,
      bestBid: bids[0],
      bestAsk: asks[0],
      bestBidQuantity: bids[0][1],
      bestAskQuantity: asks[0][1]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

// Route for retrieving the effective price and maximum order size for a given trade
marketDepthRoutes.get('/evaluate/:pair/:operation/:amount/:limit', async (req, res) => {
  try {
    // Retrieve order book data from external data provider
    const { data } = await axios.get(`http://localhost:3000/data-provider/${req.params.pair}`);

    // Extract bid and ask data from the order book
    const bids = data.bids;
    const asks = data.asks;

    // Determine whether the operation is a buy or a sell
    const isBuy = req.params.operation === 'buy';

    // Find the total quantity of bids and asks at or above/below the mid-price
    let totalBidsOrAsks = 0;
    let totalPrice = 0;
    for (const order of (isBuy ? asks : bids)) {
      const price = order[0];
      const quantity = order[1];

      if ((isBuy && price > totalPrice) || (!isBuy && price < totalPrice)) {
        if (totalPrice + (quantity * price) <= req.params.limit) {
          totalBidsOrAsks += quantity;
          totalPrice += quantity * price;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Calculate the effective price
    const effectivePrice = totalPrice / req.params.amount;

    // Calculate the maximum order size
    const maxOrderSize = totalBidsOrAsks;

    // Return the results
    res.json({
      currencyPair: req.params.pair,
      operation: req.params.operation,
      amount: req.params.amount,
      effectivePrice,
      maxOrderSize
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

// Route for retrieving market depth data
marketDepthRoutes.get('/depth/:pair', async (req, res) => {
  try {
    // Retrieve order book data from external data provider
    const { data } = await axios.get(`http://localhost:3000/data-provider/:pair`);

    // Extract bid and ask data from the order book
    const bids = data.bids;
    const asks = data.asks;

    // Process the order book data to determine market depth
const marketDepth = processOrderBook(req.params.pair, bids, asks);
res.json(marketDepth);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
    });
    
    export default marketDepthRoutes;
