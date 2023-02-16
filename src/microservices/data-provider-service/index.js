import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import winston from 'winston';

const app = express();

// Configuring middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Setting up routes
app.get('/', (req, res) => {
  res.send('Hello from data provider microservice!');
});

// Setting up error handling
app.use((err, req, res, next) => {
  winston.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
