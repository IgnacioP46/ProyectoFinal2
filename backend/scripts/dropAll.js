import "dotenv/config";
import mongoose from "mongoose";
// --- CAMBIO AQUÍ ---
import { Artist } from "../src/models/Artist.models.js";
import { Vinyl } from "../src/models/Vinyl.models.js";
// -------------------

const { MONGODB_URI } = process.env;

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("⚠️ Eliminando colecciones…");
    await Vinyl.deleteMany({});
    await Artist.deleteMany({});
    console.log("✅ Limpieza OK");
  } catch (e) {
    console.error("❌ Error limpiando:", e);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();