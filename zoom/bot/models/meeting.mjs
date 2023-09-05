import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    meetingId: {type: String, required: true},
    passcode: {type: String, required: true},
    status: {
      type: String,
      enum: ["schedule", "joined"],
      default: "schedule",
    },
  }
);

const ZoomBotMeeting = mongoose.model("ZoomBotMeeting", schema);

export default ZoomBotMeeting;
