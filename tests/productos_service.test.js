const productoService = require('../services/productos_service'); // Contiene el CRUD a testear

let productosMock; // Variable para almacenar un array de productos mockeados

beforeEach(() => {
    productosMock = [
        {
            _id: 1,
            nombre: "vitaminas caninas",
            categoria: "farmacia",
            precio: 1200,
            stock: 10,
            descripcion: "Vitaminas para perros adultos",
            fechaVencimiento: new Date("2026-05-01"),
            createdAt: new Date("2025-06-01")
        },
        {
            _id: 2,
            nombre: "alimento premium gato",
            categoria: "comida",
            precio: 3500,
            stock: 25,
            descripcion: "Bolsa de alimento balanceado para gatos",
            fechaVencimiento: new Date("2026-01-15"),
            createdAt: new Date("2025-06-02")
        },
        {
            _id: 3,
            nombre: "pipeta pulguicida",
            categoria: "farmacia",
            precio: 800,
            stock: 50,
            descripcion: "Pipeta antipulgas para perros medianos",
            fechaVencimiento: new Date("2027-03-10"),
            createdAt: new Date("2025-06-03")
        },
        {
            _id: 4,
            nombre: "juguete hueso",
            categoria: "otros",
            precio: 500,
            stock: 100,
            descripcion: "Hueso de goma para morder",
            fechaVencimiento: null,
            createdAt: new Date("2025-06-04")
        },
        {
            _id: 5,
            nombre: "alimento cachorro",
            categoria: "comida",
            precio: 2200,
            stock: 15,
            descripcion: "Alimento balanceado para cachorros",
            fechaVencimiento: new Date("2026-09-30"),
            createdAt: new Date("2025-06-05")
        }
    ];
    jest.resetAllMocks(); // Utilizamos resetAllMocks para limpiar completamente cada mock antes de cada test (llamadas y valores o definiciones)
});

// Creamos un bloque de pruebas para el servicio de productos
describe('Test : CRUD de productos_Service.js', () => {
    // Tests
    test('findAll : Deberia devolver todos los productos', async () => {
        productoService.findAll = jest.fn().mockResolvedValue(productosMock); // Indicamos que el llamado del método findAll utilice los productos mockeados
        const resultado = await productoService.findAll(); // Llamamos al metodo findAll desde productos_Service.js
        expect(resultado).toEqual(productosMock); // Evaluamos si el retorno de la función es igual al array de productos mockeados
    });

    test('findById : Deberia devolver un producto por ID', async () => {
        productoService.findById = jest.fn().mockResolvedValue(productosMock[0]); // Indicamos que el método findById retorne el primer producto (ID: 1)
        const resultado = await productoService.findById(1); // Llamamos al metodo findById desde productos_Service.js
        expect(resultado).toEqual(productosMock[0]); // Verificamos que el resultado sea igual al primer producto del mock
    });

    test('create : Deberia crear un nuevo producto', async () => {
        // Definimos un nuevo producto mockeado que se utilizara para la prueba
        let nuevoProducto = {
            nombre: "juguete rata",
            categoria: "otros",
            precio: 1500,
            stock: 20,
            descripcion: "Juguete para gatos con hierba gatera",
            fechaVencimiento: null,
            createdAt: new Date()
        }
        // Indicamos que el método create agregue el nuevo producto al array de productos mockeados y retorne el mismo como promesa resuelta
        productoService.create = jest.fn().mockImplementation((nuevoProducto) => {
            productosMock.push(nuevoProducto); // Agregamos el nuevo producto
            return Promise.resolve(nuevoProducto); // Retornamos una promesa resuelta (ya que el metodo real retorna "producto.save()"
        });
        const resultado = await productoService.create(nuevoProducto); // Llamamos al metodo create desde productos_Service.js con el nuevo producto como parametro
        expect(resultado).toEqual(productosMock[productosMock.length - 1]); // Verificamos que el producto retornado sea igual al último producto del mock (el que agregamos)
    });

    test('update : Deberia actualizar el producto con ID: 2', async () => {
        // Definimos los parametros que se utilizaran para la prueba
        const idProdActualizar = 1;
        const camposActualizados = { fechaVencimiento: new Date("2026-06-15") };

        const indice = productosMock.findIndex(p => p._id === idProdActualizar); // Obtenemos el indice del producto según su ID

        // Indicamos que el método update actualice el producto con ID 2 y retorne el mismo con los cambios y como promesa resuelta
        productoService.update = jest.fn().mockImplementation((idProdActualizar, camposActualizados) => {
            // Evaluamos si el indice es válido
            if (indice === -1) {
                return Promise.resolve(null); // Si no existe el producto, retornamos null
            }
            else {
                productosMock[indice] = { ...productosMock[indice], ...camposActualizados }; // Utilizamos el operador spread para actualizar lo campos del producto
                return Promise.resolve(productosMock[indice]); // Retornamos el producto actualizado como promesa resuelta
            }
        });
        const resultado = await productoService.update(idProdActualizar, camposActualizados); // Llamamos al metodo update desde productos_Service.js con el ID y los campos a actualizar como parametros
        expect(resultado).toEqual(productosMock[indice]); // Verificamos que el campo actualizado sea igual al valor que le pasamos
    });
});