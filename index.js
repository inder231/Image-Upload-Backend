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
    cloudinary.uploader
      .upload_stream(
        {
          public_id: "profile-picture",
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
