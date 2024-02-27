const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username : {
    type:String,
    required:[true,'username is not provided'],
    trim:true
  },
  email:{
    type:String,
    required:[true,'email is not provided'],
    unique:[true,'email already exist'],
    trim:true
  },
  password:{
    type:String,
    require:[true,"password is not provided"],
  },
  profilePic:{
    type:String,
    default:"",
  },
  isAdmin:{
    type:Boolean,
    default:false,
  },
  isSuperAdmin:{
    type:Boolean,
    default:false,
  }
})

module.exports = mongoose.model('User',userSchema);