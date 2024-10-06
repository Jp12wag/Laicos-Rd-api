const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Actividad = require('../models/activity.model'); // Asegúrate de que la ruta sea correcta
const Adminstrador = require('../models/administradores.model');
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

  const ahora = new Date();
  const diferenciaDeZonaHoraria = ahora.getTimezoneOffset() * 60000; // Diferencia en milisegundos
  const hoy = new Date(ahora.getTime() - diferenciaDeZonaHoraria); // Ajuste de zona horaria

  hoy.setUTCHours(0, 0, 0, 0); // Inicio del día UTC

  const manana = new Date(hoy.getTime() + 24 * 60 * 60 * 1000); // Fin del día siguiente
  console.log('Buscando entre:', hoy.toISOString(), 'y', manana.toISOString());

  const proximasActividades = await Actividad.find({
    fecha: { $gte: hoy, $lt: manana }
  }).populate('inscritos');

  console.log(proximasActividades);
  if (proximasActividades.length === 0) {
    console.log('No se encontraron actividades para hoy.');
  } else {
    console.log('Actividades encontradas:', proximasActividades);
  }

  proximasActividades.forEach(actividad => {
    actividad.inscritos.forEach(miembro => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: miembro.email, // Asegúrate de que el modelo Miembro tenga un campo de correo
        subject: `Recordatorio: ${actividad.nombre}`,
        html: `
  <div style="text-align: center;">
    <h3>Recordatorio de Actividad</h3>
    <p>Estimado/a,</p>
    <p>Te recordamos que la actividad <strong>"${actividad.nombre}"</strong> se llevará a cabo el <strong>${new Date(actividad.fecha).toISOString().split('T')[0]}</strong>.</p>
    <p><strong>Ubicación:</strong> ${actividad.ubicacion}</p>
    <p><strong>Descripción:</strong> "${actividad.descripcion}"</p>
    <p>Esperamos contar con tu participación.</p>
    <p>Atentamente,</p>
    <p>El equipo organizador</p>
  </div>
`

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
cron.schedule('44 9 * * *', enviarRecordatorios);

