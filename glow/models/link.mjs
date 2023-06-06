import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    phone: { type: String, required: true },
    session: { type: String, required: true },
    activity: {
      type: String,
      enum: ["Page Opened", "Feedback Expanded"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GlowLinkTracking = mongoose.model("GlowLinkTracking", schema);

export default GlowLinkTracking;
