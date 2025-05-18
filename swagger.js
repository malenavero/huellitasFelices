// Aca tambien pedi ayuda a la IA para configurar el archivo de swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { CATEGORIAS_PRODUCTO } = require('./utils/constants.js');


const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Huellitas Felices API',
        version: '1.0.0',
        description: 'Documentación API para Huellitas Felices',
      },
      tags: [
        {
          name: 'Productos',
          description: 'Operaciones relacionadas con productos del petshop',
        },
        {
          name: 'Pacientes',
          description: 'Operaciones relacionadas con pacientes (mascotas)',
        }
      ],
      components: {
        schemas: {
            Producto: {
                type: 'object',
                properties: {
                id: { type: 'integer' },
                nombre: { type: 'string' },
                categoria: { type: 'string' },
                precio: { type: 'number' },
                stock: { type: 'integer' },
                descripcion: { type: 'string' },
                fechaVencimiento: {
                    type: 'string',
                    format: 'date',
                },
                createdAt: {
                    type: 'string',
                    format: 'date-time',
                },
                updatedAt: {
                    type: 'string',
                    format: 'date-time',
                },
                },
            },
            ProductoInput: {
                type: 'object',
                required: ['nombre', 'categoria', 'precio'],
                properties: {
                nombre: { type: 'string' },
                categoria: { 
                    type: 'string',
                    enum: CATEGORIAS_PRODUCTO
                },
                precio: { type: 'number' },
                stock: { type: 'integer', default: 0 },
                descripcion: { type: 'string' },
                fechaVencimiento: {
                    type: 'string',
                    format: 'date',
                },
                },
            },
            ProductoUpdateInput: {
								type: 'object',
								properties: {
									nombre: { type: 'string' },
									categoria: { 
											type: 'string',
											enum: CATEGORIAS_PRODUCTO
									},
									precio: { type: 'number' },
									stock: { type: 'integer', default: 0 },
									descripcion: { type: 'string' },
									fechaVencimiento: {
											type: 'string',
											format: 'date',
									},
								},
								example: {
                	precio: 18999
                }
            },
            Paciente: {
                type: 'object',
                properties: {
                id: { type: 'integer' },
                nombre: { type: 'string' },
                especie: { type: 'string' },
                raza: { type: 'string' },
                fechaNacimiento: { 
                    type: 'string',
                    format: 'date',
                    description: 'Fecha en formato AAAA-MM-DD'
                },
                responsable: {
                    type: 'object',
                    properties: {
                    nombre: { type: 'string' },
                    telefono: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    direccion: { type: 'string' }
                    },
                },
                fichaMedica: {
                    type: 'array',
                    items: {
                    type: 'object',
                    properties: {
                        fecha: { type: 'string', format: 'date' },
                        detalle: { type: 'string' }
                    }
                    }
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                edad: { type: 'integer', description: 'Edad calculada en años' }
                },
            },
            PacienteInput: {
                type: 'object',
                required: ['nombre', 'especie', 'fechaNacimiento', 'responsable'],
                properties: {
                nombre: { type: 'string' },
                especie: { type: 'string' },
                raza: { type: 'string' },
                fechaNacimiento: { type: 'string', format: 'date' },
                responsable: {
                    type: 'object',
                    properties: {
                    nombre: { type: 'string' },
                    telefono: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    direccion: { type: 'string' }
                    },
                    required: ['nombre', 'telefono', 'email', 'direccion']
                }
                }
            },   
            PacienteUpdateInput: {
                type: 'object',
                properties: {
									nombre: { type: 'string' },
									especie: { type: 'string' },
									raza: { type: 'string' },
									fechaNacimiento: { type: 'string', format: 'date' },
									responsable: {
										type: 'object',
										properties: {
										nombre: { type: 'string' },
										telefono: { type: 'string' },
										email: { type: 'string', format: 'email' },
										direccion: { type: 'string' }
										}
									}
								},
								example: {
                	nombre: 'Susana'
                }
            },
            Turno: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  fecha: { type: 'string', format: 'date' },
                  hora: { type: 'string' },
                  pacienteId: { type: 'integer' },
                  servicio: { type: 'string' },
                  precio: { type: 'number' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' }
                },
              },
              TurnoInput: {
                type: 'object',
                required: ['fecha', 'hora', 'pacienteId', 'servicio'],
                properties: {
                  fecha: { type: 'string', format: 'date' },
                  hora: { type: 'string' },
                  pacienteId: { type: 'integer' },
                  servicio: { type: 'string' },
                  precio: { type: 'number' }
                }
              },
              TurnoUpdateInput: {
                type: 'object',
                properties: {
                  fecha: { type: 'string', format: 'date' },
                  hora: { type: 'string' },
                  pacienteId: { type: 'integer' },
                  servicio: { type: 'string' },
                  precio: { type: 'number' }
                },
                example: {
                	hora: '15:30'
                }
              }
                         
        },
      },
    },
    apis: ['./routes/*.js'],
  };
  

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = {
  setupSwagger,
};
