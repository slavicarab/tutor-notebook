const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');



router.get('/', catchAsync(async (req, res) => {
    const students = await Student.find({ user: req.user._id }).populate('appointment');
    // Collect all appointments with student reference
    let appointments = [];
    students.forEach(student => {
        (student.appointment || []).forEach(app => {
            if (app.status === 'booked') {
                appointments.push({
                    ...app.toObject(),
                    student // add the student object for linking
                });
            }
        });
    });
    // Sort by date (and optionally by startTime)
    appointments.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + (a.startTime || '00:00:00'));
        const dateB = new Date(b.date + 'T' + (b.startTime || '00:00:00'));
        return dateA - dateB;
    });
    res.render('calendar', { students, appointments });
}));

module.exports = router;