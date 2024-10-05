const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Actividad = require('../models/activity.model'); // Asegúrate de que la ruta sea correcta


// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER, // Tu correo de Hotmail
    pass: process.env.EMAIL_PASS
  },

  logger: true, // Habilita el logging
  debug: true // Muestra información adicional sobre el proceso
});

// Función para enviar recordatorios
const enviarRecordatorios = async () => {
  const hoy = new Date();
  const proximasActividades = await Actividad.find({
    fecha: { $gte: hoy, $lte: new Date(hoy.getTime() + 24 * 60 * 60 * 1000) },
  }).populate('inscritos'); // Rellena los inscritos

  proximasActividades.forEach(actividad => {
    actividad.inscritos.forEach(miembro => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: miembro.email, // Asegúrate de que el modelo Miembro tenga un campo de correo
        subject: `Recordatorio: ${actividad.nombre}`,
        text: `Te recordamos que la actividad "${actividad.nombre}" será el ${actividad.fecha}.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error al enviar el correo:', error);
        } else {
          console.log('Correo enviado:', info.response);
        }
      });
    });
  });
};

// Programar la tarea para que se ejecute cada día a las 8 AM
cron.schedule('0 8 * * *', enviarRecordatorios);

