import express from "express";
import Meeting from "./models/meeting.mjs";
import Event from "./models/event.mjs";

const router = express.Router();

// create new meeting using id, password and datetime
router.post("/meeting/create", async (req, res) => {
  const db = new Meeting({
    id: req.body.id,
    password: req.body.password,
    datetime: req.body.datetime,
  });
  try {
    const savedDb = await db.save();
    res.send(savedDb);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get list of all meetings with datetime filter and limit and page
router.get("/meeting/list", async (req, res) => {
  const filter = {};
  let skip, data;
  const { page = 1, limit = 2, datetime } = req.query;

  if (limit === "none") skip = 0;
  else skip = (page - 1) * limit;

  if (datetime) {
    filter.datetime = { $gte: datetime };
  }

  const totalDocuments = await Meeting.countDocuments(filter);
  const totalPages = limit === "none" ? 1 : Math.ceil(totalDocuments / limit);

  if (limit === "none") data = await Meeting.find(filter).sort({ _id: -1 });
  else
    data = await Meeting.find(filter)
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

// update meeting status
router.post("/meeting/update", async (req, res) => {
  const { id, status } = req.body;
  const db = await Event.findById(id);
  if (db) {
    db.status = status;
    await db.save();
    res.send(db);
  } else {
    res.status(404).send({ error: "meeting not found" });
  }
});

// create new event using name
router.post("/event/create", async (req, res) => {
  const db = new Event({
    name: req.body.name,
  });
  try {
    const savedDb = await db.save();
    res.send(savedDb);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get list of all events with status filter and limit and page
router.get("/event/list", async (req, res) => {
  const filter = {};
  let skip, data;
  const { page = 1, limit = 2, status } = req.query;

  if (limit === "none") skip = 0;
  else skip = (page - 1) * limit;

  if (status) filter.status = status;

  const totalDocuments = await Event.countDocuments(filter);
  const totalPages = limit === "none" ? 1 : Math.ceil(totalDocuments / limit);

  if (limit === "none") data = await Event.find(filter).sort({ _id: -1 });
  else
    data = await Event.find(filter)
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

// update event status
router.post("/event/update", async (req, res) => {
  const { id, status } = req.body;
  const db = await Event.findById(id);
  if (db) {
    db.status = status;
    await db.save();
    res.send(db);
  } else {
    res.status(404).send({ error: "event not found" });
  }
});

export default router;
