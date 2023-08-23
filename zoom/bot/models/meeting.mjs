import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    id: {type: String, required: true},
    password: {type: String, required: true},
    datetime: Date,
  }
);

const ZoomBotMeeting = mongoose.model("ZoomBotMeeting", schema);

export default ZoomBotMeeting;
