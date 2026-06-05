const express = require("express");
const router = express.Router();
const {
  getTodayChallenge,
  completeChallenge,
} = require("../controllers/challengeController");

router.get("/today", getTodayChallenge);
router.post("/complete", completeChallenge);

module.exports = router;
