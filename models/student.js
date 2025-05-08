const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const studentSchema = new Schema({
    name: {
        first: { type: String, required: true, trim: true },
        last: { type: String, required: true, trim: true },
    },
    age: {
        kindergarten: {
            age: { type: String, min: 2, max: 6 },
        },
        primary_school: {
            grade: { type: String, min: 1, max: 4 },
            school: { type: String, trim: true },
        },
        secondary_school: {
            grade: { type: String, min: 1, max: 8 },
            school: { type: String, trim: true },
        },
    },
    email: { 
        type: String, required: true,
        lowercase: true, trim: true
    },
    address: { 
        type: String,
        trim: true
    },
    phoneNumber: { 
        type: String
    },
    parent: {
        name: { type: String, trim: true },

        phoneNumber: { type: String },
    },
    description: { 
        type: String, trim: true 
    },
    active: {
        type: Boolean, default: true 
    },
    createdAt: { 
        type: Date, default: Date.now 
    },
    updatedAt: { 
        type: Date, default: Date.now 
    }
});

module.exports = mongoose.model('Student', studentSchema);