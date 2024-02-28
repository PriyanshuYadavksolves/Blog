const express = require('express')
require('dotenv').config()
const {connectDB} = require('./db/connectDB')
const cors = require('cors')
const auth = require('./routes/auth')
const user = require('./routes/users')
const superAdmin = require('./routes/super')


const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.json("hello")
})

app.use('/api/auth',auth)
app.use('/api/user',user)
app.use('/api/super',superAdmin)

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