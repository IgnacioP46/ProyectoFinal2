import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import vinylRoutes from './routes/vinyl.routes.js'; 
// --- NUEVO IMPORT ---
import authRoutes from './routes/auth.routes.js'; 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ... (código de conexión a MongoDB que ya tienes) ...

// Rutas
app.use('/api/vinyls', vinylRoutes);
// --- NUEVA RUTA ---
app.use('/api/auth', authRoutes); // Esto habilitará http://localhost:3000/api/auth/register

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});