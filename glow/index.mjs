import express from "express";
import axios from "axios";
import GlowLinkTracking from "./models/link.mjs";
import { isValidObjectId } from "mongoose";

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
