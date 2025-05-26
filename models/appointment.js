const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    participants_student: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    participants_user: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
});

module.exports = mongoose.model('Appointment', appointmentSchema);

