  function getNewId(data) {
    return data.length > 0 ? data[data.length - 1].id + 1 : 1;
  }

  function parseBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
    }
    return null;
}

module.exports = {
    parseBoolean,
    getNewId    
}