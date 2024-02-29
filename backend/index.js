const express = require('express')
require('dotenv').config()
const {connectDB} = require('./db/connectDB')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const auth = require('./routes/auth')
const user = require('./routes/users')
const superAdmin = require('./routes/super')
const blog = require('./routes/blog')

const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
  }));

app.get('/',(req,res)=>{
    res.json("hello")
})

app.use('/api/auth',auth)
app.use('/api/user',user)
app.use('/api/super',superAdmin)
app.use('/api/blog',blog)

const main = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(8000,()=>{
            console.log("connected")
        })
    } catch (error) {
        console.log(error)
    }
}

main()