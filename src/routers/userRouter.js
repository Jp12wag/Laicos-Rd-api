const express = require('express');
const User = require('../models/users');
const auth = require('../middleware/auth');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const router = new express.Router();

router.post('/', async (req, res) => {
    const user = new User(req.body);
    try {
        const secret = speakeasy.generateSecret();
        user.twoFactorSecret = secret.base32;

        await user.save();

        const otpauthUrl = secret.otpauth_url;
        qrcode.toDataURL(otpauthUrl, (err, data_url) => {
            if (err) {
                throw new Error('No se pudo generar el código QR');
            }
            res.status(201).send({ user, qrcode: data_url });
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        // Primero autentica al usuario con email y contraseña
        const user = await User.findByCredentials(req.body.email, req.body.password);
    
        // Verifica el código 2FA
        console.log('Secreto 2FA almacenado:', user.twoFactorSecret);
        console.log('Código 2FA recibido:', req.body.token);

        const isTwoFactorValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret, // El secreto almacenado en la base de datos
            encoding: 'base32',
            token: req.body.token // El código 2FA introducido por el usuario
        });

        if (!isTwoFactorValid) {
            console.log('Código 2FA incorrecto');
            return res.status(400).send({ error: 'Código 2FA incorrecto' });
        }
        console.log('Código 2FA correcto, generando token de sesión.');
        // Si todo es correcto, genera un token de sesión
        const token = await user.generateAuthToken();
        res.send({ user, token }).status(200);
    } catch (e) {
        console.error('Error en el proceso de autenticación:', e);
        res.status(400).send(e);
    }
});



// Revision
router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []

        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})


router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
  });
  router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }
  
    try {
      const user = req.user;
  
      updates.forEach(update => user[update] = req.body[update]);
  
      await user.save();
  
      res.send(user);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  
  router.delete('/users/me', auth, async (req, res) => {
    try {
      await req.user.remove();
      res.send(req.user);
    } catch (e) {
      res.status(500).send(e);
    }
  });
  

module.exports = router