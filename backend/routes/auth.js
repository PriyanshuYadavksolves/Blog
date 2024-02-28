const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password,profilePic } = req.body;
    const salt = 10;
    const hashPass = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashPass,
      profilePic:profilePic,
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.post("/login", async (req, res) => {
    try {
      const { email} = req.body;
      console.log(email)
      const pass = req.body.password
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json("User Not Found" );
        return 
      }
      const validation = await bcrypt.compare(pass, user.password);
      if (!validation) {
        res.status(404).json("Wrong Credentials" );
        return 
      }
    const { password ,...userData } = user._doc;
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
