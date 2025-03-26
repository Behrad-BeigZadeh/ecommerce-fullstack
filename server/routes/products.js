import express from "express";
import { verifyToken } from "./user.js";
import { UserModel } from "../models/users.js";
import { productModel } from "../models/products.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await productModel.find({});
    console.log(products);
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/clear-cart", async (req, res) => {
  try {
    const userID = req.headers.userid;
    const user = await UserModel.findByIdAndUpdate(userID, {
      $set: { cartItems: [] },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.save();
    console.log(user);
    res.status(201).json({ message: "Cart Cleared Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add-to-cart", verifyToken, async (req, res) => {
  try {
    const { productID } = req.body;
    const userID = req.headers.userid;
    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingItem = user.cartItems.find((item) => item.id === productID);
    console.log(existingItem);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productID);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/checkout", verifyToken, async (req, res) => {});

router.get("/cart-items", verifyToken, async (req, res) => {
  try {
    const userID = req.headers.userid;

    const user = await UserModel.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const products = await productModel.find({
      _id: { $in: user.cartItems },
    });

    const cartItems = products.map((product) => {
      const item = user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/update-cart/:id", verifyToken, async (req, res) => {
  const { id: productID } = req.params;
  const { quantity } = req.body;
  const userID = req.headers.userid;

  try {
    const user = await UserModel.findById(userID);

    const existingItem = user.cartItems.find((item) => item.id === productID);

    if (existingItem) {
      existingItem.quantity = quantity;

      await user.save();

      res.status(201).json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in updateProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const { id: productID } = req.params;
  const userID = req.headers.userid;

  try {
    const user = await UserModel.findById(userID);

    const existingItem = user.cartItems.find((item) => item.id === productID);

    if (!existingItem) {
      res.status(404).json({ message: "Product not found" });
    }

    user.cartItems = user.cartItems.filter((item) => item.id !== productID);

    await user.save();
    res.status(201).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    console.log("Error in updateProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
