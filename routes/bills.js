const express = require('express');
const router = express.Router();
const catchAsync = require('../middlewares/catchAsync.js');
const ExpressError = require('../utils/ExpressError');
const Student = require('../models/student');
const Appointment = require('../models/appointment')
const { studentSchema, appointmentSchema } = require('../models/schemas.js');
const Bill = require('../models/bill');
const Joi = require('joi');
const createPdf = require('../utils/createPdf');
const path = require('path');



// Adding a bill 
router.get('/new', catchAsync(async (req, res) => {
// Find appointments for this student
    const appointments = await Appointment.find({
        participants_user: req.user._id,
        status: { $in: ['held', 'cancelled'] },
        isIssued: false
    }).populate('participants_student', 'name');
    res.render('bills/newbill', { appointments });
}));

router.post('/new', catchAsync(async (req, res) => {
  try {
    const { studentName, date, status, duration, amount, studentId, appointmentId } = req.body;

    const bill = new Bill({
      date,
      amount,
      duration,
      appointment: appointmentId,
      student: studentId,
      user: req.user._id
    });

    await bill.save();

    await Appointment.findByIdAndUpdate(
      appointmentId,
      { isIssued: true },
      { new: true }
    );

    req.flash('success', 'Bill created successfully');
    res.json({ success: true });

  } catch (err) {
    console.error('❌ Error while creating bill:', err.message);
    res.status(500).send('Server error');
  }
}));

//Listing all the bills
 router.get('/', catchAsync(async (req, res) => {
    const bills = await Bill.find({ user: req.user._id }).populate('student');
    console.log(bills);
    res.render('bills/listbill', { bills });
})); 

//Cange status of bill
router.put('/update-status', catchAsync(async (req, res) => {
    const { billId, status } = req.body;

    // Validate the status
    const validStatuses = ['paid', 'unpaid', 'overdue'];
    if (!validStatuses.includes(status)) {
        throw new ExpressError('Invalid status', 400);
    }

    // Update the bill status
    const updatedBill = await Bill.findByIdAndUpdate(
        billId,
        { status },
        { new: true }
    );

    if (!updatedBill) {
        throw new ExpressError('Bill not found', 404);
    }
    req.flash('success', 'Bill status updated successfully');
    res.json({ success: true, updatedBill });
}));    

// Download bill as PDF
router.post('/generate-bill', (req, res) => {
  const billData = req.body; 
  const outputPath = path.join(__dirname, '../bills', `bill_${billData.billNumber}.pdf`);
  createPdf(billData, outputPath);

  res.json({ message: 'PDF generated', file: `/bills/bill_${billData.billNumber}.pdf` });
});







module.exports = router;


