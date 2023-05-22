import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    callId: { type: String, required: true },
    userId: { type: String, required: true },
    leftAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const TelegramVideoChatParticipant = mongoose.model(
  "TelegramVideoChatParticipant",
  schema
);

export default TelegramVideoChatParticipant;
