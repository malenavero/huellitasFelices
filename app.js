const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { setupSwagger } = require("./swagger.js");
const ensureDataFilesExist = require("./initDataFiles");
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login.routes.js");
const homeRouter = require("./routes/home");
const productosRouter = require("./routes/productos.routes");
const pacientesRouter = require("./routes/pacientes.routes");
const turnosRouter = require("./routes/turnos.routes");
const usuariosRouter = require("./routes/usuarios.routes");
const busquedasRouter = require("./routes/busquedas.routes");
const documentacionRouter = require("./routes/documentacion.routes");


const methodOverride = require("method-override");


const app = express();
setupSwagger(app);

// Me aseguro de que si no existe la base de datos json la cree con arrays vacios
ensureDataFilesExist();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  res.locals.productosUrl = "/productos";
  res.locals.pacientesUrl = "/pacientes";
  res.locals.turnosUrl = "/turnos";
  res.locals.busquedasUrl = "/busquedas";
  res.locals.usuariosUrl = "/usuarios";
  res.locals.documentacionUrl = "/documentacion";
  res.locals.loginUrl = "/login";
  next();
});




app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);
app.use("/productos", productosRouter);
app.use("/pacientes", pacientesRouter);
app.use("/turnos", turnosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/busquedas", busquedasRouter);
app.use("/documentacion", documentacionRouter);



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

// Explicitamos el puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
