import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";

// create s3 instance using S3Client
// (this is how we create s3 instance in v3)
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: process.env.AWS_BUCKET_NAME, // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName = Date.now();
    const ext = path.extname(file.originalname.toLowerCase());
    cb(null, "talk-note/upload/" + fileName + ext);
  },
});

function sanitizeFile(file, cb) {
  // Define the allowed extension
  const fileExts = [".mp3", ".mp4"];

  // Check allowed extensions
  const isAllowedExt = fileExts.includes(
    path.extname(file.originalname.toLowerCase())
  );

  // Mime type must be an image
  const isAllowedMimeType = file.mimetype.startsWith("audio/");

  const isAllowedMimeType_Video = file.mimetype.startsWith("video/");

  if (isAllowedExt && (isAllowedMimeType || isAllowedMimeType_Video)) {
    return cb(null, true); // no errors
  } else {
    // pass error msg to callback, which can be displaye in frontend
    cb(`${file.originalname.split(".").at(-1)} not supported!`);
  }
}

// our middleware
const uploadImage = multer({
  storage: s3Storage,
  fileFilter: (req, file, callback) => {
    sanitizeFile(file, callback);
  },
  limits: {
    fileSize: 1024 * 1024 * 500, // 500mb file size
  },
});

export default uploadImage;
