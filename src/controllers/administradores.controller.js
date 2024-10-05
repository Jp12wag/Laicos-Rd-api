require('dotenv').config();
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
        host: process.env.HOST,
        port:2525,
        auth: {
          user: process.env.EMAIL_USER, // Tu correo de Hotmail
          pass: process.env.EMAIL_PASS 
        },
        
        logger: true, // Habilita el logging
        debug: true // Muestra información adicional sobre el proceso
      });

      // Opciones del correo
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: administrador.email, // El correo del usuario registrado
          subject: 'Código QR y 2FA para tu cuenta',
          html: `
              <p>Hola ${administrador.nombre},</p>
              <p>Gracias por registrarte. Aquí tienes tu código de autenticación en dos pasos y tu código QR:</p>
               <p><strong>su email: ${administrador.email} password: ${passSinAuth} </strong></p>
              <p><strong>Código 2FA: ${secret.base32}</strong></p>
              <p>Escanea el siguiente código QR con tu aplicación de autenticación:</p>
              <p><img src=${qrCodeDataUrl} alt="Código QR de 2FA" /></p>
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
    console.log(req.body.administradorId);
      const administrador = await Administrador.findById(req.body.administradorId); // Asegúrate de pasar el administradorId correcto
      const twoFactorCode = req.body.token; // Código 2FA ingresado por el usuario
    console.log(twoFactorCode);
      const isVerified = administrador.verifyTwoFactorToken(twoFactorCode);
      console.log(isVerified);
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

//cerrar toda las sessiones

controllers.logoutAllAdministrador = async (req, res) => {
  try {
      // Vacia todos los tokens del administrador
      console.log('Antes:', req.administrador.tokens);
      req.administrador.tokens = [];
      
      // Guarda los cambios en la base de datos
      await req.administrador.save();
      
      // Envía una respuesta de éxito
      res.send({ message: 'Sesión cerrada en todos los dispositivos.' });
  } catch (e) {
      // Si hay un error, devuelve una respuesta con el error
      res.status(500).send(e);
  }
};

controllers.updateAdministrador = async (req, res) => {
  try {
    console.log(req.params.id, req.body);
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


controllers.requestResetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const administrador = await Administrador.findOne({ email });
   
    if (!administrador) {
      return res.status(404).send({ error: 'Administrador no encontrado' });
    }
    // Generar un token para el restablecimiento de contraseña (puedes usar JWT o cualquier otro mecanismo)
    const resetToken =  await administrador.generatePasswordResetToken();
    //cambiar logica de para buscar el token 
    // Configuración del transportador de Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port:2525,
      auth: {
        user: process.env.EMAIL_USER, // Tu correo de Hotmail
        pass: process.env.EMAIL_PASS 
      },
      
      logger: true, // Habilita el logging
      debug: true // Muestra información adicional sobre el proceso
    });
//verificar variable globales


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: administrador.email,
      subject: 'Restablecer contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="http://localhost:3000/reset-password/${resetToken}">Restablecer contraseña</a>`
    };

   
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Error al enviar correo:', error);
      }
      console.log('Correo enviado:', info.response);
    });

    res.status(200).send({ message: 'Correo de restablecimiento de contraseña enviado.' });

  } catch (error) {
    res.status(500).send({ error: 'Ocurrió un error al enviar el correo de restablecimiento.' });
  }
};

controllers.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  try {
    // Busca al administrador por el token y verifica que sea válido
    const administrador = await Administrador.findByPasswordResetToken(token);
    console.log(administrador);
    if (!administrador) {
      return res.status(400).send({ error: 'Token de restablecimiento inválido o expirado.' });
    }

    // Actualiza la contraseña
    administrador.password = newPassword;
    administrador.tokens = null; // Elimina el token de restablecimiento
    await administrador.save();

    res.status(200).send({ message: 'Contraseña restablecida con éxito.' });

  } catch (error) {
    res.status(500).send({ error: 'Ocurrió un error al restablecer la contraseña.' });
  }
};

module.exports = controllers;