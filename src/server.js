import * as fs from 'node:fs';

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUIExpress from 'swagger-ui-express';
import router from './routers/index.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import path from 'node:path';

const PORT = Number(getEnvVar('PORT', '3000'));

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('docs', 'swagger.json'), 'utf-8'),
);

export const setupServer = () => {
  const app = express();

  app.use(
    '/api-docs',
    swaggerUIExpress.serve,
    swaggerUIExpress.setup(swaggerDocument),
  );

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://money-guard-backend-lnfk.onrender.com',
      ],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
