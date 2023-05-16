import express from "express";
import KJUR from "jsrsasign";
import Meeting from "./models/meeting.mjs";
import Participant from "./models/participant.mjs";

const router = express.Router();

// send zoom jwt
router.post("/jwt", async (req, res) => {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
    mn: req.body.meetingNumber,
    role: req.body.role,
    iat: iat,
    exp: exp,
    appKey: process.env.ZOOM_MEETING_SDK_KEY,
    tokenExp: iat + 60 * 60 * 2,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.ZOOM_MEETING_SDK_SECRET
  );

  res.json({
    signature: signature,
  });
});

// get meetings
router.get("/meeting", async (req, res) => {
  let filters = {};
  const { page = 1, limit = 2, meetingId } = req.query;
  const skip = (page - 1) * limit;
  const totalDocuments = await Meeting.countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);
  if (meetingId) filters.meetingId = meetingId;
  let data = await Meeting.find(filters).skip(skip).limit(parseInt(limit));
  res.json({ data, currentPage: parseInt(page), totalPages, totalDocuments });
});

// get participants
router.get("/participants", async (req, res) => {
  let filters = {};
  const { page = 1, limit = 2, meetingId, name } = req.query;
  const skip = (page - 1) * limit;
  const totalDocuments = await Participant.countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);
  if (meetingId) filters.meeting = meetingId;
  if (name)
    filters.name = {
      $regex: new RegExp(".*" + name + ".*", "i"),
    };
  let data = await Participant.find(filters).skip(skip).limit(parseInt(limit));
  res.json({ data, currentPage: parseInt(page), totalPages, totalDocuments });
});

// create meeting, participant and update talktime
router.post("/meeting/:meetingId/participant", async (req, res) => {
  // get meeting id, name, talktime
  const meetingId = req.params.meetingId;
  const name = req.body.name;
  const talktime = req.body.talktime;
  // find meeting
  let meeting = await Meeting.findOne({ meetingId: meetingId });
  // create meeting if not found
  if (meeting === null) {
    meeting = await Meeting.create({
      meetingId: id,
    });
  }
  // find participant
  let participant = await Participant.findOne({
    meeting: meeting._id,
    name: name,
  });
  // update talktime
  if (participant) {
    participant.talktime = participant.talktime + talktime;
    await participant.save();
  } else {
    // create participant if not found
    participant = await Participant.create({
      meeting: id,
      name: name,
      talktime: talktime,
    });
  }
  // send response
  res.json({ participant });
});

export default router;
