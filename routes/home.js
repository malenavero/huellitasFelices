// routes/home.js
const express = require("express");
const router = express.Router();
const { urls} = require("../controllers/utils.js");


router.get("/", (req, res) => {
  res.render("home", {
    title: "Huellitas Felices",
    ...urls
  });
});

module.exports = router;
