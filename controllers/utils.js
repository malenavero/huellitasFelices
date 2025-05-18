function returnJSON(req) {
    const accept = req.headers.accept || '';
    return (
      !accept ||
      accept === '*/*' ||
      accept.includes('application/json') ||
      req.query.format === 'json'
    );
  }


module.exports = {
    returnJSON
}