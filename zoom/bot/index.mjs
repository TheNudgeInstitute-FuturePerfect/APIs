import express from "express";
import Meeting from "./models/meeting.mjs";
import Event from "./models/event.mjs";
import AWS from "aws-sdk";
import { getInstanceIDsByTagName, instancesResponse } from "./aws/ec2.mjs";

const router = express.Router();

// Set your AWS credentials and region
AWS.config.update({
  accessKeyId: process.env.FP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.FP_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create an EC2 instance object
const ec2 = new AWS.EC2();

// create new meeting using meetingId, password
router.post("/meeting/create", async (req, res) => {
  const db = new Meeting({
    meetingId: req.body.meetingId,
    passcode: req.body.passcode,
  });
  try {
    const savedDb = await db.save();
    res.send(savedDb);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get list of all meetings with status filter limit and page
router.get("/meeting/list", async (req, res) => {
  const filter = {};
  let skip, data;
  const { page = 1, limit = 2, status } = req.query;

  if (limit === "none") skip = 0;
  else skip = (page - 1) * limit;

  if (status) filter.status = status;

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
  const db = await Meeting.findById(id);
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
    action: req.body.action,
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

router.get("/aws/ec2/instances", async (req, res) => {
  // get aws ec2 instances by tag name with current state
  const instances = await getInstanceIDsByTagName();
  // format response and send
  res.send(instancesResponse(instances));
});

// set
router.post("/aws/ec2/instances", async (req, res) => {
  const { action, number } = req.body;
  const instances = await getInstanceIDsByTagName();

  // Specify the instance ID of the EC2 instance you want to start
  const instanceIds = instances.map((instance) => instance.id).slice(0, number);

  // Define the parameters for starting the instance
  const params = {
    InstanceIds: instanceIds,
  };
  if (action === "start")
    // Start the EC2 instance
    ec2.startInstances(params, (err, data) => {
      if (err) {
        res.status(500).send({ error: `Error starting the instance: ${err}` });
      } else {
        const instances = [];
        for (const instance of data.StartingInstances) {
          instances.push({
            id: instance.InstanceId,
            state: instance.CurrentState.Name,
          });
        }
        res.status(200).send(instancesResponse(instances));
      }
    });
  if (action === "stop")
    // Stop the EC2 instance
    ec2.stopInstances(params, (err, data) => {
      if (err) {
        res.status(500).send({ error: `Error stopping the instance: ${err}` });
      } else {
        const instances = [];
        for (const instance of data.StoppingInstances) {
          instances.push({
            id: instance.InstanceId,
            state: instance.CurrentState.Name,
          });
        }
        res.status(200).send(instancesResponse(instances));
      }
    });
});

export default router;
