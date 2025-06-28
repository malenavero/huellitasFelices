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
- **Postman:** - Herramienta para el testeo de los endpoints de la API.
- **Nodemon:** - Utilidad para reiniciar automáticamente el servidor durante el desarrollo.



## Acceso en producción  🚀

Podés acceder a la aplicación ya desplegada desde este enlace:

🌐 https://huellitas-felices.onrender.com

#### Usuarios de prueba

| Email                          | Contraseña | Rol         |
|-------------------------------|------------|-------------|
| emanuel@huellitasfelices.com  | 12345      | Gerencia    |
| admin@huellitasfelices.com    | 12345      | Admin       |
| gonzalo@huellitasfelices.com  | 12345      | Ventas      |
| susana@huellitasfelices.com   | 12345      | Peluquería  |
| paula@huellitasfelices.com    | 12345      | Clínica     |
| cristian@huellitasfelices.com | 12345      | Recepción   |


## Documentación de la API 📚

Accedé a la documentación Swagger para explorar los endpoints disponibles y enviar peticiones de prueba de manera visual:

➡️ https://huellitas-felices.onrender.com/docs

## Guía para ejecutar en local 📋

Estas instrucciones te permitirán levantar la app de forma local.

### Requisitos 

- Tener instalado Node.js. Puede descargarlo desde:
➡️ [https://nodejs.org/](https://nodejs.org/)
    
### Instalación desde una consola Bash 🔧
- Clonar el repositorio:
```bash
    git clone https://github.com/malenavero/huellitasFelices.git
```
    
- Posicionarse en la carpeta del proyecto:
```bash
    cd huellitasFelices
```

- Instalar dependencias: 
```bash
    npm install
```


- Crear archivo .env con los datos provistos en la entrega final.
- Por último, desde la ruta del proyecto:

```bash
    npm run dev
```


### Acceso a la aplicación ⌨️

En el navegador coloque la URL --> [http://localhost:3000](http://localhost:3000)


## Estructura del Proyecto 📦

huellitasFelices
├─ **bin/** (Scripts para iniciar la aplicación)
├─ **controllers/** (Lógica de negocio y controladores que gestionan las peticiones)
├─ **data/** (Archivos JSON usados como base de datos local)
├─ **middlewares/** (Middlewares personalizados para validaciones y manejo de errores)
├─ **models/** (Definición de la estructura de los datos de la aplicación)
├─ **postmanCollections/** (Colección Postman de las pruebas de los endpoints de la API)
├─ **public/** (Imágenes, y otros archivos CSS y JS)
├─ **routes/** (Rutas de la API y vistas)
├─ **scripts/** (Scripts utilitarios y de inicialización de datos)
├─ **services/** (Servicios de lógica de negocio y acceso a datos)
├─ **tests/** (Pruebas automatizadas del sistema)
├─ **utils/** (Funciones utilitarias y helpers)
├─ **views/** (Plantillas Pug para renderizar vistas en HTML)
├─ **.gitignore** (Archivos y carpetas ignorados por Git)
├─ **app.js** (Archivo principal de la API)
├─ **db.js** (Conexión y configuración de la base de datos)
├─ **eslint.config.mjs** (Configuración de ESLint)
├─ **initDataFiles.js** (Script para inicializar los archivos de datos)
├─ **package-lock.json** (Archivo generado automáticamente)
├─ **package.json** (Configuración del proyecto y dependencias)
└─ **swagger.js** (Configuración de Swagger para documentar la API)

## Autores ✒️

- **Cicchini, Josefina**
- **Cohen, Rosana**
- **Cruz Guantay, Francisco Agustin**
- **Guardia Vero, Malena**
