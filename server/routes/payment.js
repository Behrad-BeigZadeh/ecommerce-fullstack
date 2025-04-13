import Coupon from "../models/coupon.js";
import { verifyToken } from "./user.js";
import express from "express";
import { stripe } from "../lib/stripe.js";
import Order from "../models/order.js";
import { UserModel } from "../models/users.js";
import { productModel } from "../models/products.js";

const router = express.Router();

router.post("/create-checkout-session", verifyToken, async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    const userID = req.headers.userid;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userID,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: userID.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res
      .status(500)
      .json({ message: "Error processing checkout", error: error.message });
  }
});
router.post("/checkout-success", verifyToken, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const user = await UserModel.findById(session.metadata.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userID: session.metadata.userId,
          },
          { isActive: false }
        );
      }

      // Check if the session has already been processed
      const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
      if (existingOrder) {
        return res
          .status(400)
          .json({ message: "This session has already been processed" });
      }

      // Create a new order
      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100, // convert from cents to dollars
        stripeSessionId: sessionId,
      });
      if (session.payment_status === "paid" && session.amount_total >= 20000) {
        await createNewCoupon(session.metadata.userId);
      }

      await newOrder.save();

      // update product quantity
      for (const product of products) {
        const productInDb = await productModel.findById(product.id);
        if (productInDb) {
          productInDb.stockQuantity -= product.quantity; // directly reduce stockQuantity

          await productInDb.save();
        }
      }

      // Add cart items to purchasedItems
      const purchasedItems = user.cartItems.map((item) => item.id);

      purchasedItems.forEach((itemId) => {
        if (!user.purchasedItems.includes(itemId)) {
          user.purchasedItems.push(itemId); // Add item if it does not exist
        }
      });

      await user.save().catch((error) => {
        console.error("Error saving user:", error);
        return res.status(500).json({
          message: "Error updating user with purchased items",
          error: error.message,
        });
      });
      console.log("Checkout success, items moved to purchasedItems");

      // Respond with success message
      return res.status(200).json({
        success: true,
        message:
          "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder._id,
        stripeSessionId: sessionId,
      });
    } else {
      return res.status(400).json({ message: "Payment was not successful" });
    }
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate sessionId error
      return res.status(400).json({ message: "Checkout already processed" });
    }

    console.error("Error processing successful checkout:", error);
    return res.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
});

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

async function createNewCoupon(userID) {
  await Coupon.findOneAndDelete({ userID });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userID,
  });

  await newCoupon.save();

  return newCoupon;
}

export default router;
