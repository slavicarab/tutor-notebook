const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const student = require('./student');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type: String,
        unique: true,
    },
    name: {
        type: String,
        trim: true,
    },
    address: { 
        type: String,
        trim: true
    },
    student: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],

});



UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema);