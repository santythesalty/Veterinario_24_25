// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Importar libreria para mandar correos
const nodemailer = require('nodemailer');
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);


const Dueno = models.dueno;
const Perro = models.perro;

class PerroController { 

    async getAllPerro(req, res) {

        try{
            const data = await Perro.findAll({
                include: {model: Dueno, as: 'id_dueno_Dueno'}
            });
            res.json(Respuesta.exito(data, "Datos de perros recuperados"));
        }catch(err){
            res
            .status(500)
            .json(Respuesta.error(null, `Error al recuperar los datos de los perros: ${req.originalUrl}`));
        }

    }

    async updatePerro(req, res) {
        const perro = req.body; // Recuperamos datos para actualizar
        const idPerro = req.params.id; // ID del perro desde la ruta
      
        // Validar que el ID en la ruta coincida con el ID en el objeto del cuerpo
        if (idPerro != perro.id) {
          return res
            .status(400)
            .json({ error: "El ID del perro no coincide con el de la ruta" });
        }
      
        try {
          const numFilas = await Perro.update({ ...perro }, { where: { id: idPerro } });
      
          if (numFilas == 0) {
            // No se encontró el perro o no hubo cambios
            res
              .status(404)
              .json({ error: "No encontrado o no modificado: " + idPerro });
          } else {
            // Al dar status 204, no se devuelve contenido
            res.status(204).send();
          }
        } catch (err) {
          console.error("Error al actualizar el perro:", err);
          res
            .status(500)
            .json({ error: `Error al actualizar los datos: ${req.originalUrl}` });
        }
      }
      

    async getPerroByNombre(req, res) {
        const nombre = req.params.nombre;
        try{
            const perro = await Perro.findOne({
                where: {nombre: nombre},
                include: {model: Dueno, as: 'id_dueno_Dueno'}
            });
            if(perro){
                res.json(Respuesta.exito(perro, "Perro recuperado"));
            }else{
                res.status(404).json(Respuesta.error(null, "Perro no encontrado"));
            }
        }catch(err){
            logMensaje("Error :" + err);
            res.status(500).json(
                Respuesta.error(null, `Error al recuperar los datos: ${req.originalUrl}`)
            );
        }
    }

    async createPerro(req, res) {
        const perro = req.body;
        try {
            const perroNuevo = await Perro.create(perro);
            res.json(Respuesta.exito(perroNuevo, "Perro creado"));
        } catch (err) {
            logMensaje("Error :" + err);
            res
            .status(500)
            .json(Respuesta.error(null, `Error al crear el perro: ${perro}`));
        }
    }

    async deletePerro(req, res) {

    const nombre = req.params.nombre;
        try {
            const numFilas = await Perro.destroy({
            where: {
            nombre: nombre,
            },
        });
        if (numFilas == 0) {
            res.status(404).json(Respuesta.error(null, "Perro no encontrado"));
        } else {
            res.status(204).send();
        }
        } catch (err) {
            logMensaje("Error :" + err);
            res
            .status(500)
            .json(Respuesta.error(null, `Error al eliminar el perro: ${req.originalUrl}`));
        }
    }

    async getPerrosPorRaza(req, res) {
        try {
            const data = await Perro.findAll({
                attributes: ['raza', [sequelize.fn('COUNT', sequelize.col('raza')), 'cantidad']],
                group: ['raza'],
            });
            res.json(Respuesta.exito(data, "Datos de perros agrupados por raza"));
        } catch (err) {
            logMensaje("Error :" + err);
            res
            .status(500)
            .json(Respuesta.error(null, `Error al recuperar los datos: ${req.originalUrl}`));
        }
    }

}
module.exports = new PerroController();