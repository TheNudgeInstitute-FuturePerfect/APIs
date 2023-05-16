import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    meetingId: { type: String, required: true },
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model("Meeting", schema);

export default Meeting;
