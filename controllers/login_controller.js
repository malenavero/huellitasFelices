const UsuariosService = require("../services/usuarios_service.js");
const { comparePassword, returnJSON, handleError } = require("./utils.js");

module.exports = {
  async login(req, res) {
    try {
      const { email = "", password = "" } = req.body;

      if (!email.trim() || !password.trim()) {
        return handleError(req, res, 400, "Correo y contraseña son requeridos");
      }

      const usuario = await UsuariosService.findOneByQuery({
        email: email.trim(),
      });


      if (!usuario) {
        return handleError(req, res, 401, "Credenciales inválidas");
      }

      const passwordValido = await comparePassword(password, usuario.password);

      if (!passwordValido) {
        return handleError(req, res, 401, "Credenciales inválidas");
      }

      req.session.usuario = {
        id: usuario._id,
        nombre:`${usuario.nombre} ${usuario.apellido}`,
        email: usuario.email,
        rol: usuario.rol,
        ultimoAcceso: new Date(),
      };
     
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
