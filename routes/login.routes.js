//routes/login

const express = require('express');
const router = express.Router();

const controller = require('../controllers/loginController');
const { validarLogin } = require('../middlewares/validacionesUsuarios');

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Renderiza el formulario de inicio de sesión
 *     tags:
 *       - Login
 *     responses:
 *       200:
 *         description: Formulario HTML de login
 */
router.get('/', (req, res) => {
  res.render('login');
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión con credenciales de usuario
 *     tags:
 *       - Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - password
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/', validarLogin, controller.login);

module.exports = router;
