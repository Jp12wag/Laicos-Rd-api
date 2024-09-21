const Administrador = require('../models/administradores.model');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');

const controllers = {};

controllers.createAdministrador = async (req, res) => {
  const administrador = new Administrador(req.body);


  const passSinAuth=administrador.password;
  try {
      const secret = speakeasy.generateSecret();
     
      administrador.twoFactorSecret = secret.base32;
     
      await administrador.save();
   
      const otpauthUrl = secret.otpauth_url;
      const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);
     
      // Configuración del transportador de Nodemailer
      const transporter = nodemailer.createTransport({
          host: 'smtp-mail.outlook.com', // Cambiado a smtp-mail.outlook.com para Hotmail
          port: 587, // Usa el puerto 587 para conexiones TLS
          secure: false, // Usa false para 587 (TLS)
          auth: {
              user: 'wagner12alcantara@hotmail.com', // Tu correo de Hotmail
              pass: 'JP1212@11' // Tu contraseña (asegúrate de no exponer esto en producción)
          },
          tls: {
              rejectUnauthorized: false // Evitar problemas con certificados
          }
      });

      // Opciones del correo
      const mailOptions = {
          from: 'wagner12alcantara@hotmail.com',
          to: administrador.email, // El correo del usuario registrado
          subject: 'Código QR y 2FA para tu cuenta',
          html: `
              <p>Hola ${administrador.nombre},</p>
              <p>Gracias por registrarte. Aquí tienes tu código de autenticación en dos pasos y tu código QR:</p>
               <p><strong>su email: ${administrador.email} password: ${passSinAuth} </strong></p>
              <p><strong>Código 2FA: ${secret.base32}</strong></p>
              <p>Escanea el siguiente código QR con tu aplicación de autenticación:</p>
              <p><img src="${qrCodeDataUrl}" alt="Código QR de 2FA" /></p>
          `
      };

      // Enviar el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log('Error al enviar el correo:', error);
              return res.status(500).send({ message: 'Error al enviar el correo.' });
          }
          console.log('Correo enviado: ' + info.response);

          // Responder después de que el correo se haya enviado
          return res.status(201).send({ administrador, qrcode: qrCodeDataUrl });
      });

  } catch (e) {
      res.status(400).send(e);
  }
};





controllers.getAdministradores = async (req, res) => {
  try {
    const administradores = await Administrador.find();
    res.status(200).json(administradores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.getAdministradorById = async (req, res) => {
  try {
    const administrador = await Administrador.findById(req.params.id);
    if (!administrador) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    res.status(200).json(administrador);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

controllers.loginAdministrador = async (req, res) => {
  try {
      const administrador = await Administrador.findByCredentials(req.body.email, req.body.password);
  
      if (!administrador) {
          return res.status(400).send({ error: 'Credenciales incorrectas' });
      }

      // Verifica si el usuario tiene 2FA habilitado
      if (administrador.twoFactorSecret) {
          // Aquí se debe esperar el código 2FA del cliente
          return res.status(200).send({ twoFactorRequired: true, administrador }); // Indica que se requiere 2FA
      }

      // Generar token si no se requiere 2FA
      const token = await administrador.generateAuthToken();
      res.status(200).send({ administrador, token, twoFactorRequired: false });

  } catch (e) {
      // Manejo de errores específico
      if (e.message.includes('Invalid login credentials')) {
          return res.status(401).send({ error: 'Credenciales inválidas' });
      }
      console.error(e); // Registrar el error para el desarrollo
      res.status(500).send({ error: 'Ocurrió un error al iniciar sesión.' });
  }
};

// Nuevo controlador para verificar el código 2FA
controllers.verifyTwoFactor = async (req, res) => {
  try {
      const administrador = await Administrador.findById(req.body.administradorId); // Asegúrate de pasar el administradorId correcto
      const twoFactorCode = req.body.token; // Código 2FA ingresado por el usuario
      const isVerified = administrador.verifyTwoFactorToken(twoFactorCode);
      if (!isVerified) {
          return res.status(401).send({ error: 'Código 2FA inválido' });
      }

      // Generar token después de verificar el 2FA
      const token = await administrador.generateAuthToken();
      res.status(200).send({ administrador, token });

  } catch (e) {
      console.error(e);
      res.status(500).send({ error: 'Ocurrió un error al verificar el código 2FA.' });
  }
};

// Logout del usuario actual
controllers.logoutadministrador = async (req, res) => {
  try {
      req.administrador.tokens = req.administrador.tokens.filter((token) => token.token !== req.token);
      await req.administrador.save();
      res.send();
  } catch (e) {
      res.status(500).send(e);
  }
};





controllers.updateAdministrador = async (req, res) => {
  try {
    const administradorActualizado = await Administrador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!administradorActualizado) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    res.status(200).json(administradorActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

controllers.deleteAdministrador = async (req, res) => {
  try {
    const administrador = await Administrador.findByIdAndDelete(req.params.id);
    if (!administrador) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    res.status(200).json({ message: 'Administrador eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = controllers;