import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    meeting: { type: mongoose.Types.ObjectId, ref: "Meeting", required: true },
    name: { type: String, required: true },
    talktime: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Participant = mongoose.model("Participant", schema);

export default Participant;
