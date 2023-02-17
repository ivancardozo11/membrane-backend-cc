import express from 'express';
import dataProviderRouter from '../../microservices/data-provider-service/api/data-provider-routes/dataProviderRoutes.js';

const app = express();

app.use('/data-provider', dataProviderRouter);

export default app;