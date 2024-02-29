const router = require('express').Router()
const User = require('../models/User')
const Blog = require('../models/Blog')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

router.get("/user/", async (req, res) => {
    const author = req.query.user;
    try {
      let posts;
        console.log(author)
        posts = await Blog.find({ author });
      
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.get('/getAll',async(req,res)=>{
    try {
        const blogs = await Blog.find({})
        res.status(200).json(blogs) 
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/getOne/:id',async(req,res)=>{
    try {
        const {id} = req.params
        const blog = await Blog.findById(id)
        res.status(200).json(blog)
    } catch (error) {
        res.status(500).json(error)
    }
})
router.post("/createBlog", async (req, res) => {
    // const newPost = new Post(req.body);
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
  
      const {title,author,desc} = req.body
      const blog = await Blog.create({title,author,desc,photo:result.secure_url})
      res.status(200).json(blog)
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
router.delete('/deleteBlog/:id',async(req,res)=>{
    try {
        const {id} = req.params
        const blog = await Blog.findByIdAndDelete(id)
        res.status(200).json({blog,msg:"blog deleted successfully"})
    } catch (error) {
        console.log(error)
    }
}) 

router.patch('/updateBlog/:id',async(req,res)=>{
    try {
        const {id} = req.params
        const {title,desc} = req.body
        const updatedBlog = await Blog.findByIdAndUpdate(id,{title,desc},{new:true})
        res.status(200).json(updatedBlog)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router