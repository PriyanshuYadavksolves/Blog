const router = require("express").Router();
const Post = require("../models/Post");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//GET ALL POST OF A USER
router.get("/user/", async (req, res) => {
  const author = req.query.user;
  try {
    let posts;
      posts = await Post.findAll({ username:author });
    
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST BY TITLE NAME
router.get('/title/', async (req, res) => {
  const title = req.query.title.trim();
  try {
    let posts;
    if (title) {
      posts = await Post.find({ title: { $regex: new RegExp(title, 'i') } });
    } else {
      posts = await Post.find({});
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});


//CREATE POST
router.post("/", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const file = req.files.image;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "images",
      resource_type: "auto",
      public_id: `${Date.now()}`,
    });

    const {title,desc,username} = req.body
    const newPost = new Post({username,title,desc,photo:result.secure_url})
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/like/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;
    const post = await Post.findById(postId);
    let updatedLikes;
    if (post.likes.includes(userId)) {
      updatedLikes = await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
    } else {
      updatedLikes = await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });
    }
    res.status(200).json(updatedLikes);
  } catch (error) {
    console.error("Error updating likes:", error);
    res.status(500).json({ error: "Failed to update likes" });
  }
});



//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else {
      posts = await Post.find({});
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
