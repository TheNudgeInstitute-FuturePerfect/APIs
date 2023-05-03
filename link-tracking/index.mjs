import express from "express";
import DB from "./db.mjs";

const router = express.Router();

router.post("/create-link", async (req, res) => {
  const db = new DB({
    name: req.body.name,
    phone: req.body.phone,
    url: req.body.url,
  });
  try {
    const savedDb = await db.save();
    res.send({
      url: `${process.env.LT_APP_URL}/lt/${savedDb._id}`,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/list", async (req, res) => {
  const filter = {};
  const { page = 1, limit = 2, status, phone } = req.query;
  const skip = (page - 1) * limit;
  const totalDocuments = await DB.countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);

  if (status) filter.status = status;
  if (phone) filter.phone = phone;

  const data = await DB.find(filter).skip(skip).limit(parseInt(limit));

  res.json({
    data,
    currentPage: parseInt(page),
    totalPages,
    totalDocuments,
  });
});

router.get("/:id", async (req, res) => {
  const db = await DB.findById(req.params.id);
  db.status = "opened";
  await db.save();
  res.redirect(301, db.url);
});

export default router;
