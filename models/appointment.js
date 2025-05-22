const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String
    },
    note: {
        type: String
    },
    status: {
        type: String,
        enum: ['booked', 'held', 'cancelled'],
        default: 'booked'
    },
});

module.exports = mongoose.model('Appointment', appointmentSchema);

