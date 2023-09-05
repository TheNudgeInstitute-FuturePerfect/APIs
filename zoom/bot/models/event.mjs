import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  action: { type: String, required: true },
  handledBy: [{ type: String, required: true }],
});

const ZoomBotEvent = mongoose.model("ZoomBotEvent", schema);

export default ZoomBotEvent;
