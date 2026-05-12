const express = require("express");
const multer = require("multer");

const sourceController = require("../controllers/sourceController");
const authMiddleware = require("../utils/authMiddleware");
const { createError } = require("../utils/errorHandler");
const parserService = require("../services/parserService");

const router = express.Router({ mergeParams: true });
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (!parserService.isSupportedFile(file)) {
      callback(createError("Unsupported source file type", 400));
      return;
    }

    callback(null, true);
  },
});

router.use(authMiddleware);

router.get("/", sourceController.listSources);
router.post("/", upload.single("file"), sourceController.createSource);
router.delete("/:sourceId", sourceController.deleteSource);

module.exports = router;
