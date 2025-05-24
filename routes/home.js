// routes/home.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Huellitas Felices',
    productosUrl: '/productos',
    pacientesUrl: '/pacientes',
    turnosUrl: '/turnos',
    busquedasUrl: '/busquedas',
    usuariosUrl: '/usuarios',
  });
});

module.exports = router;
