const { addMessage, getMessages, getChatUser, checkChatUserExist, markMessagesAsRead } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.get("/getChatUser/:id", getChatUser);
router.post("/checkChatUserExist/", checkChatUserExist);
router.post("/markMessagesAsRead/", markMessagesAsRead);

module.exports = router;
