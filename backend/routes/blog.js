const router = require('express').Router()
const User = require('../models/User')
const Blog = require('../models/Blog')

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

router.post('/createBlog',async(req,res)=>{
    try {
        const {title,author,desc,photo} = req.body
        const blog = await Blog.create({title,author,desc,photo})
        res.status(200).json(blog)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/deleteBlog/:id',async(req,res)=>{
    try {
        const {id} = req.params
        const blog = await Blog.findByIdAndDelete(id)
        res.status(200).json(blog)
    } catch (error) {
        console.log(error)
    }
}) 

module.exports = router