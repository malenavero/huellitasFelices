// routes/index.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {

  if (!req.session || !req.session.usuario) {
    return res.redirect("/login");
  }
  res.redirect("/home");
});

module.exports = router;
