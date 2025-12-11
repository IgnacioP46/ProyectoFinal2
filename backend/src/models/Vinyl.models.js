import mongoose from "mongoose";

const vinylSchema = new mongoose.Schema({
  sku: { type: String, unique: true, required: true }, // Clave fundamental para el seed
  artist_code: String,
  artist_name: { type: String, required: true, text: true },
  title: { type: String, required: true, text: true },
  year: String,
  price_eur: { type: Number, required: true }, // Antes tenías 'price', ahora coincide con el CSV
  stock: { type: Number, default: 0 },
  weight_g: Number,
  condition: String,
  color_variant: String,
  speed_rpm: String,
  cover_image: String,
  status: String,
  genre: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Índice para el buscador (busca por título y artista)
vinylSchema.index({ title: 'text', artist_name: 'text' });

export const Vinyl = mongoose.model("Vinyl", vinylSchema);