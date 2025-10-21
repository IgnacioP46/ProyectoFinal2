import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";
import mongoose from "mongoose";
import { Artist } from "../src/models/Artist.js";
import { Vinyl } from "../src/models/Vinyl.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error("❌ Falta MONGODB_URI en backend/.env");
  process.exit(1);
}

const dataDir = path.join(__dirname, "..", "data");
const ARTISTS_CSV = path.join(dataDir, "artists.csv");
const VINYLS_CSV = path.join(dataDir, "vinyls.csv");
const SNAP_DIR   = path.join(dataDir, "_snapshots");

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

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function toNumber(v) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

async function seedArtists(rows) {
  console.log(`➡️  Sembrando artistas (${rows.length})…`);
  const ops = rows.map((a) => ({
    updateOne: {
      filter: { artist_code: a.artist_code },
      update: { $set: { artist_code: a.artist_code, name: a.name } },
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

async function seedVinyls(rows) {
  console.log(`➡️  Sembrando vinilos (${rows.length})…`);

  // Cache de artistas
  const artists = await Artist.find({}, { _id: 1, artist_code: 1 }).lean();
  const byCode = new Map(artists.map((a) => [a.artist_code, a._id]));

  const ops = rows.map((v) => {
    const doc = {
      sku: v.sku,
      artist_code: v.artist_code,
      artist: byCode.get(v.artist_code) || null,
      artist_name: v.artist_name ?? undefined,
      title: v.title,
      year: toNumber(v.year),
      price: toNumber(v.price_eur),
      stock: toNumber(v.stock),
      weight_g: toNumber(v.weight_g),
      condition: v.condition || undefined,
      color_variant: v.color_variant || undefined,
      speed_rpm: toNumber(v.speed_rpm),
      cover_image: v.cover_image || undefined,
      status: v.status || undefined,
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

async function main() {
  try {
    console.log("🔌 Conectando a MongoDB…");
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("✅ Conectado");

    // 1) Leer CSV
    const [artistRows, vinylRows] = await Promise.all([
      readCSV(ARTISTS_CSV),
      readCSV(VINYLS_CSV),
    ]);

    // 2) Escribir snapshots JSON (requisito: usar fs para leer/escribir)
    ensureDir(SNAP_DIR);
    fs.writeFileSync(
      path.join(SNAP_DIR, "artists_snapshot.json"),
      JSON.stringify(artistRows, null, 2),
      "utf-8"
    );
    fs.writeFileSync(
      path.join(SNAP_DIR, "vinyls_snapshot.json"),
      JSON.stringify(vinylRows, null, 2),
      "utf-8"
    );

    // 3) Sembrar (idempotente)
    await seedArtists(artistRows);
    await seedVinyls(vinylRows);

    console.log("🎉 Seed desde CSV completado.");
  } catch (err) {
    console.error("❌ Error en seed:", err?.message || err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado");
  }
}

main();
