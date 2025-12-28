import express from "express";
import cors from "cors";
import vinylRoutes from "./routes/vinyl.routes.js";

const app = express();

// Middlewares (Configuraciones básicas)
app.use(cors());          // Permite que el Frontend se conecte
app.use(express.json());  // Permite recibir datos JSON

// Rutas
app.use("/api/vinyls", vinylRoutes); // Aquí definimos la URL final

export default app;