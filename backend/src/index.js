import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar conexión a DB
import connectDB from './config/db.js'; 

// Importar Rutas
import vinylRoutes from './routes/vinyl.routes.js'; 
import authRoutes from './routes/auth.routes.js'; 
import orderRoutes from './routes/order.routes.js'; 
import userRoutes from './routes/user.routes.js'; 

dotenv.config();

// Conectar a la base de datos
const mongoURI = process.env.MONGODB_URI;
connectDB(mongoURI);

const app = express();

app.use(cors());
app.use(express.json());

// Definir endpoints
app.use('/api/vinyls', vinylRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});