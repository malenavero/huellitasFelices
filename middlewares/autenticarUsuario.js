
// Middleware para requerir autenticación de usuario
function autenticarUsuario(req, res, next) {
    if (!req.session.usuario) {
      return res.redirect("/login");
    }
    next();
}

module.exports = autenticarUsuario;