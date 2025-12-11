import express from "express";
import cors from "cors";
import vinylRoutes from "./routes/vinyl.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";



const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/vinyls", vinylRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

export default app;