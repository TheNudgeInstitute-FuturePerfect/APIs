import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  action: { type: String, required: true },
  status: {
    type: String,
    enum: ["new", "handled"],
    default: "new",
  },
});

const ZoomBotEvent = mongoose.model("ZoomBotEvent", schema);

export default ZoomBotEvent;
