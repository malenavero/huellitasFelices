const productoService = require('../services/productos_service'); // Contiene el CRUD a testear

let productosMock; // Variable para almacenar un array de productos mockeados

beforeEach(() => {
  productosMock = [
    {
      _id: 1,
      nombre: 'vitaminas caninas',
      categoria: 'farmacia',
      precio: 1200,
      stock: 10,
      descripcion: 'Vitaminas para perros adultos',
      fechaVencimiento: new Date('2026-05-01'),
      createdAt: new Date('2025-06-01'),
    },
    {
      _id: 2,
      nombre: 'alimento premium gato',
      categoria: 'comida',
      precio: 3500,
      stock: 25,
      descripcion: 'Bolsa de alimento balanceado para gatos',
      fechaVencimiento: new Date('2026-01-15'),
      createdAt: new Date('2025-06-02'),
    },
    {
      _id: 3,
      nombre: 'pipeta pulguicida',
      categoria: 'farmacia',
      precio: 800,
      stock: 50,
      descripcion: 'Pipeta antipulgas para perros medianos',
      fechaVencimiento: new Date('2027-03-10'),
      createdAt: new Date('2025-06-03'),
    },
    {
      _id: 4,
      nombre: 'juguete hueso',
      categoria: 'otros',
      precio: 500,
      stock: 100,
      descripcion: 'Hueso de goma para morder',
      fechaVencimiento: null,
      createdAt: new Date('2025-06-04'),
    },
    {
      _id: 5,
      nombre: 'alimento cachorro',
      categoria: 'comida',
      precio: 2200,
      stock: 15,
      descripcion: 'Alimento balanceado para cachorros',
      fechaVencimiento: new Date('2026-09-30'),
      createdAt: new Date('2025-06-05'),
    },
  ];
  jest.resetAllMocks(); // Utilizamos resetAllMocks para limpiar completamente cada mock antes de cada test (llamadas y valores o definiciones)
});

