const Busqueda = require('../models/Busqueda');
const { ANIMALES_VALIDOS, TIPOS_BUSQUEDA } = require('../utils/constants.js');
const { returnJSON, handleError, urls } = require('./utils.js');

async function getListParams(query = {}) {
  const busquedas = await Busqueda.findAll(query);
  return {
    busquedas,
    nombreSeleccionado: query.nombre || '',
    tipoSeleccionado: query.tipo || '',
    animalSeleccionado: query.animal || '',
    activaSeleccionado: query.activa || '',
    ...urls
  };
}

async function renderListView(res, status = 200, query = {}) {
  const params = await getListParams(query);
  return res.status(status).render('busquedas/index', params);
}

module.exports = {
  // GET
  async listar(req, res) {
    try {
      if (returnJSON(req)) {
        const busquedas = await Busqueda.findAll(req.query);
        return res.status(200).json(busquedas);
      }
      return renderListView(res, 200, req.query);
    } catch (error) {
      return handleError(req, res, 500, 'Error al obtener búsquedas');
    }
  },

  async detalle(req, res) {
    try {
      const busqueda = await Busqueda.findById(req.params.id);
      if (!busqueda) {
        return handleError(req, res, 404, 'Búsqueda no encontrada');
      }
      if (returnJSON(req)) {
        return res.status(200).json(busqueda);
      }
      return res.status(200).render('busquedas/detalle', { busqueda });
    } catch (error) {
      return handleError(req, res, 500, 'Error al obtener búsqueda');
    }
  },

  // GET - formulario para editar
  async formEditar(req, res) {
    try {
      const busqueda = await Busqueda.findById(req.params.id);
      if (!busqueda) {
        return handleError(req, res, 404, 'Búsqueda no encontrada');
      }
      return res.render('busquedas/form', {
        modo: 'editar',
        busqueda,
        ANIMALES_VALIDOS,
        TIPOS_BUSQUEDA
      });
    } catch (error) {
      return handleError(req, res, 500, 'Error al cargar formulario de edición');
    }
  },

  // POST
  async crear(req, res) {
    try {
      const nuevaBusqueda = await Busqueda.create(req.body);
      if (returnJSON(req)) {
        return res.status(201).json(nuevaBusqueda);
      }
      return renderListView(res, 201);
    } catch (error) {
      return handleError(req, res, 500, 'Error al crear búsqueda');
    }
  },

 // PUT 
  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const busqueda = await Busqueda.findById(id);
      if (!busqueda) {
        return handleError(req, res, 404, 'Búsqueda no encontrada');
      }

      const success = await busqueda.update(req.body);
      if (!success) {
        return handleError(req, res, 500, 'Error al actualizar búsqueda');
      }

      if (returnJSON(req)) {
        return res.status(200).json(busqueda);
      }
      return renderListView(res, 200);
    } catch (error) {
      return handleError(req, res, 500, 'Error al actualizar búsqueda');
    }
  },


  
// DELETE 
  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const busqueda = await Busqueda.findById(id);
      if (!busqueda) {
        return handleError(req, res, 404, 'Búsqueda no encontrada');
      }

      const success = await busqueda.delete();
      if (!success) {
        return handleError(req, res, 500, 'Error al eliminar búsqueda');
      }

      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: `Búsqueda ${id} eliminada` });
      }
      return renderListView(res, 200);
    } catch (error) {
      return handleError(req, res, 500, 'Error al eliminar búsqueda');
    }
  }
};
