import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    callId: { type: String, required: true, index: { unique: true } },
    numberOfparticipants: { type: Number, default: 0 },
    endAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const TelegramVideoChat = mongoose.model("TelegramVideoChat", schema);

export default TelegramVideoChat;
