const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const speakeasy = require('speakeasy'); // Para 2FA


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true
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
  email: {
    type: String,
    unique: true,
    required: false,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email incorrecto!')
      }
    }
  },
  roles: {
    type: String,
    required: true
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
  }
})
userSchema.pre('save', async function (next) {
  const user = this;

  // Hashea la contraseña solo si ha sido modificada o si es nueva
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

// Método para generar token de autenticación
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'laicosrd', { expiresIn: '1h' });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Método para encontrar usuario por credenciales
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new Error('Credenciales inválidas');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }
  console.log(user);
  return user;
};

// Método para verificar el token 2FA
userSchema.methods.verifyTwoFactorToken = function (token) {
  
  return speakeasy.totp.verify({
    secret: this.twoFactorSecret,
    encoding: 'base32',
    token
  });
};

const User = mongoose.model('users', userSchema)

module.exports = User