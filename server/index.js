import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";
import userRouter from "./routes/user.js";
import couponRouter from "./routes/coupon.js";
import paymentsRouter from "./routes/payment.js";
import adminRouter from "./routes/admin.js";
import { connectDb } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import morgan from "morgan";
import helmet from "helmet";

const app = express();
dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});
app.use(helmet());
app.use(morgan("dev"));

//controlling number of requests and bot detection with arcjet
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});

app.use("/api/products", productsRouter);
app.use("/api/products/admin", adminRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/auth", userRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is starting...`);
  connectDb()
    .then(() => {
      console.log(`Server is running on PORT ${PORT}`);
    })
    .catch((err) => {
      console.log("DB Connection Error:", err);
    });
});
