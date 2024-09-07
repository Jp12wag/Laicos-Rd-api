const express = require('express');
const Member = require('../models/Member');

const router = express.Router();

// Ruta para registrar un miembro
router.post('/', async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar miembro', error });
  }
});

module.exports = router;
