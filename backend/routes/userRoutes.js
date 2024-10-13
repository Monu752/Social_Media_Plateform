const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const { name, socialMediaHandle } = req.body;
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const user = new User({
      name,
      socialMediaHandle,
      images: imagePaths
    });

    await user.save();
    res.status(201).json({ message: 'User submitted successfully', user });
  } catch (error) {
    console.error('Error submitting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
