const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

// Cloudinary configuration -=====
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// ----------------------------====

// Storage configuration to store file in out disk storage in the computer memory.
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadFolder = `${__dirname}/uploads`;
//     if (!fs.existsSync(uploadFolder)) {
//       fs.mkdirSync(uploadFolder);
//     }
//     cb(null, uploadFolder);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
//   },
// });

// Storage configuration to store file in memory in the computer memory for temporary use while we are doing the upload process
const storage = multer.memoryStorage();

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send({ message: "File upload using multer" });
});

app.post("/upload/profile", upload.single("profile"), async (req, res) => {
  try {
    console.log(req.file.buffer);
    const fileBuffer = req.file.buffer;
    // cloudinary upload process

    // ---------- unique public id creation ---------
    const timestamp = new Date().getTime(); // Generate a timestamp
  const uniqueId = Math.floor(Math.random()*100000); // Generate a unique identifier if needed
  const publicId = `image_${timestamp}_${uniqueId}`; // Create a unique public ID

    
    cloudinary.uploader
      .upload_stream(
        {
          public_id: publicId,  // This public_id should be unique each time so that the old image don't get replace with new one in cloudinary media library.
        },
        (err, result) => {
          if (err) throw err;
          console.log(result);
          return res
            .status(201)
            .send({ message: "File uploaded successfully", url: result.url });
        }
      )
      .end(fileBuffer);
  } catch (error) {
    res.json({ message: "Error: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
