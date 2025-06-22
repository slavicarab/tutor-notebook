const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const Student = require('../models/student');


router.get('/search', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const query = req.query.q?.toLowerCase() || '';
    if (!query) {
      return res.json([]);
    }
    const students = await Student.find({
      user: req.user._id,
      $or: [
        { 'name.first': { $regex: query, $options: 'i' } },
        { 'name.last': { $regex: query, $options: 'i' } }
      ]
    });
    console.log('Students found:', students); 
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
