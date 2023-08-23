import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

schema.virtual("shorten").get(function () {
  return `${process.env.DOMAIN}/api/s/${this._id}`;
});

schema.set('toJSON', { virtuals: true });

const ShortenLink = mongoose.model("ShortenLink", schema);

export default ShortenLink;
