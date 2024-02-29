const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title:{
        type:String,
        require:[true,'Title is not Provided']
    },
    author:{
        type:String,
    },
    desc:{
        type:String,
    },
    photo:{
        type:String,
        require:[true,"Image url not provided"]
    },
},
{timestamps:true}
)

module.exports = mongoose.model('Blog',blogSchema)


