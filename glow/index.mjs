import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/feedback", async (req, res) => {
  let data = { data: [] };
  const { action, table, condition } = req.query;
  if (action && table && condition) {
    try {
      data = await axios.get(
        `${process.env.DATA_CATALYST_URL}/data?action=${action}&table=${table}&condition=${condition}`
      );
    } catch (error) {
      console.error(error.response.data);
    }
  }
  res.json({ data: data.data });
});

export default router;
