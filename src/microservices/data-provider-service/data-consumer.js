import axios from 'axios';

//Explanation:
/* The data-consumer.js file defines two functions: getOrderBook and getEffectivePrice. These functions fetch data from the Bitfinex API to get the order book and calculate the effective price for a given trading pair.

The getOrderBook function takes a trading pair, precision, and an optional length parameter, which defaults to 25 if not provided. It then sends a GET request to the Bitfinex API using the axios library to fetch the order book for the given pair, precision, and length. The response from the API is an array of arrays, where each sub-array contains three elements: the price, the count, and the amount. This array is then deconstructed to extract the asks and bids, which are then returned as an object with two properties: asks and bids, each containing an array of arrays with the price, count, and amount for each order.

The getEffectivePrice function takes a trading pair, order type (either "buy" or "sell"), and the amount to trade. It then calls the getOrderBook function to get the order book for the given pair and precision, and then calculates the effective price for the given amount based on the bids or asks, depending on the order type. The effective price is then returned as a number.

Now, these functions are used by the dataProviderRouter in the dataProviderRoutes.js file. This file defines two endpoints: /orderbook/:symbol/:precision and /effective-price/:symbol/:type/:amount. These endpoints receive the necessary parameters from the URL and then call the appropriate function from data-consumer.js to get the required data. The endpoints then return the data as JSON to the client.

The dataProviderRouter is then mounted to the main express app in the index.js file for the data provider service. This file also configures middleware for logging with morgan, enabling CORS with cors, and logging server events with winston. The index.js file exports the main express app and listens on the specified port.

In terms of the requirements of the technical test, these endpoints fulfill part of the requirements for the order book and effective price data. They provide a way for the market depth service to fetch order book data and calculate the effective price for a given trading pair. The data provider service and the market depth service can communicate with each other using these endpoints via HTTP requests.
*/

// Function to get the order book for a given pair and precision
async function getOrderBook(pair, precision, len = 25) {
  try {
    // Make a GET request to the Bitfinex API to fetch the order book for the given trading pair, precision and length
    const response = await axios.get(`https://api-pub.bitfinex.com/v2/book/${pair}/${precision}?len=${len}`);
    // The response from the API is an array of arrays, where each sub-array contains three elements: the price, the count and the amount
    // We destructure this array and extract the asks and bids
    const [asks, bids] = response.data;
    console.log(response.data)
    // We return an object with two properties: asks and bids, each containing an array of arrays with the price, count and amount for each order
    return { asks, bids };
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching order book data');
  }
}



async function getEffectivePrice(symbol, type, amount) {
  const precision = 'P0';
  const orderBook = await getOrderBook(symbol, precision);
  const { asks, bids } = orderBook;
  let sum = 0;
  let quantity = 0;
  let price = 0;
  let i = 0;

  if (type === 'buy') {
    // Iterate over the asks until we have accumulated the desired amount of the asset
    while (quantity < amount && i < asks.length) {
      const [askPrice, count, askAmount] = asks[i];
      quantity += askAmount;
      if (quantity < amount) {
        // If the accumulated quantity is less than the desired amount, add the full order amount to the sum
        sum += askAmount * askPrice;
      } else {
        // If the accumulated quantity is greater than the desired amount, add the proportional amount to the sum
        const remainingQuantity = quantity - amount;
        const proportionalAmount = askAmount - remainingQuantity;
        sum += proportionalAmount * askPrice;
      }
      i++;
    }
  } else if (type === 'sell') {
    // Iterate over the bids until we have accumulated the desired amount of the asset
    while (quantity < amount && i < bids.length) {
      const [bidPrice, count, bidAmount] = bids[i];
      quantity += bidAmount;
      if (quantity < amount) {
        // If the accumulated quantity is less than the desired amount, add the full order amount to the sum
        sum += bidAmount * bidPrice;
      } else {
        // If the accumulated quantity is greater than the desired amount, add the proportional amount to the sum
        const remainingQuantity = quantity - amount;
        const proportionalAmount = bidAmount - remainingQuantity;
        sum += proportionalAmount * bidPrice;
      }
      i++;
    }
  }

  // Calculate the average price of the orders used to reach the desired amount
  if (quantity >= amount) {
    price = sum / amount;
  } else {
    throw new Error('Insufficient liquidity to fulfill order');
  }

  return { symbol, type, amount, price };
}




export { 
    getOrderBook,
    getEffectivePrice
};
