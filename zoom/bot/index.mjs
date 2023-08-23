import express from "express";
import Meeting from "./models/meeting.mjs";

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
  const {
    page = 1,
    limit = 2,
    datetime,
  } = req.query;

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

export default router;
