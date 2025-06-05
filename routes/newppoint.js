const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Student = require('../models/student');
const { isLoggedIn } = require('../middleware');


// Route to render the new appointment form
router.get('/new', isLoggedIn, async (req, res) => {
    const students = await Student.find({});
    res.render('users/newappoint', { students });
});

// Route to create a new appointment
router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const { studentId } = req.body;
    const { date, startTime, endTime, note, status } = req.body.appointment;
    const student = await Student.findById(studentId);
    if (!student) {
        req.flash('error', 'Student not found');
        return res.redirect('/students');
    }
    const appointment = {
        date,
        startTime,
        endTime,
        note,
        status,
        student: student._id
    };
    student.appointment.push(appointment);
    await student.save();
    req.flash('success', 'Appointment created successfully');
    res.redirect('/calendar');
}
));


module.exports = router;

