// In market-depth-routes/marketDepthRoutes.js
import express from 'express';
import * as marketDepthAnalysis from '../../market-depth-analysis.js';

// Create a new router instance
const marketDepthRouter = express.Router();

// Define route to get tips of the order book for a given pair
marketDepthRouter.get('/:pair/tips', async (req, res) => {
  try {
    const pair = req.params.pair;
    // Get tips of order book for given pair
    const tips = await marketDepthAnalysis.getOrderBookTips(pair);
    // Send tips as JSON response
    res.json(tips);
  } catch (error) {
    console.error(`An error occurred while fetching order book tips for pair ${pair}: ${error.message}`);
    // Send error message with 500 status code
    res.status(500).send('Internal server error');
  }
});

// Define route to get effective price for a trade of given amount and type (buy/sell) for a given pair
marketDepthRouter.get('/:pair/effective-price/:type/:amount', async (req, res) => {
  try {
    const pair = req.params.pair;
    const type = req.params.type;
    const amount = Number(req.params.amount);
    const limit = Number(req.query.limit) || undefined;
    // Get effective price for trade
    const effectivePrice = await marketDepthAnalysis.getEffectivePrice(pair, type, amount, limit);
    // Send effective price as JSON response
    res.json(effectivePrice);
  } catch (error) {
    console.error(`An error occurred while fetching effective price for pair ${pair}: ${error.message}`);
    // Send error message with 500 status code
    res.status(500).send('Internal server error');
  }
});

// Export the router
export default marketDepthRouter;
