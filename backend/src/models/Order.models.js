import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Null si es invitado
  guest_info: { // Datos si no está registrado
    name: String,
    email: String,
    address: {
      street: String,
      city: String,
      zip: String,
      floor: String
    }
  },
  items: [{
    vinyl_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vinyl" },
    title: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  status: { type: String, default: "paid" }, // paid, shipped, delivered
  date: { type: Date, default: Date.now }
});

export const Order = mongoose.model("Order", orderSchema);