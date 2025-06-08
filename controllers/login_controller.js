const UsuariosService = require("../services/usuarios_service.js");
const { comparePassword, returnJSON, handleError } = require("./utils.js");

module.exports = {
  async login(req, res) {
    try {
      const { correo = "", password = "" } = req.body;

      if (!correo.trim() || !password.trim()) {
        return handleError(req, res, 400, "Correo y contraseña son requeridos");
      }

      const usuario = await UsuariosService.findOneByQuery({ correo: correo.trim() });

      if (!usuario) {
        return handleError(req, res, 401, "Credenciales inválidas");
      }
     
      const passwordValido = await comparePassword(password, usuario.password);
      if (!passwordValido) {
        return handleError(req, res, 401, "Credenciales inválidas");
      }

      if (returnJSON(req)) {
        return res.status(200).json(usuario);
      }

      return res.status(200).redirect("/home");
    } catch (error) {
      console.error(error);
      handleError(req, res, 500, "Error al iniciar sesión");
    }
  }
};
