const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");


// Route to handle forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Forgot password request for email:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const host = process.env.HOST || 'localhost:3000';
    const resetURL = `http://${host}/reset/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetURL}`,
    });

    return res.json({ message: "Password reset link sent to your email." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Route to render the forgot password page
router.get("/forgot-password", (req, res) => {
  res.render("users/forgot-password");
});


// Route to handle password reset
router.post("/reset-password/:token", async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Token invalid or expired" });

  // ✅ Use passport-local-mongoose's setPassword method
  user.setPassword(req.body.password, async (err) => {
    if (err) return res.status(500).json({ message: "Password reset failed" });

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  });
});

// Route to render the reset password page
router.get("/reset-password/:token", (req, res) => {
  const token = req.params.token;
  res.render("users/reset-password", { token });
});

module.exports = router;


