import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

async function downloadS3File(bucketName, bucketKey) {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  const data = await s3Client.send(
    new GetObjectCommand({ Bucket: bucketName, Key: bucketKey })
  );

  // Helper function to convert a ReadableStream to a string
  const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => {
        const data = Buffer.concat(chunks).toString("utf8");
        console.log(data);
        resolve(JSON.parse(data).results.items);
      });
    });

  return await streamToString(data.Body);
}

export default downloadS3File;
