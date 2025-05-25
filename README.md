# Huellitas Felices 🐾

Aplicación web para la gestión integral de una veterinaria y peluquería canina. Permite mejorar la trazabilidad de los servicios ofrecidos, la organización interna y el seguimiento de las mascotas. 

## Funcionalidades principales

- **Autenticación básica de usuarios:** Permite el acceso mediante validación de credenciales almacenadas en archivos JSON.
- **CRUD de productos con control de stock:** Alta, consulta, modificación y baja de productos, gestionando el stock de cada uno.
- **Registro, consulta, modificación y baja de mascotas y dueños:** Permite asociar mascotas a sus propietarios y gestionar su información.
- **Agenda de turnos para peluquería y veterinaria:** Gestión completa de turnos vinculados a mascotas y servicios.
- **Buscador de mascotas por nombre o zona:** Permite la busqueda de mascotas perdidas.
- **Vistas dinámicas generadas con Pug:** Visualización amigable de datos a través de plantillas dinámicas.
- **Documentación interactiva de la API con Swagger:** Acceso a la documentación y pruebas de endpoints desde `/docs`.
- **Pruebas automatizadas y manuales con Postman:** Validación de los endpoints mediante colecciones de pruebas.
- **Middlewares personalizados para validaciones y manejo de errores:** Robustez y control en el flujo de la aplicación.

## Herramientas de desarrollo 🛠️

- **JavaScript:** Lenguaje principal para la lógica de la aplicación.
- **Node.js:** - Entorno de ejecucion para JavaScript del lado del servidor.
- **Express.js:** - Framework para la creacion de servidores HTTP y manejo de rutas.
- **Pug:** - Motor de plantillas para renderizar vistas dinamicas en HTML.
- **JSON:** - Utilizado como base de datos local para persistencia de informacion.
- **Middleware personalizado:** - Implementado para el manejo de errores y validaciones en rutas.
- **Postman:** - Herramienta para el testeo de los endpoints de la API.
- **Nodemon:** - Utilidad para reiniciar automáticamente el servidor durante el desarrollo.

## Guía de inicio 🚀

Estas instrucciones te permitirán lanzar el proyecto en tu navegador web.

### Requisitos 📋

- Tener instalado Node.js. Puede descargarlo desde:
[https://nodejs.org/](https://nodejs.org/)

Opcional: Desde Bash (Git) ejecute:
```bash
    npm install -g nodemon
```
    
### Instalación 🔧
- Clonar el repositorio usando Bash (Git):
```bash
    git clone https://github.com/malenavero/huellitasFelices.git
```
    
- Posicionarse en la carpeta del proyecto con Bash (Git):
```bash
    cd huellitasFelices
```

- Instalar dependencias desde Bash (Git): 
```bash
    npm install
```

### Como ejecutar ⚙️

Utilizando Bash (Git) desde la ruta del proyecto levantamos la aplicacion de dos formas: 

- Modo de inicio normal:
```bash
    node app.js
```
- Modo reinicio automatico:
```bash
    nodemon app.js
```

### Acceso a la aplicación ⌨️

En el navegador coloque la URL --> [http://localhost:3000](http://localhost:3000)

## Documentación

Una vez levantada la aplicacion podra acceder a la documentacion interactiva generada con Swagger, para ello debera utilizar:

URL --> [http://localhost:3000/docs](http://localhost:3000/docs)

Esto le permitira explorar los endpoints disponibles y enviar peticiones de prueba de manera visual.

## Estructura del Proyecto 📦

huellitasFelices
├─ **bin/** (Scripts para iniciar la aplicación)
├─ **controllers/** (Lógica de negocio y controladores que gestionan las peticiones)
├─ **data/** (Archivos JSON usados como base de datos local)
├─ **middlewares/** (Middlewares personalizados para validaciones y manejo de errores)
├─ **models/** (Definicion de la estructura de los datos de la aplicacion)
├─ **node_modules/** (Dependencias instaladas automáticamente por NPM)
├─ **postmanCollections/** (Colección Postman de las pruebas de los endpoints de la API)
├─ **public/** (Imagenes, y otros archivos CSS y JS)
├─ **routes/** (Rutas de la API y vista)
├─ **utils/** (Funciones utilitarias y helpers)
├─ **views/** (Plantillas Pug para renderizar vistas en HTML)
├─ **.gitignore** (Archivos y carpetas ignorados por Git)
├─ **app.js** (Archivo Principal de la API)
├─ **initDataFiles.js** (Script para inicializar los archivos de datos)
├─ **package-lock.json** (Archivo generado automáticamente)
├─ **package.json** (Configuración del proyecto y dependencias)
├─ **swagger.js** (Configuración de Swagger para documentar la API)
└─ **TODO.md** (Lista de tareas pendientes para el desarrollo)

## Autores ✒️

- **Cicchini, Josefina**
- **Cohen, Rosana**
- **Cruz Guantay, Francisco Agustin**
- **Guardia Vero, Malena**
