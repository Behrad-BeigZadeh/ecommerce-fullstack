import express from "express";
import { isAdmin, verifyToken } from "./user.js";
import { productModel } from "../models/products.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const products = await productModel.find({});

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add-product", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, price, stockQuantity, previousPrice, offPercent, imageUrl } =
      req.body.product;

    if (!name || !price || !imageUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new productModel({
      name,
      price,
      stockQuantity: stockQuantity || 0,
      previousPrice: previousPrice !== null ? previousPrice : null,
      offPercent: offPercent !== null ? offPercent : null,
      imageUrl,
    });

    await newProduct.save();
    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { product } = req.body;
    const { id } = req.params;
    const updatedProduct = {
      name: product.name || undefined,
      price: product.price || null,
      stockQuantity: product.stockQuantity || 0,
      previousPrice: product.previousPrice || null,
      offPercent: product.offPercent || null,
      imageUrl: product.imageUrl || undefined,
    };

    const updated = await productModel.findByIdAndUpdate(
      { _id: id },
      updatedProduct,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    res.status(201).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
