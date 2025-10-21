import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema(
  {
    artist_code: { type: String, unique: true, index: true, required: true },
    name: { type: String, required: true },
    
  },
  { timestamps: true }
);

export const Artist = mongoose.model("Artist", ArtistSchema);
