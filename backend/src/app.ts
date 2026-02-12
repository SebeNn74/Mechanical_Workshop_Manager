import express from 'express';
import cors from 'cors';
import clientRouter from './modules/client/index.js';
import vehicleRouter from './modules/vehicle/index.js';
import receptionRouter from './modules/reception/index.js';
import checklistItRouter from './modules/checklist/checklist_item.routes.js';
import budgetRouter from './modules/budget/index.js';
import repairRouter from './modules/repair/index.js';
import photoRouter from './modules/photo/photo.routes.js';
import { handleErrorMiddleware } from '#/shared/middlewares/error.middleware.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:1420';
const allowedOrigins = [FRONTEND_URL];

const options: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
};

const app = express();
app.use(express.json());
app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)(options));

app.use('/clients', clientRouter);
app.use('/vehicles', vehicleRouter);
app.use('/receptions', receptionRouter);
app.use('/checklist-items', checklistItRouter);
app.use('/budgets', budgetRouter);
app.use('/repairs', repairRouter);
app.use('/photos', photoRouter);

app.use(handleErrorMiddleware);

export default app;
