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
    PreviousPrice: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offPercent: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const productModel = mongoose.model("product", productSchema);
