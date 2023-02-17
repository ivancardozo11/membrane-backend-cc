import express from 'express';
import { getOrderBook, getEffectivePrice } from '../../data-consumer.js';

const dataProviderRouter = express.Router();

// Endpoint to obtain the orderbook information
dataProviderRouter.get('/orderbook/:symbol/:precision', async (req, res) => {
  const { symbol, precision } = req.params;
  const orderBook = await getOrderBook(symbol, precision);
  const { asks, bids } = orderBook;
  res.json({ asks, bids });
});
// Endpoint to calculate the effective price for a given quantity
dataProviderRouter.get('/effective-price/:symbol/:type/:amount', async (req, res) => {
  const { symbol, type, amount } = req.params;
  console.log(req.params);
  const effectivePrice = await getEffectivePrice(symbol, type, amount);
  console.log(getEffectivePrice, 'this is the efective price');
  res.json(effectivePrice);
});

export default dataProviderRouter;
