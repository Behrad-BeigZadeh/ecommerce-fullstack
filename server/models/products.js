import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    previousPrice: {
      type: Number,
      required: false,
      default: null,
    },
    price: {
      type: Number,
      required: true,
    },
    offPercent: {
      type: Number,
      required: false,
      default: null,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export const productModel = mongoose.model("Product", productSchema);
