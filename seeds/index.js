
const mongoose = require('mongoose');
const seed = require('./seed');
const { students } = require('./seed');
const Student = require('../models/student');


mongoose.connect('mongodb://127.0.0.1:27017/tutor-notebook', {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const seedDB = async () => {   
    await Student.deleteMany({})
    students.forEach(async (student) => {
        const newStudent = new Student(student);
        await newStudent.save();
    });
    console.log('Database seeded!');
}


seedDB().then(() => {
    mongoose.connection.close();
});