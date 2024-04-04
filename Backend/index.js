const express = require("express");
const cors = require("cors");
const multer = require("multer");
const AWS = require('aws-sdk');
const cheerio = require('cheerio');
require("dotenv").config();
// const path = require("path");
// const fs = require('fs')
const Blog = require('./models/Blog')

const app = express();


app.use(cors({
  origin: '*', // Replace this with the origin of your frontend
}))
app.use(express.json());
// app.use("/images", express.static(path.join(__dirname, "/images")));

// const fileUpload = require('express-fileupload')

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const superAdmin = require('./routes/super')
const commentRoute = require('./routes/comment')
const blogRoute = require('./routes/blog')
const {connectDB} = require('./db/connectDB');
const verifyToken = require("./middleware/varifyToken");




AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const s3 = new AWS.S3();

app.post('/api/upload-images',verifyToken, async (req, res) => {
  try {
    // console.log(req.body)

    let { username,title,content,userPic } = req.body;
    // content = JSON.stringify(content)

    const $ = cheerio.load(""+content);
    const images = $('img');

    for (const i of images) { 
      const imageUrl = $(i).attr('src');

      if (imageUrl.startsWith('data:image/')) {
        try {
          // Extract data and content type
          const base64Data = imageUrl.split(',')[1];
          const contentType = imageUrl.split(',')[0].split('/')[1];

          // Generate a unique filename
          const filename = `temp-${Math.random().toString(36).substring(2, 15)}`;

          // Option 1: Upload directly to S3 (avoid temporary files)
          const uploadParams = {
            Bucket: process.env.S3_BUCKET,
            Key: filename, // Use a unique filename
            Body: Buffer.from(base64Data, 'base64'),
            ContentType: contentType,
            // ACL: 'public-read', // Make image publicly accessible (optional)
          };
          const uploadResult = await s3.upload(uploadParams).promise();
          const s3Url = uploadResult.Location;

          // Update image URL with S3 link
          $(i).attr('src', s3Url);

        } catch (error) {
          console.error(`Error uploading image ${imageUrl}:`, error);
          // Handle specific errors (e.g., invalid base64 data)
        }
      } else {
        // Handle external URLs (if needed)
        console.log("not file format")
      }
    }

    const updatedContent = $.html();
    const blog = await Blog.create({
      title,
      htmlContent : updatedContent,
      userId:req.userId,
      username,
      userPic,
    })
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).send('Error processing images');
  }
});

app.post('/api/delete-images', async (req, res) => {
  const { content,id } = req.body;

  // Validate input (optional)
  if (!content) {
    return res.status(400).json({ message: 'Missing content' });
  }

  const $ = cheerio.load(content);
  const imageUrls = $('img').map((i, element) => $(element).attr('src')).get();

  const deletePromises = imageUrls.map(async imageUrl => {
    const filename = imageUrl.split('/').pop();
    const params = {
      Bucket: process.env.S3_BUCKET, // Replace with your bucket name
      Key: filename,
    };

    try {
      await s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  });

  await Promise.all(deletePromises);

  const data = await Blog.findByIdAndDelete(id)
  console.log(data) 

  res.json({ message: 'Image deletion initiated (asynchronous)' });
});


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/blogs", blogRoute);
app.use('/api/super',superAdmin)
app.use('/api/comment',commentRoute)


const main = async() => {
  try {
      await connectDB(process.env.MONGO_URI)
      app.listen(5000, () => {
        console.log("listen on 5000.");
      });
  } catch (error) {
    console.log(error)
  }
}

main()

