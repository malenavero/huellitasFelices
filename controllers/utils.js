function returnJSON(req) {
    const accept = req.headers.accept || '';
    return (
      !accept ||
      accept === '*/*' ||
      accept.includes('application/json') ||
      req.query.format === 'json'
    );
  }

function handleError(req, res, status, message = '') {
  if (returnJSON(req)) {
    return res.status(status).json({ error: message });
  } else {
    return res.status(status).render(`errors/${status}`, { mensaje: message });
  }
}

const urls = {
  productosUrl: '/productos',
  pacientesUrl: '/pacientes',
  turnosUrl: '/turnos',
  busquedasUrl: '/busquedas',
  documentacionUrl: '/documentacion'
}

module.exports = {
    returnJSON,
    handleError,
    urls
}