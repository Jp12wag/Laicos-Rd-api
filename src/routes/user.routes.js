const express = require('express')
const auth = require('../middleware/auth')
const controllers = require('../controllers/user.controller')

const router = new express.Router()

router.post('/', controllers.createUser)

router.post('/users/login', controllers.loginUser)

router.post('/users/logout', auth, controllers.logoutUser)

router.post('/users/logoutAll', auth, controllers.logoutAllUsers)

router.get('/users/me', auth, controllers.getUserProfile)

router.patch('/users/me', auth, controllers.updateUserProfile)

router.delete('/users/me', auth, controllers.deleteUserProfile)

module.exports = router