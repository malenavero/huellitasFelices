// routes/index.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("INDEX.js::: req.session", req.session)
  console.log("INDEX.js::: req.session.usuario", req.session.usuario)

  if (!req.session || !req.session.usuario) {
    return res.redirect("/login");
  }
  res.redirect("/home");
});

module.exports = router;
