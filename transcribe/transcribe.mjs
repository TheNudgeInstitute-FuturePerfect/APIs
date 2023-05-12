import {
  GetTranscriptionJobCommand,
  StartTranscriptionJobCommand,
  TranscribeClient,
} from "@aws-sdk/client-transcribe";
import promiseRetry from "promise-retry";
console.log("transcribe", process.env.AWS_REGION);
async function transcribe(
  jobName,
  mediaUri,
  bucketName,
  bucketKey,
  mediaFormat
) {
  const transcribeClient = new TranscribeClient({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  // [amr, flac, wav, ogg, mp3, mp4, webm]
  await transcribeClient.send(
    new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      LanguageCode: "en-US",
      MediaFormat: mediaFormat,
      Media: { MediaFileUri: mediaUri },
      OutputBucketName: bucketName,
      OutputKey: bucketKey,
      Type: "CONVERSATION",
      Settings: {
        MaxSpeakerLabels: 3,
        ShowSpeakerLabels: true,
      },
    })
  );

  const command = new GetTranscriptionJobCommand({
    TranscriptionJobName: jobName,
  });

  return promiseRetry(
    async (retry) => {
      const response = await transcribeClient.send(command);

      if (response.TranscriptionJob?.TranscriptionJobStatus !== "COMPLETED") {
        return retry(null);
      }

      return response.TranscriptionJob;
    },
    { minTimeout: 2000, forever: true }
  );
}
export default transcribe;
