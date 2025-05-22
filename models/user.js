const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
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

});



UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema);