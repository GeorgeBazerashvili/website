const express = require("express");
const router = express.Router();
const User = require("./User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.get("/signin", async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json({ user: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      email,
      password,
      name,
    });

    res
      .status(201)
      .json({ message: "User registered Succeccfully!", data: user });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, error: `User already exists: ${error.message}` });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, existingUser.password);

    if (isValid) {
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.SECRET_TOKEN
      );
      res
        .status(200)
        .json({ token, message: "logged In Successfully!", success: true });
    } else {
      return res.status(404).json({ message: "account not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
