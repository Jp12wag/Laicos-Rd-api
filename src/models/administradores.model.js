const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const speakeasy = require('speakeasy'); // Para 2FA
const mongoose = require('mongoose')


const administradorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  sexo: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email incorrecto!')
      }
    }
  },
  passwordResetToken: {
    type: String,
    required: false
  },
  celular: {
    type: String,
    required: true
  },
  nacimiento: {
    type: Date,
    required: true
  },
  rolUsuario: {
    type: String,
    default: "miembro",
    required: false
  },
  foto: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: false,
    trim: true,
    minlength: [8, 'Minimo 8 caracteres'],
    validate(value) {
      if (value.includes('123456')) {
        throw new Error('Password inseguro')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  twoFactorSecret: {
    type: String,
    required: false // Este campo se utilizará para almacenar el secreto de 2FA
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  esMiembro: {
    type: Boolean,
    default: false
  }
})

administradorSchema.pre('save', async function (next) {
  const admin = this;

  if (admin.isModified('password')) {
    try {
      admin.password = await bcrypt.hash(admin.password, 8);
    } catch (error) {
      return next(error);
    }
  }

  next();
});

administradorSchema.methods.toJSON = function () {
  const admin = this
  const adminObject = admin.toObject()

  delete adminObject.password
  delete adminObject.tokens

  return adminObject
}
// Método para generar dos factores
administradorSchema.methods.enableTwoFactorAuth = function () {
  const secret = speakeasy.generateSecret({ length: 20 });
  this.twoFactorSecret = secret.base32; // Almacena solo el secreto
  return secret;
};

// Método para generar token de autenticación
administradorSchema.methods.generateAuthToken = async function () {
  const admin = this;
  const token = jwt.sign({ _id: admin._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
  admin.tokens = admin.tokens.concat({ token });
  await admin.save();
  return token;
};

administradorSchema.statics.findByCredentials = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error('Credenciales inválidas');
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  return admin;
};

administradorSchema.methods.verifyTwoFactorToken = function (token) {
  if (!this.twoFactorSecret) {
    throw new Error('2FA no está habilitado para este administrador');
  }

  return speakeasy.totp.verify({
    secret: this.twoFactorSecret,
    encoding: 'base32',
    token
  });
};

administradorSchema.methods.generatePasswordResetToken = function () {
  const resetToken = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  this.passwordResetToken = resetToken;
  
  return resetToken;
};

administradorSchema.statics.findByPasswordResetToken = function (token) {
  console.log(this. passwordResetToken);
  return this.findOne({ passwordResetToken: token });
};


const Admin = mongoose.model('admin', administradorSchema)

module.exports = Admin;