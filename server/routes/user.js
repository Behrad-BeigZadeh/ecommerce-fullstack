import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/users.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { body, validationResult } from "express-validator";
dotenv.config();

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ email, password: hashedPassword });
      await newUser.save();
      res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res
        .status(200)
        .json({ message: "Login Successful", token, userID: user._id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Email is invalid")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      });
      var mailOptions = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: "Forgot Password",
        text: `${process.env.CLIENT_URL}/reset-password?token=${token}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.send({ Status: "Success" });
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/reset-password",
  [
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { token, newPassword } = req.body;
    if (!newPassword || !token) {
      return res.status(400).json("Password is required");
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(400).json("Token is not valid");
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const filter = { _id: decoded.id };
      const update = { password: hashedPassword };
      await UserModel.findOneAndUpdate(filter, update);
      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SECRET, (err) => {
      if (!authHeader) {
        return res.status(401).json({ message: "Not authorized" });
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export default router;
