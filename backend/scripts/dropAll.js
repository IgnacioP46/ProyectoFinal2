import "dotenv/config";
import mongoose from "mongoose";
import { Artist } from "../src/models/Artist.js";
import { Vinyl } from "../src/models/Vinyl.js";

const { MONGODB_URI } = process.env;

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("⚠️ Eliminando colecciones…");
    await Vinyl.deleteMany({});
    await Artist.deleteMany({});
    console.log("✅ Limpieza OK");
  } catch (e) {
    console.error("❌ Error limpiando:", e?.message || e);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
