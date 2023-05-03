import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

import zoom from "./zoom/index.mjs";
import linkTracking from "./link-tracking/index.mjs";

const app = express();

mongoose.connect("mongodb://localhost/link-tracking", {
  useNewUrlParser: true,
});

// Use the json and urlencoded middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/zoom", zoom);
app.use("/lt/", linkTracking);

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});
