import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

import zoom from "./zoom/index.mjs";
import link from "./link/index.mjs";

const app = express();

mongoose.connect("mongodb://localhost/api", {
  useNewUrlParser: true,
});

// Use the json and urlencoded middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/zoom", zoom);
app.use("/api/link", link);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}!`);
});
