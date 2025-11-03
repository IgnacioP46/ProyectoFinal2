// backend/src/seed/importVinylsFromCSV.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { parse } from "csv-parse";
import Vinyl from "../models/Vinyl.models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/murmullo";
const CSV_PATH = path.resolve(__dirname, "../../data/vinyls.csv");

const adaptRow = (row) => {
  const title = (row.title || row.Title || "").trim();
  const artist_name = (row.artist_name || row.artist || "").trim();

  const priceRaw = row.price ?? row.price_eur ?? "";
  const price = Number(String(priceRaw).replace(",", ".").trim()) || 0;

  return {
    title,
    artist_name,
    price,
    cover_image: (row.cover_image || row.cover || "").trim(),
    genre: (row.genre || "").trim(),
    year: row.year ? Number(row.year) : undefined,
    label: row.label || undefined,
  };
};

async function run() {
  console.log("Conectando a Mongo...");
  await mongoose.connect(MONGODB_URI);

  const parser = fs.createReadStream(CSV_PATH).pipe(
    parse({ columns: true, skip_empty_lines: true, trim: true })
  );

  let ok = 0, fail = 0;
  for await (const record of parser) {
    const doc = adaptRow(record);
    if (!doc.title || !doc.artist_name) {
      fail++; 
      console.warn("Fila ignorada (sin title/artist_name):", record);
      continue;
    }
    try {
      await Vinyl.findOneAndUpdate(
        { artist_name: doc.artist_name, title: doc.title },
        { $set: doc },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      ok++;
    } catch (err) {
      fail++;
      console.error(`Upsert falló "${doc.artist_name}" - "${doc.title}":`, err.message);
    }
  }

  console.log(`Importación terminada → OK: ${ok}, FALLÓ: ${fail}`);
  await mongoose.disconnect();
}

run().catch(async (e) => {
  console.error("Fallo en importación:", e);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
