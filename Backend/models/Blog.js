const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    userId: { type: String, required: true }, // Store user IDs who liked the post
    username: {
      type: String,
      require: true,
    },
    userPic:{
      type:String,
      require:true,
  },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store user IDs who liked the post
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", blogPostSchema);
