const router = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')
const bcrypt = require('bcrypt')

router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        const { username, password } = req.body
        const salt = 10;
        const hashPass = await bcrypt.hash(password, salt)
        const updatedUser = await User.findByIdAndUpdate(id, { username: username, password: hashPass })
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        await User.findByIdAndDelete(id);
        onsole.log(user.username)
        res.status(200).json({msg:"user deleted"})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router