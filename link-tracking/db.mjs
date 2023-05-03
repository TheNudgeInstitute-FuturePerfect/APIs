import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: String,
    phone: String,
    url: String,
    status: {
      type: String,
      enum: ["opened", "not_opened"],
      default: "not_opened",
    },
  },
  {
    timestamps: true,
  }
);

const DB = mongoose.model("DB", schema);

export default DB;
