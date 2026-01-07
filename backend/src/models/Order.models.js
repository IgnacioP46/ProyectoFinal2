import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        vinyl: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vinyl",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
        price_at_purchase: { type: Number, required: true },
      },
    ],
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "shipped", "cancelled"],
      default: "completed",
    },
    shipping_address: {
      street: String,
      city: String,
      zipCode: String,
    }
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);