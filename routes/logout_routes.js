const express = require("express");
const router = express.Router();

const controller = require("../controllers/logout_controller");

/** 
 * @swagger
 * /logout: 
 *     get:
 *       summary: Renderiza el formulario de inicio de sesión
 *       tags:
 *        - Logout
 *       responses:
 *         200:
 *           description: Sesión cerrada correctamente
 *         500:
 *          description: Error al cerrar sesión
 * 
 * */
router.get("/", controller.logout);

module.exports = router;