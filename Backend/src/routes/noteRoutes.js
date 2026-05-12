const express = require("express");

const noteController = require("../controllers/noteController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.get("/", noteController.listNotes);
router.post("/", noteController.createNote);
router.patch("/:noteId", noteController.updateNote);
router.delete("/:noteId", noteController.deleteNote);

module.exports = router;
