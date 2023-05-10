import express from "express";
import Link from "./models/link.mjs";

const router = express.Router();

// create new link using name, phone and url
router.post("/create", async (req, res) => {
  const db = new Link({
    name: req.body.name,
    phone: req.body.phone,
    url: req.body.url,
  });
  try {
    const savedDb = await db.save();
    res.send({
      url: `${process.env.DOMAIN}/api/link/${savedDb._id}`,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// get list of all links with status and phone filter and limit and page
router.get("/list", async (req, res) => {
  const filter = {};
  const { page = 1, limit = 2, status, phone } = req.query;
  const skip = (page - 1) * limit;
  const totalDocuments = await Link.countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);

  if (status) filter.status = status;
  if (phone) filter.phone = phone;

  const data = await Link.find(filter).skip(skip).limit(parseInt(limit));

  res.json({
    data,
    currentPage: parseInt(page),
    totalPages,
    totalDocuments,
  });
});

// update link status
router.get("/:id", async (req, res) => {
  const db = await Link.findById(req.params.id);
  db.status = "opened";
  await db.save();
  res.redirect(301, db.url);
});

export default router;
