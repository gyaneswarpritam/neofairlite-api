const { addMessage, getMessages, getChatUser, checkChatUserExist, getChatVisitors, markMessagesAsRead } = require("../controllers/exhibitorMessageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.get("/getChatUser/:id", getChatUser);
router.get("/getChatVisitors/:id", getChatVisitors);
router.post("/checkChatUserExist/", checkChatUserExist);
router.post("/markMessagesAsRead/", markMessagesAsRead);

module.exports = router;
