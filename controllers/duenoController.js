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

class DuenoController {

   async getAllDueno(req, res) {
    try {
      const data = await Dueno.findAll(); // Recuperar todos los platos
      res.json(Respuesta.exito(data, "Datos de duenos recuperados"));
    } catch (err) {
      // Handle errors during the model call
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los duenos: ${req.originalUrl}`
          )
        );
    }
  }

  async getDuenoByPerroId(req, res) {
    const idperro = req.params.idperro;
    try {
      // Buscar el perro incluyendo la relación con el dueño (con el alias correcto)
      const perro = await Perro.findByPk(idperro, {
        include: { model: Dueno, as: 'id_dueno_Dueno' } 
      });
  
      if (perro && perro.id_dueno_Dueno) {
        res.json(Respuesta.exito(perro.id_dueno_Dueno , "Dueño recuperado"));
      } else {
        res.status(404).json(Respuesta.error(null, "Dueño no encontrado para el perro especificado"));
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res.status(500).json(
        Respuesta.error(null, `Error al recuperar los datos: ${req.originalUrl}`)
      );
    }
  }
  
  async getDuenosActivoConPerrosSinVacunar(req, res) {
    try {
      // Buscar dueños activos que tengan al menos un perro sin vacunar
      const duenos = await Dueno.findAll({
        where: { es_activo: 1 }, // Solo dueños activos
        include: [
          {
            model: Perro,
            as: 'Perros', // Usa el alias correcto definido en la relación
            where: { vacunado: 0 }, // Solo perros sin vacunar
            required: true // Asegura que el dueño tenga al menos un perro sin vacunar
          }
        ]
      });
  
      res.json(Respuesta.exito(duenos, "Dueños activos con perros sin vacunar recuperados"));

    } catch (err) {
      logMensaje("Error :" + err);
      res.status(500).json(
        Respuesta.error(null, `Error al recuperar los datos: ${req.originalUrl}`)
      );
    }
  }

  // Le tiene que llegar el correo del dueño y el nombre del perro
  // Se podria ampliar para que llegase todo tipo de peticiones para correo
  async enviarCorreo(req, res) {
    const to = req.body.correo; // Destinatario del correo
    const subject = 'Vacunacion ' + req.body.nombrePerro; // Asunto del correo
    const text = 'Hola, soy tu veterinario y te escribo para recordarte que tu perro ' + req.body.nombrePerro + ' necesita vacunarse'; // Cuerpo del correo
  
    // Configurar transporte SMTP de Brevo (Sendinblue)
    let transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587, // o 465 si prefieres SSL
      auth: {
        user: '84b555001@smtp-brevo.com', // Tu usuario SMTP de Brevo
        pass: 'pzBYNLI3j6yhZ75J' // Tu clave API de Brevo
      }
    });
  
    // Configurar opciones del correo
    let mailOptions = {
      from: 'santiagodlva@gmail.com', // Remitente
      to, // Destinatario
      subject, // Asunto
      text // Cuerpo del correo
    };
  
    try {
      // Enviar el correo
      await transporter.sendMail(mailOptions);
      res.json({ status: 'success', message: 'Correo enviado con éxito' });
    } catch (error) {
      console.log('Error al enviar correo:', error);
      res.status(500).json({ status: 'error', message: 'Error al enviar el correo' });
    }
  }

  async createDueno(req, res) {
    // Implementa la lógica para crear un nuevo plato
    const dueno = req.body;

    try {
      const duenoNuevo = await Dueno.create(dueno);

      res.status(201).json(Respuesta.exito(duenoNuevo, "Dueno insertado"));
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(Respuesta.error(null, `Error al crear un plato nuevo: ${dueno}`));
    }
  }

  async deleteDueno(req, res) {
    const iddueno = req.params.iddueno;
    try {
      const numFilas = await Dueno.destroy({ where: { id: iddueno } });
      if (numFilas == 0) {
        res.status(404).json(Respuesta.error(null, "No encontrado: " + iddueno));
      } else {
        res.status(204).json(Respuesta.exito(null, "Dueño eliminado"));
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(Respuesta.error(null, `Error al eliminar el dueño: ${iddueno}`));
    }
  }

  async updateDueno(req, res) {
    const dueno = req.body; // Recuperamos los datos del dueño a actualizar
    const idDueno = req.params.id; // ID del dueño desde la ruta
  
    // Validar que el ID en la ruta coincida con el ID en el objeto del cuerpo
    if (idDueno != dueno.id) {
      return res
        .status(400)
        .json({ error: "El ID del dueño no coincide con el de la ruta" });
    }
  
    try {
      const numFilas = await Dueno.update({ ...dueno }, { where: { id: idDueno } });
  
      if (numFilas == 0) {
        // No se encontró el dueño o no hubo cambios
        res.status(404).json({ error: "No encontrado o no modificado: " + idDueno });
      } else {
        // Al dar status 204, no se devuelve contenido
        res.status(204).send();
      }
    } catch (err) {
      console.error("Error al actualizar el dueño:", err);
      res
        .status(500)
        .json({ error: `Error al actualizar los datos: ${req.originalUrl}` });
    }
  }

  async getDuenoById(req, res) {
    const idDueno = req.params.id;
    try {
      const dueno = await Dueno.findByPk(idDueno);
      if (dueno) {
        res.json(Respuesta.exito(dueno, "Dueño recuperado"));
      } else {
        res.status(404).json(Respuesta.error(null, "Dueño no encontrado"));
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res.status(500).json(
        Respuesta.error(null, `Error al recuperar los datos: ${req.originalUrl}`)
      );
    }
  }
  

  
  
  
  
  



  // // Handles retrieval of a single type by its ID (implementation pending)
  // async getTipoById(req, res) {
  //   // Implementa la lógica para obtener un dato por ID (pendiente de implementar)
  //   const idtipo = req.params.idtipo;
  //   try {
  //     const data = await tipoService.getTipoById(idtipo); // Fetch all types from the service
  //     if(data.length > 0 ){
  //       res.json(Respuesta.exito(data, "Tipo recuperado"));
  //     } else {
  //       res.status(404).json(Respuesta.error(null, "Tipo no encontrado"));
  //     }

  //   } catch (err) {
  //     // Handle errors during the service call
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al recuperar los datos: ${req.originalUrl}`
  //         )
  //       );
  //   }
  // }

  // // Handles creation of a new type
  // async createTipo(req, res) {
  //   // Implementa la lógica para crear un nuevo dato
  //   const tipo = req.body;
  //   try {
  //     const idtipo = await tipoService.createTipo(tipo);
  //     // Relleno en el objeto que tenía el idtipo asignado
  //     // al insertar en la base de datos
  //     tipo.idtipo = idtipo;
  //     res.status(201).json(Respuesta.exito(tipo, "Tipo insertado"));
  //   } catch (err) {
  //     // Handle errors during the service call
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al recuperar los datos: ${req.originalUrl}`
  //         )
  //       );
  //   }

  // }

  // // Handles updating of a type by its ID (implementation pending)
  // async updateTipo(req, res) {
  //   const tipo = req.body; // Recuperamos datos para actualizar
  //   const idtipo = req.params.idtipo; // dato de la ruta
  //   try {
  //     const numFilas = await tipoService.updateTipo(tipo);

  //     if(numFilas == 0){ // No se ha encontrado lo que se quería actualizar
  //       res.status(404).json(Respuesta.error(null, "No encontrado: " + idtipo))
  //     } else{
  //       // Al dar status 204 no se devuelva nada
  //       res.status(204).json(Respuesta.exito(null, "Tipo actualizado"));
  //     }

  //   } catch (err) {
  //     // Handle errors during the service call
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al actualizar los datos: ${req.originalUrl}`
  //         )
  //       );
  //   }

  // }

  // // Handles deletion of a type by its ID (implementation pending)
  // async deleteTipo(req, res) {

  //   const idtipo = req.params.idtipo;
  //   try {
  //     const numFilas = await tipoService.deleteTipo(idtipo);
  //     if(numFilas == 0){ // No se ha encontrado lo que se quería borrar
  //       res.status(404).json(Respuesta.error(null, "No encontrado: " + idtipo))
  //     } else{
  //       res.status(204).json(Respuesta.exito(null, "Tipo eliminado"));
  //     }

  //   } catch (err) {
  //     // Handle errors during the service call
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al recuperar los datos: ${req.originalUrl}`
  //         )
  //       );
  //   }
  // }
}

module.exports = new DuenoController();

// Structure of result (MySQL)
// {
//   fieldCount: 0,
//   affectedRows: 1, // Number of rows affected by the query
//   insertId: 1,     // ID generated by the insertion operation
//   serverStatus: 2,
//   warningCount: 0,
//   message: '',
//   protocol41: true,
//   changedRows: 0   // Number of rows changed by the query
// }
