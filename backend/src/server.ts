import 'dotenv/config.js';

import app from './app.js';
import prisma from './config/prisma.js';

const PORT = process.env.PORT || 3000;

async function run() {
    try {
        await prisma.$connect();
        app.listen(PORT, async () => {
            console.info(`Backend escuchando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error conectando a la base de datos:', error);
        process.exit(1);
    }
}

await run();
