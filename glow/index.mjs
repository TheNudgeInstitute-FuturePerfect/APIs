import express from "express";
import axios from "axios";
import GlowLinkTracking from "./models/link.mjs";
import { isValidObjectId } from "mongoose";
import { client, connectToDatabase } from "./db.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/feedback", async (req, res) => {
  log("GET Glow Feedback");
  const { collection, SessionID, ROWID } = req.query;
  connectToDatabase()
    .then(() => {
      const db = client.db("whatsapp-bots");
      const _collection = db.collection(collection);
      if (collection === "sessions")
        _collection
          .find({ SessionID, MessageType: "UserMessage" })
          .sort({ CREATEDTIME: 1 })
          .toArray()
          .then((data) => res.json({ data }))
          .catch((error) => res.status(500).send("Internal server error"));
      else
        _collection
          .find({ _id: new ObjectId(ROWID) })
          .toArray()
          .then((data) => res.json({ data }))
          .catch((error) => res.status(500).send("Internal server error"));
    })
    .catch((err) => {
      console.error("Error connecting to the database:", err);
      res.status(500).send("Internal server error");
    });
});

router.post("/feedback", async (req, res) => {
  log("POST request received at api glow feedback url");
  const { collection, set, ROWID } = req.body;

  connectToDatabase().then(() => {
    const db = client.db("whatsapp-bots");
    const _collection = db.collection(collection);
    _collection
      .findOneAndUpdate(
        { _id: new ObjectId(ROWID) },
        { $set: set },
        {
          new: true,
          runValidators: true,
        }
      )
      .then((data) => res.json({ data }));
    // .catch((error) => res.status(500).send(error));
  });
  // .catch((err) => {
  //   console.error("Error connecting to the database:", err);
  //   res.status(500).send(err);
  // });
});

router.post("/link/tracking", async (req, res) => {
  log("POST Glow Link Tracking", req.body.phone, req.body.session);
  const { phone, session, activity } = req.body;
  if (phone && session) {
    const glowLinkTracking = await GlowLinkTracking.create({
      phone: phone,
      session: session,
      activity: activity,
    });
    res.send({ glowLinkTracking });
  } else {
    res.status(400).send("Bad Request");
  }
});

router.get("/link/tracking", async (req, res) => {
  const filter = {};
  let skip, data;
  const {
    page = 1,
    limit = 50,
    phone,
    session,
    startDate,
    endDate,
  } = req.query;

  if (limit === "none") skip = 0;
  else skip = (page - 1) * limit;

  if (phone) filter.phone = phone;
  if (session) filter.session = session;
  if (startDate) {
    filter.createdAt = { $gte: startDate };
  }
  if (endDate) filter.createdAt = { ...filter.createdAt, $lte: endDate };

  const totalDocuments = await GlowLinkTracking.countDocuments(filter);
  const totalPages = limit === "none" ? 1 : Math.ceil(totalDocuments / limit);
  if (limit === "none")
    data = await GlowLinkTracking.find(filter).sort({ _id: -1 });
  else
    data = await GlowLinkTracking.find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(parseInt(limit));

  res.json({
    data,
    currentPage: parseInt(page),
    totalPages,
    totalDocuments,
  });
});

router.delete("/link/tracking/:id", async (req, res) => {
  if (isValidObjectId(req.params.id) === false)
    res.send({ error: "Invalid Object ID" });
  if (isValidObjectId(req.params.id))
    res.send(await GlowLinkTracking.findByIdAndDelete(req.params.id));
});

export default router;
