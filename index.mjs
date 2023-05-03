import dotenv from "dotenv";
dotenv.config();

import zoom from "./zoom/index.mjs";
import express from "express";

const app = express();

// Use the json and urlencoded middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/zoom", zoom);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
