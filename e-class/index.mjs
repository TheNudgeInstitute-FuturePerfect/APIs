import express from "express";
import KJUR from "jsrsasign";
import Meeting from "./models/meeting.mjs";

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

router.post("/meeting/update", async (req, res) => {
  const name = req.body.name;
  const meetingId = req.body.meetingId;
  const talktime = req.body.talktime;
  let meeting = await Meeting.findOne({ meetingId: meetingId, name: name });
  if (meeting) {
    meeting.talktime = meeting.talktime + talktime;
    await meeting.save();
  } else {
    meeting = await Meeting.create({
      meetingId: meetingId,
      name: name,
      talktime: talktime,
    });
  }
  res.json({ meeting });
});
export default router;
