import express from "express";
import Link from "./models/link.mjs";

const router = express.Router();

// create new link using url
router.post("/create", async (req, res) => {
  const db = new Link({
    url: req.body.url,
  });
  try {
    const savedDb = await db.save();
    res.send({
      shorten: `${process.env.DOMAIN}/api/s/${savedDb._id}`,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// get list of all links with url filter and limit and page
router.get("/list", async (req, res) => {
  const filter = {};
  let skip, data;
  const { page = 1, limit = 2, url } = req.query;

  if (limit === "none") skip = 0;
  else skip = (page - 1) * limit;

  if (url) filter.url = url;
  
  const totalDocuments = await Link.countDocuments(filter);
  const totalPages = limit === "none" ? 1 : Math.ceil(totalDocuments / limit);

  if (limit === "none") data = await Link.find(filter).sort({ _id: -1 });
  else
    data = await Link.find(filter)
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
