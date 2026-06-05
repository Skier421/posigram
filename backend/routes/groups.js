const express = require("express");
const router = express.Router();
const { getGroupById } = require("../controllers/groupController");

router.get("/:id", getGroupById);

module.exports = router;
