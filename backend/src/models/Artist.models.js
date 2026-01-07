import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  artist_code: { type: String, unique: true },
  name: { type: String, required: true, text: true },
}, { timestamps: true });

export const Artist = mongoose.model("Artist", artistSchema);