const express = require('express');
const router = express.Router();


// Swagger documentación endpoints
router.get('/', (req, res) => {
  res.redirect('/docs');
});


module.exports = router;


