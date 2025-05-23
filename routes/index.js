// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Huellitas Felices',
    productosUrl: '/productos',
    pacientesUrl: '/pacientes',
    turnosUrl: '/turnos',
    busquedasUrl: '/busquedas'
  });
});

module.exports = router;
