const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuarios_controller.js");
const autorizarRol  = require("../middlewares/autorizarRol");
const { ROLES } = require("../utils/constants.js");
const {
  validarUsuarioCreate,
  validarUsuarioUpdate
} = require("../middlewares/validaciones_usuarios.js");

// Middleware para autorizar acceso a rutas de usuarios
router.use(autorizarRol("admin"));

/**
 * @swagger
 * /usuarios/crear:
 *   get:
 *     summary: Renderiza el formulario de creación de usuarios
 *     tags:
 *       - Usuarios (Vistas)
 *     responses:
 *       200:
 *         description: Formulario HTML de creación
 */
router.get("/crear", (req, res) => {
  res.render("usuarios/form", {
    modo: "crear",
    usuario: {},
    roles: ROLES,
    errores: []
  });
});

/**
 * @swagger
 * /usuarios/{id}/editar:
 *   get:
 *     summary: Renderiza el formulario de edición para un usuario
 *     tags:
 *       - Usuarios (Vistas)
 *     responses:
 *       200:
 *         description: Formulario HTML de edición
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id/editar", controller.formEditar);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get("/", controller.listar);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.get("/:id", controller.detalle);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       409:
 *         description: El correo ya está en uso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El correo ya está en uso
 *       500:
 *         description: Error interno al crear el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al crear el usuario
 */
router.post("/", validarUsuarioCreate, controller.crear);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioUpdateInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/:id", validarUsuarioUpdate, controller.actualizar);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       204:
 *         description: Usuario eliminado exitosamente (sin contenido)
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", controller.eliminar);



module.exports = router;