const express = require("express");

const messageController = require("../controllers/messageController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.get("/", messageController.getMessages);
router.post("/", messageController.sendMessage);

module.exports = router;
