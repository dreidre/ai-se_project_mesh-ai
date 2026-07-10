import dotenv from 'dotenv';
import morgan from 'morgan';
import { logger } from './utils/logger.js';


dotenv.config();

import express from 'express';
import mongoose from 'mongoose';

import router from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const isProduction = process.env.NODE_ENV === 'production';
const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

app.use(morgan(isProduction ? 'combined' : 'dev'));


app.get('/health', (req, res): void => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  });
});

app.get('/test-error', () => {
  throw new Error('Test error');
});

app.use(express.json());




app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error('Connection error', err);
  });
