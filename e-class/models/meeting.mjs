import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    meetingId: String,
    name: String,
    talktime: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model("Meeting", schema);

export default Meeting;
