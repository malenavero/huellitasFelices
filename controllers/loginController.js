const Usuario = require('../models/Usuario');
const { comparePassword, returnJSON, handleError } = require('./utils.js');

module.exports = {
  async login(req, res) {
    try {
      const password = req.body.password.trim();
      const correo = req.body.correo.trim();

      const usuario = await Usuario.findByEmail(correo);

      if (!usuario) {
        return handleError(req, res, 401, 'Credenciales inválidas');
      }
     
      const passwordValido = await comparePassword(password, usuario.password);
      if (!passwordValido) {
        return handleError(req, res, 401, 'Credenciales inválidas');
      }

      if (returnJSON(req)) {
        return res.status(200).json(usuario);
      }

      return res.status(200).redirect('/home');
    } catch (error) {
      console.error(error);
      handleError(req, res, 500, 'Error al iniciar sesión');
    }
  }
};
