import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";
import mongoose from "mongoose";

// --- CAMBIO AQUÍ: Añadido .models ---
import { Artist } from "../src/models/Artist.models.js";
import { Vinyl } from "../src/models/Vinyl.models.js";
// ------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... (El resto del código sigue igual) ...
const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error("❌ Falta MONGODB_URI en backend/.env");
  process.exit(1);
}

const dataDir = path.join(__dirname, "..", "data");
const ARTISTS_CSV = path.join(dataDir, "artists.csv");
const VINYLS_CSV = path.join(dataDir, "vinyls.csv");
const SNAP_DIR = path.join(dataDir, "_snapshots");

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function seedVinyls(vinylRows) {
  if (!vinylRows.length) return;
  console.log(`💾 Procesando ${vinylRows.length} vinilos...`);

  const ops = vinylRows.map((v) => {
    const doc = {
      sku: v.sku,
      artist_code: v.artist_code,
      artist_name: v.artist_name,
      title: v.title,
      year: v.year || undefined,
      price_eur: parseFloat(v.price_eur) || 0,
      stock: parseInt(v.stock, 10) || 0,
      weight_g: parseInt(v.weight_g, 10) || 180,
      condition: v.condition || "New",
      color_variant: v.color_variant || "Black",
      speed_rpm: v.speed_rpm || "33",
      cover_image: v.cover_image || "",
      status: v.status || undefined,
      genre: v.genre || undefined
    };
    return {
      updateOne: {
        filter: { sku: v.sku },
        update: { $set: doc },
        upsert: true,
      },
    };
  });

  const res = await Vinyl.bulkWrite(ops, { ordered: false });
  console.log("✅ Vinilos:", {
    upserted: res.upsertedCount || 0,
    matched: res.matchedCount || 0,
    modified: res.modifiedCount || 0,
  });
}

async function seedArtists(artistRows) {
  if (!artistRows.length) return;
  console.log(`🎤 Procesando ${artistRows.length} artistas...`);

  const ops = artistRows.map((a) => ({
    updateOne: {
      filter: { artist_code: a.artist_code },
      update: { $set: { name: a.name } },
      upsert: true,
    },
  }));

  const res = await Artist.bulkWrite(ops, { ordered: false });
  console.log("✅ Artistas:", {
    upserted: res.upsertedCount || 0,
    matched: res.matchedCount || 0,
    modified: res.modifiedCount || 0,
  });
}

async function main() {
  try {
    console.log("🔌 Conectando a MongoDB…");
    await mongoose.connect(MONGODB_URI); // Eliminado timeout opcional para simplificar
    console.log("✅ Conectado");

    const [artistRows, vinylRows] = await Promise.all([
      readCSV(ARTISTS_CSV),
      readCSV(VINYLS_CSV),
    ]);

    // Snapshot opcional (puedes quitarlo si da problemas de permisos)
    try {
      ensureDir(SNAP_DIR);
      fs.writeFileSync(path.join(SNAP_DIR, "artists_snapshot.json"), JSON.stringify(artistRows, null, 2));
      fs.writeFileSync(path.join(SNAP_DIR, "vinyls_snapshot.json"), JSON.stringify(vinylRows, null, 2));
    } catch (e) { console.log("⚠️ No se pudieron guardar snapshots (no crítico)"); }

    await seedArtists(artistRows);
    await seedVinyls(vinylRows);

    console.log("🏁 Carga completada.");
  } catch (e) {
    console.error("❌ Error:", e);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();