const User = require('../models/users.model');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const controllers = {};

// Crear nuevo usuario con 2FA
controllers.createUser = async (req, res) => {
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
};

// Login con autenticación 2FA
controllers.loginUser = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
    
        const isTwoFactorValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: req.body.token
        });

        if (!isTwoFactorValid) {
            return res.status(400).send({ error: 'Código 2FA incorrecto' });
        }

        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
};

// Logout del usuario actual
controllers.logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
};

// Logout de todas las sesiones del usuario actual
controllers.logoutAllUsers = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
};

// Obtener perfil de usuario
controllers.getUserProfile = async (req, res) => {
    res.send(req.user);
};

// Actualizar perfil de usuario
controllers.updateUserProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Actualizaciones no válidas' });
    }

    try {
        const user = req.user;
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
};

// Eliminar usuario
controllers.deleteUserProfile = async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
};

module.exports = controllers;