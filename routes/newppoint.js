const express = require('express');
const router = express.Router();
const catchAsync = require('../middlewares/catchAsync');
const Student = require('../models/student');
const { isLoggedIn } = require('../middlewares/middleware');
const Appointment = require('../models/appointment')


// Route to render the new appointment form
router.get('/new', isLoggedIn, async (req, res) => {
    const students = await Student.find({ user: req.user._id }); // Fetch students associated with the logged-in user
    res.render('users/newappoint', { students });
});

// Route to create a new appointment
router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const { studentId } = req.body;
    const { date, startTime, endTime, note, status } = req.body.appointment;
    const user = req.user;
    const student = await Student.findById(studentId);
    if (!student) {
        req.flash('error', 'Student not found');
        return res.redirect('/students');
    }
    const appointment = new Appointment({ date, startTime, endTime, status, note, participants_student: [student._id], participants_user: [user._id] });
  

    await appointment.save();
    await Student.findByIdAndUpdate(
             student._id,
            { appointment: appointment._id },
            { new: true } 
        );
    req.flash('success', 'Appointment created successfully');
    res.redirect('/calendar');
}
));


module.exports = router;

