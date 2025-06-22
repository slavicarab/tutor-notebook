const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./counter'); 

const billSchema = new mongoose.Schema({
    billNumber: { 
        type: Number, 
        unique: true 
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid', 'overdue'],
        default: 'unpaid'
    },
    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

billSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'bill' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // create if not exists
    );

    this.billNumber = counter.seq;
  }
  next();
});

module.exports = mongoose.model('Bill', billSchema);