const { returnJSON } = require('../controllers/utils.js');

// verifica si el usuario tiene uno de los roles permitidos para acceder a una ruta
function autorizarRol(...rolesPermitidos) {
  return (req, res, next) => {
    const userRol = req.user?.rol || '';
    const autorizado = rolesPermitidos.includes(userRol);

    if (!autorizado) {
      if (returnJSON(req)) {
        return res.status(403).json({ error: 'Acceso denegado' });
      } else {
        return res
          .status(403)
          .render('errors/403', { mensaje: 'Acceso denegado' });
      }
    }

    next();
  };
}

module.exports = autorizarRol;