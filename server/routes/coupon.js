import Coupon from "../models/coupon.js";
import { verifyToken } from "./user.js";
import express from "express";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const userID = req.headers.userid;

    const coupon = await Coupon.findOne({ userID, isActive: true });
    res.json(coupon || null);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.post("/validate", verifyToken, async (req, res) => {
  try {
    const { code } = req.body;
    const userID = req.headers.userid;

    const coupon = await Coupon.findOne({ code: code, userID, isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
