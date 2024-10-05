const jwt = require('jsonwebtoken')
const Administrador = require('../models/administradores.model')

const auth = ( async (req, res, next) => {
    try {
       
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'laicosrd');

        const administrador= await Administrador.findOne({ _id: decode._id, 'tokens.token': token })
        if(!administrador) {
            throw Error()
        }

        req.token = token
        req.administrador = administrador
        next();
    }
    catch(e) {
        res.status(401).send({ error: 'Auth Error!'})
    }
    
})

module.exports = auth