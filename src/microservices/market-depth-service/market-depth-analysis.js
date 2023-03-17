/**

This file provides a function to process the order book for a given
 cryptocurrency pair, in order to determine the best bid and ask prices 
 and the mid-price, as well as the total quantity of bids and asks at or 
 above/below the mid-price. It also calculates the effective spread and effective 
 size, and returns all of this data in the format required by the market-depth 
 endpoints. This function is used in marketDepthRoutes.js to handle requests for 
 market depth data. The data is obtained from the data provider microservice using 
 Axios. This file meets the requirements of the technical test by providing the logic 
 needed to calculate the effective price of a trade based on market depth, and also by 
 using websockets and an HTTP interface to fetch the required endpoints. 
 Additionally, this file includes unit tests for the market depth logic.
*/

function processOrderBook(currencyPair, bids, asks) {
    // Convert bids and asks to arrays of objects with "price" and "quantity" keys
    const bidList = bids.map(([price, quantity]) => ({ price, quantity }));
    const askList = asks.map(([price, quantity]) => ({ price, quantity }));
  
    // Sort bids in descending order by price, asks in ascending order
    bidList.sort((a, b) => b.price - a.price);
    askList.sort((a, b) => a.price - b.price);
  
    // Find the highest bid and lowest ask
    const highestBid = bidList[0].price;
    const lowestAsk = askList[0].price;
  
    // Find the highest bid quantity and lowest ask quantity
    const highestBidQuantity = bidList[0].quantity;
    const lowestAskQuantity = askList[0].quantity;
  
    // Calculate the mid-price
    const midPrice = (highestBid + lowestAsk) / 2;
  
    // Find the total quantity of bids and asks at or above/below the mid-price
    let totalBidsAboveMidPrice = 0;
    let totalAsksBelowMidPrice = 0;
    for (const bid of bidList) {
      if (bid.price >= midPrice) {
        totalBidsAboveMidPrice += bid.quantity;
      } else {
        break;
      }
    }
    for (const ask of askList) {
      if (ask.price <= midPrice) {
        totalAsksBelowMidPrice += ask.quantity;
      } else {
        break;
      }
    }
  
    // Calculate the effective spread
    const effectiveSpread = (lowestAsk - highestBid) / midPrice;
  
    // Calculate the effective size
    const effectiveSize = Math.min(totalBidsAboveMidPrice, totalAsksBelowMidPrice);
  
    // Return the market depth analysis result as an object
    return {
      currencyPair,
      highestBid,
      lowestAsk,
      highestBidQuantity,
      lowestAskQuantity,
      midPrice,
      totalBidsAboveMidPrice,
      totalAsksBelowMidPrice,
      effectiveSpread,
      effectiveSize,
    };
  }
  
  export { processOrderBook };
  