import express from 'express';
import dataProviderRouter from '../../microservices/data-provider-service/api/data-provider-routes/dataProviderRoutes.js';
import marketDepthRouter from '../../microservices/market-depth-service/api/market-depth-routes/marketDepthRoutes.js';

const app = express();

app.use('/data-provider', dataProviderRouter);
app.use('/market-depth', marketDepthRouter);

export default app;