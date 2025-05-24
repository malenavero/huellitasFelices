// routes/index.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/login");
});

module.exports = router;