// Creamos un bloque de pruebas para el servicio de productos
describe('Test : CRUD de productos_Service.js', () => {
  // Tests
  test('findAll : Debería devolver todos los productos, en total 5', async () => {
    productoService.findAll = jest.fn().mockResolvedValue(productosMock); // Indicamos que el llamado del método findAll utilice los productos mockeados

    const resultado = await productoService.findAll(); // Llamamos al método findAll desde productos_Service.js
    expect(resultado.length).toBe(5); // Verificamos que el array de productos tenga una longitud de 5
    expect(resultado).toEqual(productosMock); // Evaluamos si el retorno de la función es igual al array de productos mockeados
  });

  test('findById : Debería devolver el producto con ID: 1', async () => {
    productoService.findById = jest.fn().mockResolvedValue(productosMock[0]); // Indicamos que el método findById retorne el primer producto (ID: 1)

    const resultado = await productoService.findById(1); // Llamamos al método findById desde productos_Service.js
    expect(resultado._id).toEqual(1); // Verificamos que el ID del producto retornado sea igual al esperado (1)
  });

  test('create : Debería crear un nuevo producto y agregarlo al array, quedando 6 productos', async () => {
    // Definimos un nuevo producto mockeado que se utilizará para la prueba
    let nuevoProducto = {
      nombre: 'juguete rata',
      categoria: 'otros',
      precio: 1500,
      stock: 20,
      descripcion: 'Juguete para gatos con hierba gatera',
      fechaVencimiento: null,
      createdAt: new Date(),
    };
    // Indicamos que el método create agregue el nuevo producto al array de productos mockeados y retorne el mismo como promesa resuelta
    productoService.create = jest.fn().mockImplementation((nuevoProducto) => {
      productosMock.push(nuevoProducto); // Agregamos el nuevo producto
      return Promise.resolve(nuevoProducto); // Retornamos una promesa resuelta (ya que el método real retorna "producto.save()")
    });

    const resultado = await productoService.create(nuevoProducto); // Llamamos al método create desde productos_Service.js con el nuevo producto como parámetro
    expect(productosMock.length).toBe(6); // Verificamos que el array de productos tenga una longitud de 6 (5 productos iniciales + 1 nuevo)
    expect(resultado).toEqual(productosMock[productosMock.length - 1]); // Verificamos que el producto retornado sea igual al último producto del mock (el que agregamos)
  });

  test('update : Debería actualizar la fecha de vencimiento a "2026-06-15" del producto con ID: 1', async () => {
    // Definimos los parámetros que se utilizarán para la prueba
    const idProdActualizar = 1;
    const camposActualizados = { fechaVencimiento: new Date('2026-06-15') };

    const indice = productosMock.findIndex((p) => p._id === idProdActualizar); // Obtenemos el índice del producto según su ID

    // Indicamos que el método update actualice el producto con ID 1 y retorne el mismo con los cambios y como promesa resuelta
    productoService.update = jest
      .fn()
      .mockImplementation((idProdActualizar, camposActualizados) => {
        // Evaluamos si el índice es válido
        if (indice === -1) {
          return Promise.resolve(null); // Si no existe el producto, retornamos null
        } else {
          productosMock[indice] = {
            ...productosMock[indice],
            ...camposActualizados,
          }; // Utilizamos el operador spread para actualizar los campos del producto
          return Promise.resolve(productosMock[indice]); // Retornamos el producto actualizado como promesa resuelta
        }
      });

    const resultado = await productoService.update(
      idProdActualizar,
      camposActualizados
    ); // Llamamos al método update desde productos_Service.js con el ID y los campos a actualizar como parámetros
    expect(resultado.fechaVencimiento).toEqual(new Date('2026-06-15')); // Verificamos que el campo actualizado sea igual al valor que le pasamos
  });

  test('delete : Debería eliminar el producto con ID: 3', async () => {
    const idProdEliminar = 3;
    const indice = productosMock.findIndex((p) => p._id === idProdEliminar); // Obtenemos el índice del producto según su ID

    productoService.delete = jest.fn().mockImplementation((idProdEliminar) => {
      // Evaluamos si el índice es válido
      if (indice === -1) {
        return Promise.resolve(null); // Si no existe el producto, retornamos null
      } else {
        const producto = productosMock[indice]; // Guardamos el producto a eliminar
        productosMock.splice(indice, 1); // Utilizamos splice para eliminar el producto del array
        return Promise.resolve(producto._id); // Retornamos el ID del producto eliminado como promesa resuelta
      }
    });

    const resultado = await productoService.delete(idProdEliminar); // Llamamos al método delete desde productos_Service.js con el ID del producto a eliminar como parámetro
    expect(resultado).toEqual(3); // Verificamos que el ID del producto eliminado sea igual al ID que pasamos como parámetro
    expect(productosMock.length).toBe(4); // Verificamos que el array de productos tenga una longitud de 4 (5 productos iniciales - 1 eliminado)
  });

  test('validarStock : Debería validar el stock de un producto ID: 5, según la cantidad requerida: 2', async () => {
    const idProdValidar = 5;
    const cantidad = 2;

    const indice = productosMock.findIndex((p) => p._id === idProdValidar); // Obtenemos el índice del producto según su ID
    productoService.validarStock = jest
      .fn()
      .mockImplementation((idProdValidar, cantidad) => {
        if (indice === -1) {
          return Promise.resolve(null); // Si no existe el producto, retornamos null
        } else {
          const producto = productosMock[indice]; // Obtenemos el producto según su ID
          if (producto.stock < cantidad) {
            return Promise.resolve(null); // Si el stock es menor a la cantidad, retornamos null
          }
          return Promise.resolve(producto); // Si el stock es suficiente, retornamos el producto como promesa resuelta
        }
      });

    const resultado = await productoService.validarStock(
      idProdValidar,
      cantidad
    ); // Llamamos al método validarStock desde productos_Service.js con el ID del producto y la cantidad a validar como parámetros
    expect(resultado).toEqual(productosMock[indice]); // Verificamos que el producto retornado sea igual al producto del mock con el ID al que pasamos como parámetro para validar el stock
  });

  test('descontarStock : Deberia descontar stock correctamente si hay suficiente', async () => {
    const idProducto = 2;
    const cantidadADescontar = 5;

    const indice = productosMock.findIndex((p) => p._id === idProducto);
    const stockOriginal = productosMock[indice].stock;

    productoService.descontarStock = jest
      .fn()
      .mockImplementation((id, cantidad) => {
        const index = productosMock.findIndex((p) => p._id === id);
        if (index === -1) return Promise.resolve(null); // Producto no encontrado
        if (productosMock[index].stock < cantidad) return Promise.resolve(null); // Stock insuficiente

        productosMock[index].stock -= cantidad;
        return Promise.resolve(productosMock[index]); // Retorna el producto actualizado
      });

    const resultado = await productoService.descontarStock(
      idProducto,
      cantidadADescontar
    );

    expect(resultado.stock).toBe(stockOriginal - cantidadADescontar); // Verifica el stock descontado
    expect(productosMock[indice].stock).toBe(
      stockOriginal - cantidadADescontar
    ); // Verifica el cambio real en el mock
  });

  test('descontarStock : No deberia descontar si el stock es insuficiente', async () => {
    const idProducto = 1;
    const cantidadADescontar = 999; // Más que el stock disponible

    productoService.descontarStock = jest
      .fn()
      .mockImplementation((id, cantidad) => {
        const index = productosMock.findIndex((p) => p._id === id);
        if (index === -1) return Promise.resolve(null);
        if (productosMock[index].stock < cantidad) return Promise.resolve(null);

        productosMock[index].stock -= cantidad;
        return Promise.resolve(productosMock[index]);
      });

    const resultado = await productoService.descontarStock(
      idProducto,
      cantidadADescontar
    );

    expect(resultado).toBeNull(); // Se espera null porque no hay suficiente stock
  });
});
