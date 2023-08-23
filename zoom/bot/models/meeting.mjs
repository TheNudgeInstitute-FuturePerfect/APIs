import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    id: String,
    password: String,
    datetime: Date,
  }
);

const ZoomBotMeeting = mongoose.model("ZoomBotMeeting", schema);

export default ZoomBotMeeting;
