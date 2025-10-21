import mongoose from "mongoose";

const VinylSchema = new mongoose.Schema(
  {
    sku: { type: String, unique: true, index: true, required: true },
    artist_code: { type: String, index: true, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
    artist_name: String,
    title: { type: String, required: true },
    year: Number,
    price: Number,
    stock: Number,
    weight_g: Number,
    condition: String,
    color_variant: String,
    speed_rpm: Number,
    cover_image: String,
    status: String,
  },
  { timestamps: true,
  versionKey: false
 }
);

export const Vinyl = mongoose.model("Vinyl", VinylSchema);
