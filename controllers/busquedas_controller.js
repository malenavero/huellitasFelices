const BusquedaService = require("../services/busquedas_service.js");
const { ANIMALES_VALIDOS, TIPOS_BUSQUEDA } = require("../utils/constants.js");
const { returnJSON, handleError, urls, handleDuplicados, guardarImagenDesdeURL, obtenerExtensionSegura } = require("./utils.js");
const path = require("path");

async function getListParams(query = {}) {
  const busquedas = await BusquedaService.findAll(query);
  return {
    busquedas,
    nombreSeleccionado: query.nombre || "",
    tipoSeleccionado: query.tipo || "",
    animalSeleccionado: query.animal || "",
    activaSeleccionado: query.activa || "",
    ...urls
  };
}

async function renderListView(res, status = 200, query = {}) {
  const params = await getListParams(query);
  return res.status(status).render("busquedas/index", params);
}

module.exports = {
  async listar(req, res) {
    try {
      const busquedas = await BusquedaService.findAll(req.query);

      if (returnJSON(req)) {
        return res.status(200).json(busquedas);
      }

      return renderListView(res, 200, req.query);
    } catch (error) {
      console.log("Error:", error);
      return handleError(req, res, 500, "Error al obtener búsquedas");
    }
  },

  async detalle(req, res) {
    try {
      const busqueda = await BusquedaService.findById(req.params.id);
      if (!busqueda) {
        return handleError(req, res, 404, "Búsqueda no encontrada");
      }

      if (returnJSON(req)) {
        return res.status(200).json(busqueda);
      }
      console.log("busqueda.imagen: ", busqueda.imagen)
      return res.status(200).render("busquedas/detalle", { busqueda });
    } catch (error) {
      console.log("Error:", error);
      return handleError(req, res, 500, "Error al obtener búsqueda");
    }
  },

  async formEditar(req, res) {
    try {
      const busqueda = await BusquedaService.findById(req.params.id);
      if (!busqueda) return handleError(req, res, 404, "Búsqueda no encontrada");

      return res.render("busquedas/form", {
        modo: "editar",
        busqueda,
        ANIMALES_VALIDOS,
        TIPOS_BUSQUEDA
      });
    } catch (error) {
      console.log("Error:", error);
      return handleError(req, res, 500, "Error al cargar formulario de edición");
    }
  },

  formCrear(req, res) {
    return res.render("busquedas/form", {
      modo: "crear",
      busqueda: {},
      errores: [],
      ANIMALES_VALIDOS,
      TIPOS_BUSQUEDA
    });
  },

  async crear(req, res) {
    try {

      const creatingWithHttpImage = req.body && req.body.imagen && req.body.imagen.startsWith("http");
      if(creatingWithHttpImage) {
        const newImg = req.body.imagen;
        const extension = path.extname(newImg) || ".jpg";
        const nombreArchivo = `busqueda-${Date.now()}${extension}`;
        const rutaLocal = await guardarImagenDesdeURL(newImg, nombreArchivo);
        req.body.imagen = rutaLocal; 
      }

      const nuevaBusqueda = await BusquedaService.create(req.body);

      if (returnJSON(req)) {
        return res.status(201).json(nuevaBusqueda);
      }

      return renderListView(res, 201);
    } catch (error) {
      console.log("Error:", error);

      if (error.code == 11000) {
        const modo = "crear";

        return handleDuplicados({
          campos: error.campos,
          req, res, modo,
          vista: "busquedas/form",
          datos: {
            modo,
            busqueda: req.body,
            ANIMALES_VALIDOS,
            TIPOS_BUSQUEDA,
            errores: []
          },
          campoFallback: "nombre"
        });
      }

      return handleError(req, res, 500, "Error al crear búsqueda");
    }
  },

  async actualizar(req, res) {
    try {
      const updatingWithHttpImage = req.body && req.body.imagen && req.body.imagen.startsWith("http");
      if(updatingWithHttpImage) {
        const newImg = req.body.imagen;
        const extension = obtenerExtensionSegura(newImg, ".jpg");
        const nombreArchivo = `busqueda-${Date.now()}${extension}`;
        const rutaLocal = await guardarImagenDesdeURL(newImg, nombreArchivo);
        req.body.imagen = rutaLocal; 
      }
      const busquedaActualizada = await BusquedaService.update(req.params.id, req.body);

      if (!busquedaActualizada) {
        return handleError(req, res, 404, "Búsqueda no encontrada");
      }

      


      if (returnJSON(req)) {
        return res.status(200).json(busquedaActualizada);
      }

      return renderListView(res, 200);
    } catch (error) {
      console.log("Error:", error);

      if (error.code == 11000) {
        const modo = "editar";
        const busqueda = {
          ...req.body,
          _id: req.params.id
        };

        return handleDuplicados({
          campos: error.campos,
          req, res, modo,
          vista: "busquedas/form",
          datos: {
            modo,
            busqueda,
            ANIMALES_VALIDOS,
            TIPOS_BUSQUEDA,
            errores: []
          },
          campoFallback: "nombre"
        });
      }

      return handleError(req, res, 500, "Error al actualizar búsqueda");
    }
  },

  async eliminar(req, res) {
    try {
      const idEliminado = await BusquedaService.delete(req.params.id);

      if (!idEliminado) {
        return handleError(req, res, 404, "Búsqueda no encontrada");
      }

      if (returnJSON(req)) {
        return res.status(200).json({ mensaje: `Búsqueda ${idEliminado} eliminada` });
      }

      return renderListView(res, 200);
    } catch (error) {
      console.log("Error:", error);
      return handleError(req, res, 500, "Error al eliminar búsqueda");
    }
  }
};
