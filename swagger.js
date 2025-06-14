// Aca tambien pedi ayuda a la IA para configurar el archivo de swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { CATEGORIAS_PRODUCTO, TIPOS_BUSQUEDA, ANIMALES_VALIDOS, ROLES } = require("./utils/constants.js");


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Huellitas Felices API",
      version: "1.0.0",
      description: "Documentación API para Huellitas Felices",
    },
    tags: [
      {
        name: "Productos",
        description: "Operaciones relacionadas con productos del petshop",
      },
      {
        name: "Productos (Vistas)",
        description: "Vistas HTML para formularios de productos",
      },
      {
        name: "Pacientes",
        description: "Operaciones relacionadas con pacientes (mascotas)",
      },
      {
        name: "Pacientes (Vistas)",
        description: "Vistas HTML para formularios de pacientes",
      },
      {
        name: "Turnos",
        description: "Operaciones relacionadas con turnos",
      },
      {
        name: "Turnos (Vistas)",
        description: "Vistas HTML para formularios de turnos",
      },
      {
        name: "Búsquedas",
        description: "Operaciones relacionadas con búsquedas",
      },
      {
        name: "Búsquedas (Vistas)",
        description: "Vistas HTML para formularios de búsquedas",
      },
      {
        name: "Usuarios",
        description: "Operaciones relacionadas con usuarios",
      },
      {
        name: "Usuarios (Vistas)",
        description: "Vistas HTML para formularios de usuarios",
      },
      { 
        name: "Login",
        description: "Formulario e inicio de sesión de usuarios" 
      }
    ],
    components: {
      schemas: {
        Producto: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nombre: { type: "string" },
            categoria: { type: "string" },
            precio: { type: "number" },
            stock: { type: "integer" },
            descripcion: { type: "string" },
            fechaVencimiento: {
              type: "string",
              format: "date",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        ProductoInput: {
          type: "object",
          required: ["nombre", "categoria", "precio"],
          properties: {
            nombre: { type: "string" },
            categoria: {
              type: "string",
              enum: CATEGORIAS_PRODUCTO,
            },
            precio: { type: "number" },
            stock: { type: "integer", default: 0 },
            descripcion: { type: "string" },
            fechaVencimiento: {
              type: "string",
              format: "date",
            },
          },
        },
        ProductoUpdateInput: {
          type: "object",
          properties: {
            nombre: { type: "string" },
            categoria: {
              type: "string",
              enum: CATEGORIAS_PRODUCTO,
            },
            precio: { type: "number" },
            stock: { type: "integer", default: 0 },
            descripcion: { type: "string" },
            fechaVencimiento: {
              type: "string",
              format: "date",
            },
          },
          example: {
            precio: 18999,
          },
        },
        Paciente: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nombre: { type: "string" },
            especie: { type: "string" },
            responsable: {
              type: "object",
              properties: {
                nombre: { type: "string" },
                telefono: { type: "string" },
                email: { type: "string", format: "email" },
                direccion: { type: "string" },
              },
            },
            fichaMedica: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  raza: { type: "string" },
                  fechaNacimiento: {
                    type: "string",
                    format: "date",
                    description: "Fecha en formato AAAA-MM-DD",
                  },
                  peso: { type: "number" },
                  alergias: {
                    type: "array",
                    items: { type: "string" },
                  },
                  notas: { type: "string" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            edad: { type: "integer", description: "Edad calculada en años" },
          },
        },
        PacienteInput: {
          type: "object",
          required: ["nombre", "especie", "responsable"],
          properties: {
            nombre: { type: "string" },
            especie: { type: "string" },
            raza: { type: "string" },
            responsable: {
              type: "object",
              required: ["nombre", "telefono", "email"],
              properties: {
                nombre: { type: "string" },
                telefono: { type: "string" },
                email: { type: "string", format: "email" },
                direccion: { type: "string" },
              },
            },
            fichaMedica: {
              type: "object",
              properties: {
                raza: { type: "string" },
                fechaNacimiento: {
                  type: "string",
                  format: "date",
                  description: "Fecha en formato AAAA-MM-DD",
                },
                peso: { type: "number" },
                alergias: {
                  type: "array",
                  items: { type: "string" },
                },
                notas: { type: "string" },
              },
            },
          },
        },
        PacienteUpdateInput: {
          type: "object",
          properties: {
            nombre: { type: "string" },
            especie: { type: "string" },
            raza: { type: "string" },
            responsable: {
              type: "object",
              properties: {
                nombre: { type: "string" },
                telefono: { type: "string" },
                email: { type: "string", format: "email" },
                direccion: { type: "string" },
              },
            },
            fichaMedica: {
              type: "object",
              properties: {
                raza: { type: "string" },
                fechaNacimiento: {
                  type: "string",
                  format: "date",
                  description: "Fecha en formato AAAA-MM-DD",
                },
                peso: { type: "number" },
                alergias: {
                  type: "array",
                  items: { type: "string" },
                },
                notas: { type: "string" },
              },
            },
          },
          example: {
            nombre: "Susana",
            fichaMedica: {
              peso: 4.5,
              alergias: ["polen"],
              notas: "Coordinar consultas anuales fuera de primavera."
            }
          },
        },
        Turno: {
          type: "object",
          properties: {
            id: { type: "string" },
            fecha: { type: "string", format: "date" },
            hora: { type: "string" },
            paciente: { type: "Paciente" },
            servicio: { type: "string" },
            precio: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        TurnoInput: {
          type: "object",
          required: ["fecha", "hora", "paciente", "servicio"],
          properties: {
            fecha: { type: "string", format: "date" },
            hora: { type: "string" },
            pacienteId: { type: "integer" },
            servicio: { type: "string" },
            precio: { type: "number" },
          },
        },
        TurnoUpdateInput: {
          type: "object",
          properties: {
            fecha: { type: "string", format: "date" },
            hora: { type: "string" },
            pacienteId: { type: "integer" },
            servicio: { type: "string" },
            precio: { type: "number" },
          },
          example: {
            hora: "15:30",
          },
        },
        Busqueda: {
          type: "object",
          properties: {
            id: { type: "integer" },
            tipo: {
              type: "string",
              enum: TIPOS_BUSQUEDA,
            },
            zona: { type: "string" },
            fecha: { type: "string", format: "date" },
            descripcion: { type: "string" },
            contacto: { type: "string" },
            imagen: { type: "string" },
            animal: {
              type: "string",
              enum: ANIMALES_VALIDOS,
            },
            color: { type: "string" },
            activa: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BusquedaInput: {
          type: "object",
          required: ["tipo", "zona", "fecha", "contacto", "activa"],
          properties: {
            tipo: {
              type: "string",
              enum: TIPOS_BUSQUEDA,
            },
            zona: { type: "string" },
            fecha: { type: "string", format: "date" },
            descripcion: { type: "string" },
            contacto: { type: "string" },
            imagen: { type: "string" },
            animal: {
              type: "string",
              enum: ANIMALES_VALIDOS,
            },
            color: { type: "string" },
            activa: { type: "boolean" },
          },
        },
        BusquedaUpdateInput: {
          type: "object",
          properties: {
            tipo: {
              type: "string",
              enum: TIPOS_BUSQUEDA,
            },
            zona: { type: "string" },
            fecha: { type: "string", format: "date" },
            descripcion: { type: "string" },
            contacto: { type: "string" },
            imagen: { type: "string" },
            animal: {
              type: "string",
              enum: ANIMALES_VALIDOS,
            },
            color: { type: "string" },
            activa: { type: "boolean" },
          },
          example: {
            activa: false,
          },
        },
        Usuario: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nombre: { type: "string" },
            apellido: { type: "string" },
            password: { type: "string" },
            telefono: { type: "string" },
            direccion: { type: "string" },
            correo: { type: "string", format: "email" },
            rol: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UsuarioInput: {
          type: "object",
          required: [
            "nombre",
            "apellido",
            "password",
            "correo",
            "rol",
            "telefono",
          ],
          properties: {
            nombre: { type: "string" },
            apellido: { type: "string" },
            password: { type: "string", format: "password" },
            telefono: { type: "string" },
            direccion: { type: "string" },
            correo: { type: "string", format: "email" },
            rol: { type: "string", enum: ROLES },
          },
        },
        UsuarioUpdateInput: {
          type: "object",
          properties: {
            nombre: { type: "string" },
            apellido: { type: "string" },
            password: { type: "string", format: "password" },
            telefono: { type: "string" },
            direccion: { type: "string" },
            correo: { type: "string", format: "email" },
            rol: { type: "string", enum: ROLES },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};
  

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = {
  setupSwagger,
};
