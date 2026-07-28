const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/file.middleware");
const { rewriteResumeController } = require("../controllers/resume.controller");

const resumeRouter = express.Router();

// POST /api/resume/rewrite
// Auth protected + PDF upload
resumeRouter.post(
    "/rewrite",
    authMiddleware.authUser,
    upload.single("resume"),
    rewriteResumeController
);

module.exports = resumeRouter;
