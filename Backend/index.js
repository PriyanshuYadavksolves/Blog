const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fileUpload = require('express-fileupload')

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const superAdmin = require('./routes/super')
const {connectDB} = require('./db/connectDB')

const app = express();

app.use(cors({
  origin: '*', // Replace this with the origin of your frontend
}))
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
}));

app.post("/api/upload", (req, res) => {
  clg(req)
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use('/api/super',superAdmin)


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

