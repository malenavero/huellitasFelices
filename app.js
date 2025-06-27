const connectDB = require("./db");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { setupSwagger } = require("./swagger.js");
const methodOverride = require("method-override");
const session = require("express-session");
const helmet = require("helmet");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login_routes.js");
const homeRouter = require("./routes/home");
const productosRouter = require("./routes/productos_routes");
const pacientesRouter = require("./routes/pacientes_routes");
const turnosRouter = require("./routes/turnos_routes");
const usuariosRouter = require("./routes/usuarios_routes.js");
const busquedasRouter = require("./routes/busquedas_routes");
const documentacionRouter = require("./routes/documentacion_routes");
const carritoRouter = require("./routes/carritos_routes.js");
const ventasRouter = require("./routes/ventas_routes.js");
const logoutRouter = require("./routes/logout_routes.js");
const autenticarUsuario = require("./middlewares/autenticarUsuario.js");

// const seedUsuarios = require("./scripts/seed_usuarios.js");
// const seedProductos = require("./scripts/seed_productos.js");
// const seedPacientes = require("./scripts/seed_pacientes.js");
// const seedBusquedas = require("./scripts/seed_busquedas.js");
// const seedTurnos = require("./scripts/seed_turnos.js");

require("dotenv").config();

const clientPromise = connectDB().then(async () => {
  if (process.env.NODE_ENV !== "production") {
    // Esto lo comento porque ahora está la base en atlas, así que no hace falta
    // console.log("🌱 Ejecutando seeds...");
    // await seedUsuarios();
    // await seedProductos();
    // await seedPacientes();
    // await seedBusquedas();
    // await seedTurnos();
    // console.log("✅ Seeds ejecutados.");
  }
  // Retornar el cliente para connect-mongo
  return mongoose.connection.getClient();
});


const app = express();
setupSwagger(app);

// Seguridad - Helmet ayuda a proteger la aplicación configurando varios encabezados HTTP
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     scriptSrc: ["'self'", "'unsafe-inline'"]  }
// }));



// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("trust proxy", 1); 

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Para las imagenes de las mascotas /perdidas encontradas
app.use("/uploads", express.static("public/uploads"));

// Session settings
app.use(
  session({
    name: "huellitas_sid",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise,
      dbName: process.env.DB_NAME,
      touchAfter: 24 * 3600, // Solo guarda cambios 1 vez por día si no hay modificaciones
      collectionName: "sessiones",
      ttl: 2 * 24 * 60 * 60, // 48 horas para cleanup automático
    }),
    cookie: 
    {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 4, // 4 horas
      
      // Diferenciar según entorno
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
    },
  })
);

app.use((req, res, next) => {
  console.log("Cookies:", req.headers.cookie);
  console.log("Session:", req.session);
  next();
});

app.use((req, res, next) => {
  res.locals.productosUrl = "/productos";
  res.locals.carritoUrl = "/carrito";
  res.locals.ventasUrl = "/ventas";
  res.locals.pacientesUrl = "/pacientes";
  res.locals.turnosUrl = "/turnos";
  res.locals.busquedasUrl = "/busquedas";
  res.locals.usuariosUrl = "/usuarios";
  res.locals.documentacionUrl = "/documentacion";
  res.locals.loginUrl = "/login";
  res.locals.logoutUrl = "/logout";
  next();
});

// Seteamos el middleware con variable global para tener acceso al usuario logueado
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null; 
  next();
});


// Esto la hacemos para que en todas las vistas tengamos accesos a la cantidad de items agregados al carrito
app.use((req, res, next) => {
  if (!req.session.carrito) {
    req.session.carrito = { items: [] };
  }
  const cantidadTotal = req.session.carrito.items.reduce((acc, item) => acc + item.cantidad, 0);
  res.locals.carritoCantidad = cantidadTotal;
  next();
});

app.locals.capitalizar = function(texto) {
  if (!texto) return "";
  return texto
    .split(" ")
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
    .join(" ");
};

// Rutas públicas
app.use("/login", loginRouter);
app.use("/documentacion", documentacionRouter);

// Middleware global para rutas privadas
app.use(autenticarUsuario);

// Rutas privadas
app.use("/", indexRouter);
app.use("/home", homeRouter);
app.use("/productos", productosRouter);
app.use("/pacientes", pacientesRouter);
app.use("/turnos", turnosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/busquedas", busquedasRouter);
app.use("/carrito", carritoRouter);
app.use("/ventas", ventasRouter);
app.use("/logout", logoutRouter);


// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;

  if (status === 404) {
    return res
      .status(404)
      .render("errors/404", { mensaje: err.message || "Página no encontrada" });
  }

  console.error(err);
  return res.status(500).render("errors/500", {
    mensaje: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

module.exports = app;
