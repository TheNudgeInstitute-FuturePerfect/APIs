import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/feedback", async (req, res) => {
  log("GET request received at api glow feedback url");
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

export default router;
