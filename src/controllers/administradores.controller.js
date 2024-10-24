require('dotenv').config();
const Administrador = require('../models/administradores.model');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const controllers = {};

controllers.createAdministrador = async (req, res) => {
  try {
    const administrador = new Administrador(req.body);
    
    // Guarda el nuevo administrador
    await administrador.save();

    // Configuración del transportador de Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER, // Tu correo de Hotmail
        pass: process.env.EMAIL_PASS // La contraseña de tu correo
      },
      logger: true, // Habilita el logging
      debug: true // Muestra información adicional sobre el proceso
    });

    // Opciones del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: administrador.email, // El correo del usuario registrado
      subject: 'Registro exitoso',
      html: `
              <p>Hola ${administrador.nombre},</p>
              <p>Gracias por registrarte  en nuestra plataforma.</p>
              <p>Tu cuenta ha sido creada exitosamente. Puedes iniciar sesión utilizando tus credenciales.</p>
              <p>Saludos,</p>
              <p>El equipo de la </p>
          `
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error);
        return res.status(500).send({ message: 'Error al enviar el correo.' });
      }
      console.log('Correo enviado: ' + info.response);
      
      // Responder con el administrador creado
      return res.status(201).send({ administrador });
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


     // Si el administrador tiene 2FA habilitado
     if (administrador.isTwoFaEnabled && administrador.twoFactorSecret) {
      // Enviar respuesta indicando que se requiere 2FA
      return res.status(200).send({ twoFactorRequired: true, message: 'Se requiere 2FA. Por favor, ingresa tu código de autenticación.', administradorId: administrador._id });
    }
    // Generar token si no se requiere 2FA
    const userAgent = req.headers['user-agent'];
    const token = await administrador.generateAuthToken(userAgent);
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

    const userAgent = req.headers['user-agent'];
    const token = await administrador.generateAuthToken(userAgent);

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
   
    const administradorActualizado = await Administrador.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!administradorActualizado) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    administradorActualizado.markModified('password');
    administradorActualizado.save();
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
controllers.verificarToken = async (req, res) => {
  try {
    
    const { isTwoFaEnabled, } = req.body; // Asegúrate de recibir también el ID del usuario
    const userId = req.administrador._id; 
   
    // Encontrar al administrador por su ID
    const administrador = await Administrador.findById(userId);

    if (!administrador) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    const secret = speakeasy.generateSecret({ length: 20 });  
    // Si se habilita 2FA, generar una clave secreta
    if (isTwoFaEnabled && !administrador.twoFactorSecret) {
      administrador.twoFactorSecret = secret.base32; // Guardar la nueva clave 2FA
    } else if (!isTwoFaEnabled) {
      // Si se desactiva 2FA, limpiar la clave secreta
      administrador.twoFactorSecret = null; 
    }

    // Actualizar la configuración de 2FA
    administrador.isTwoFaEnabled = isTwoFaEnabled;

    // Guardar los cambios en la base de datos
    await administrador.save();

    // Si se habilitó 2FA, enviar el QR al correo del administrador
    if (isTwoFaEnabled) {
      const otpauthUrl = secret.otpauth_url;
      const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

      // Configuración del transportador de Nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: 2525,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        logger: true,
        debug: true
      });

      // Opciones del correo
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: administrador.email,
        subject: 'Código QR y 2FA para tu cuenta',
        html: `
          <p>Hola ${administrador.nombre},</p>
          <p>Codigo en dos Factores ${administrador.twoFactorSecret},</p>
          <p>Tu autenticación en dos pasos ha sido habilitada. Escanea el siguiente código QR:</p>
          <p><img src=${qrCodeDataUrl} alt="Código QR de 2FA" /></p>
        `
      };

      // Enviar el correo electrónico
      await transporter.sendMail(mailOptions);
    }

    // Responder con éxito
    res.status(200).json({ message: 'Configuración de seguridad actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la configuración de seguridad:', error);
    res.status(500).json({ message: 'Error al actualizar la configuración de seguridad' });
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
    const resetToken = await administrador.generatePasswordResetToken();
    //cambiar logica de para buscar el token 
    // Configuración del transportador de Nodemailer
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
  // Encripta la nueva contraseña
   //administrador.password = await bcrypt.hash(newPassword);
    // Actualiza la contraseña
    administrador.password = newPassword;
    administrador.markModified('password');
     // Elimina el token de restablecimiento
     administrador.passwordResetToken = null; 
     administrador.passwordResetTokenExpires = null; // También elimina la expiración
    await administrador.save();

    res.status(200).send({ message: 'Contraseña restablecida con éxito.' });

  } catch (error) {
    res.status(500).send({ error: 'Ocurrió un error al restablecer la contraseña.' });
  }
};

controllers.getSessions = async (req, res) => {
  try {

    const adminId = req.params.id; // Asegúrate de que la ID del administrador esté disponible

    const administrador = await Administrador.findById(adminId);


    if (!administrador) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    const sessions = administrador.tokens.map(token => ({
      ...token,
      createdAt: administrador.updatedAt // Asegúrate de que existe este campo
    }));
    console.log(sessions);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sesiones', error });
  }
};


module.exports = controllers;