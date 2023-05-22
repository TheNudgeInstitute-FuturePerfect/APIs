import express from "express";
import TelegramVideoChat from "./models/telegram-video-chat.mjs";
import TelegramVideoChatParticipant from "./models/telegram-video-chat-participants.mjs";

const router = express.Router();

// receive telegram event
router.post("/event", async (req, res) => {
  const { name, call, participants } = req.body;
  // video call
  if (name === "UpdateGroupCall" && call) {
    // started
    if (
      call.name === "GroupCall" &&
      call.participants_count == 0 &&
      call.version == 1
    ) {
      await TelegramVideoChat.create({ callId: call.id });
    }
  }
  // ended
  if (call && call.name === "GroupCallDiscarded") {
    const telegramVideoChat = await TelegramVideoChat.findOne({
      callId: call.id,
    });
    if (telegramVideoChat) {
      telegramVideoChat.endAt = new Date();
      await telegramVideoChat.save();
      await TelegramVideoChatParticipant.updateMany(
        {
          callId: call.id,
          leftAt: null,
        },
        { leftAt: new Date() }
      );
    }
  }

  // participant
  if (call && name === "UpdateGroupCallParticipants" && participants.length) {
    for (let i = 0; i < participants.length; i++) {
      if (participants[i].peer && participants[i].peer.user_id) {
        if (participants[i].just_joined) {
          console.log("joined");
          // joined
          const telegramVideoChatParticipant =
            await TelegramVideoChatParticipant.create({
              callId: call.id,
              userId: participants[i].peer.user_id,
            });
          console.log(telegramVideoChatParticipant);
        }
        // left
        if (participants[i].left) {
          const telegramVideoChatParticipant =
            await TelegramVideoChatParticipant.findOne({
              callId: call.id,
              userId: participants[i].peer.user_id,
              leftAt: null,
            });
          if (telegramVideoChatParticipant) {
            telegramVideoChatParticipant.leftAt = new Date();
            await telegramVideoChatParticipant.save();
          }
        }
      }
    }
  }
  // console.log(req.body);
  res.json({ success: true });
});

export default router;
