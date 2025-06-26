const { returnJSON, handleError } = require("./utils.js");

module.exports = {
    async logout(req, res) {
        try {
            await req.session.destroy();
            
            if (returnJSON(req)) {
              return res
                .status(200)
                .json({ message: "Sesión cerrada correctamente" });
            }

            res.clearCookie("huellitas_sid"); 
            return res.status(200).redirect("/login");
        } catch (error) {
            console.error("Error en el proceso de cierre de sesión:", error);
            handleError(req, res, 500, "Error al cerrar sesión");
        }
    }
}