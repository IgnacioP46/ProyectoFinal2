import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/murmullo";
const PORT = process.env.PORT || 3000; // ⚠️ No uses 5173 (lo usa Vite)

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB conectado");
    app.listen(PORT, () => {
      console.log(`🚀 API escuchando en http://127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1);
  }
}

start();
