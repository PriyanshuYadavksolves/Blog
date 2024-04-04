const router = require("express").Router();
const User = require("../models/User");
const Blog = require('../models/Blog')
const varifyToken = require('../middleware/varifyToken')

//GET BLOG
router.get("/:id",varifyToken, async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      res.status(200).json(blog);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router
