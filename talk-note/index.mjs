import express from "express";
import uploadImage from "./uploadFile.mjs";
import transcribe from "./transcribe.mjs";
import downloadS3File from "./downloadS3File.mjs";

const router = express.Router();

router.post(
  "/upload",
  uploadImage.single("audiofile"),
  async (req, res, next) => {
    let data = {};
    if (req.file) {
      const mediaUri = req.file.location;
      console.log(req.file);
      const transcribeJobName = `${new Date().getTime()}`;
      const bucketName = process.env.AWS_BUCKET_NAME;
      const bucketKey = `talk-note/transcript/${new Date().getTime()}.json`;

      data.image = req.file.location;

      const mediaFormat = req.file.location.split(".").at(-1);

      // transcribe
      const transcriptionJob = await transcribe(
        transcribeJobName,
        decodeURIComponent(mediaUri),
        bucketName,
        bucketKey,
        mediaFormat
      );
      // download transcribe file
      const subtitles = await downloadS3File(bucketName, bucketKey);

      res.send({ msg: "Successfully uploaded ", data: subtitles });
    }

    // HERE IS YOUR LOGIC TO UPDATE THE DATA IN DATABASE
  }
);

export default router;
