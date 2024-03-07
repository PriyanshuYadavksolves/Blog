const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const checkUserExists = require('../middleware/checkUserExists')
const jwt = require('jsonwebtoken')

//Register
router.post("/register",checkUserExists, async (req, res) => {
  try {
    const {username,password,email,profilePic} = req.body
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPass,
      profilePic: profilePic,
    });

     const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json("wrong credentials!");
      return;
    }

    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) {
      res.status(400).json("wrong credentials!");
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '3d' });

    const { password,createdAt,updatedAt,__v, ...others } = user._doc;
    res.status(200).json({others,token});
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
