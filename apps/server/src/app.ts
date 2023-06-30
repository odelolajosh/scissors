import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/api.router';
import slRouter from './routes/sl.router';
import errorMiddleware from './errors/handler';
import Db from './services/db';
import Cache from './services/cache';

dotenv.config();

Db.connect();
Cache.connect();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('Hello world!');
});

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api/v0', router);
app.use('/', slRouter);

// Error handler
app.use(errorMiddleware);

export default app;