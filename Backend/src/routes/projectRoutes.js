const express = require("express");

const projectController = require("../controllers/projectController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", projectController.listProjects);
router.post("/", projectController.createProject);
router.patch("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

module.exports = router;
