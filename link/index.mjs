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
  let skip, data;
  const {
    page = 1,
    limit = 2,
    name,
    status,
    phone,
    url,
    startDate,
    endDate,
  } = req.query;

  if (limit === "none") skip = 0;
  else skip = (page - 1) * limit;

  if (status) filter.status = status;
  if (url) filter.url = url;
  if (phone) filter.phone = { $in: phone.split(",") };
  if (name) filter.name = { $regex: new RegExp(".*" + name + ".*", "i") };
  if (startDate) {
    filter.createdAt = { $gte: startDate };
  }
  if (endDate) filter.createdAt = { ...filter.createdAt, $lte: endDate };

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

// update link status
router.get("/:id", async (req, res) => {
  const db = await Link.findById(req.params.id);
  if (db) {
    db.status = "opened";
    await db.save();
    res.redirect(301, db.url);
  } else {
    res.set("Content-Type", "text/html");
    res.send(
      Buffer.from(
        `<h2 style="text-align: center; margin-top: 5%">Link doesn't exist</h2>`
      )
    );
  }
});

export default router;
