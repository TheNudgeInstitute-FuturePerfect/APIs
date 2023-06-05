import express from "express";
import axios from "axios";
import GlowLinkTracking from "./models/link.mjs";

const router = express.Router();

router.get("/feedback", async (req, res) => {
  log("GET Glow Feedback");
  const { action, table, condition } = req.query;
  if (action && table && condition) {
    try {
      const data = await axios.get(
        `${process.env.DATA_CATALYST_URL}/data?action=${action}&table=${table}&condition=${condition}`
      );
      log("Catalyst Response", data.data.length);
      res.json({ data: data.data });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
});

router.post("/feedback", async (req, res) => {
  log("POST request received at api glow feedback url");
  const { action } = req.query;
  log("action", action);
  if (action === "update") {
    axios
      .post(`${process.env.DATA_CATALYST_URL}/data?action=${action}`, req.body)
      .then((response) => {
        res.json({ ...response.data });
      })
      .catch((error) => {
        console.error(error.response.data);
        res.status(500).send("Internal server error");
      });
  }
});

router.post("/link/tracking", async (req, res) => {
  log("POST Glow Link Tracking", req.body.phone, req.body.session);
  const { phone, session } = req.body;
  if (phone && session) {
    const glowLinkTracking = await GlowLinkTracking.create({
      phone: phone,
      session: session,
    });
    res.send({ glowLinkTracking });
  } else {
    res.status(400).send("Bad Request");
  }
});

router.get("/link/tracking", async (req, res) => {
  const filter = {};
  const {
    page = 1,
    limit = 50,
    phone,
    session,
    startDate,
    endDate,
  } = req.query;
  const skip = (page - 1) * limit;

  if (phone) filter.phone = phone;
  if (session) filter.session = session;
  if (startDate) {
    filter.createdAt = { $gte: startDate };
  }
  if (endDate) filter.createdAt = { ...filter.createdAt, $lte: endDate };

  const totalDocuments = await GlowLinkTracking.countDocuments(filter);
  const totalPages = Math.ceil(totalDocuments / limit);

  const data = await GlowLinkTracking.find(filter)
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
