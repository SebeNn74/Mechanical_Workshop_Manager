import express from 'express';
import clientRouter from './modules/client/index.js';
import vehicleRouter from './modules/vehicle/index.js';
import receptionRouter from './modules/reception/index.js';
import { handleErrorMiddleware } from '#/shared/middlewares/error.middleware.js';

const app = express();
app.use(express.json());

app.use('/clients', clientRouter);
app.use('/vehicles', vehicleRouter);
app.use('/receptions', receptionRouter)

app.use(handleErrorMiddleware);

export default app;