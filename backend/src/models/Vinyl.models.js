import mongoose from "mongoose";

const VinylSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist_name: { type: String, required: true, trim: true },
    price: { type: Number, default: 0 },
    cover_image: { type: String, default: "" },
    genre: { type: String, default: "" },
    year: { type: Number },
    label: { type: String },
  },
  { timestamps: true }
);

// Si da conflicto por duplicados, comenta temporalmente el índice
VinylSchema.index({ artist_name: 1, title: 1 }, { unique: true });

const Vinyl = mongoose.model("Vinyl", VinylSchema);
export default Vinyl;
