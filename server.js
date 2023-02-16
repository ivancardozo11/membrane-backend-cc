import express from 'express';
import morgan from 'morgan';
import winston from 'winston';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define endpoints here

const port = process.env.PORT || 8080;

app.listen(port, () => {
  winston.info(`Server started on port ${port}🚀🚀🚀`);
});
