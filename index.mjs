import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import eclass from "./e-class/index.mjs";
import link from "./link/index.mjs";
import talknote from "./talk-note/index.mjs";
import telegramclient from "./telegram-client/index.mjs";

const app = express();

mongoose.connect("mongodb://localhost/api", {
  useNewUrlParser: true,
});

// Use the json and urlencoded middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api/e-class", eclass);
app.use("/api/link", link);
app.use("/api/talk-note", talknote);
app.use("/api/telegram-client", telegramclient);

app.listen(process.env.API_PORT, () => {
  console.log(`API listening on port ${process.env.API_PORT}!`);
});
