const express = require('express');
const router = express.Router();
const catchAsync = require('../middlewares/catchAsync');
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
    appointments = JSON.stringify(appointments.map(function(app) {
    const date = new Date(app.date);
    const dateStr = date.toISOString().slice(0, 10);
    let title = '';
    if (app.student && typeof app.student === 'object') {
      if (app.student.name.first) title += app.student.name.first;
      if (app.student.name.last) title += ' ' + app.student.name.last;
      if (!app.student.name.first && !app.student.name.last && app.student.name) title += app.student.name;
    }
    if (app.description) title += ': ' + app.description;
    return {
      title: title.trim(),
      start: dateStr + (app.startTime ? 'T' + app.startTime : ''),
      url: '/students/' + (app.student && app.student._id ? app.student._id : '')
    };
  }))
  console.log(appointments);
    res.render('calendar', {  appointments });
}));

module.exports = router;