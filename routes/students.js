const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Student = require('../models/student');
const Appointment = require('../models/appointment')
const { studentSchema, appointmentSchema } = require('../schemas.js');
const Joi = require('joi');
const appointment = require('../models/appointment');
//const { isLoggedIn } = require('../middleware');


//Validation middleware for students
const validateStudent = (req, res, next) => {

    const { error } = studentSchema.validate(req.body);
    if(error){
        const msg = error.details.map (el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next()
    }
}

//Validation middleware for appointments
const validateAppointment = (req, res, next) => {
    const { error } = appointmentSchema.validate(req.body);
    if(error){
        console.log(error);
        const msg = error.details.map (el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next()
    }
}

// Getting all the students
router.get('/', catchAsync(async (req, res) => {
    const students = await Student.find({ user: req.user._id });
    res.render('students/index', { students });
}));

// Adding a student
router.get('/new', (req, res) => {
    res.render('students/new');
});

router.post('/', validateStudent, catchAsync(async (req, res, next) => {
    const student = new Student(req.body.student);
    student.user = req.user._id; // <-- Set the user reference
    await student.save();

    // Optionally update the user as well
    const User = require('../models/user');
    await User.findByIdAndUpdate(req.user._id, { student: student._id });

    req.flash('success', 'Successfully added a new student!');
    res.redirect('students');
}));

// Editing a student
router.get('/:id/edit', catchAsync(async (req, res, next) => {
    
    const student = await Student.findById(req.params.id);
    res.render('students/edit', { student });
}));

router.put('/:id', validateStudent, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, { ...req.body.student });
    req.flash('success', 'Successfully updated student!');
    res.redirect(`/students/${student._id}`);
}));

// Deleting a student
router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted student!');
    res.redirect('/students');
}));


//Adding an appointment to a student
router.post('/:id/appointment', validateAppointment, catchAsync(async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id);
    const user = req.user;

    // Validate that the required fields are present
    const { date, startTime, endTime, description, status, note } = req.body.appointment;
    if (!date || !startTime) {
        throw new ExpressError('Date and Start Time are required', 400);
    }

    
    const appointment = new Appointment({ date, startTime, endTime, description, status, note, participants_student: [student._id], participants_user: [user._id] });
    console.log(appointment)
    student.appointment.push(appointment);
    await appointment.save();
    await student.save();
    req.flash('success', 'Successfully added an appointment!');
    res.redirect(`/students/${student._id}`);
}));


//Editing an appointment
router.put('/:id/appointment/:appointment_id', validateAppointment, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { appointment_id } = req.params;
    const student = await Student.findById(id);
    const appointment = await Appointment.findById(appointment_id);
    const { date, startTime, endTime, description, status, note } = req.body.appointment;
    if (!date || !startTime) {
        throw new ExpressError('Date and Start Time are required', 400);
    }
    appointment.date = date;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.description = description;
    appointment.status = status;
    appointment.note = note;
    await appointment.save();
    await student.save();
    req.flash('success', 'Successfully updated appointment!');
    res.redirect(`/students/${student._id}`);

}));

// Getting one student
router.get('/:id', catchAsync(async (req, res) => {
    const student = await Student.findById(req.params.id).populate('appointment');
    if (!student) {
        req.flash('error', 'Student not found');
        return res.redirect('/students');
    }
    // Now student.appointment is an array of appointment documents
    const appointments = (student.appointment || []).filter(app => app.status === 'booked');
    console.log(student.appointment);
    res.render('students/show', { student, appointments });
}));

module.exports = router;