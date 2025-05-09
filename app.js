const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
const methodOverride = require('method-override');
const Student = require('./models/student');

mongoose.connect('mongodb://127.0.0.1:27017/tutor-notebook', {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
    
const app = express();


app.engine('ejs', ejsMate); // Use ejs-mate for layout support
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


//Get to the home page
app.get('/', (req, res) => {
    res.render('home')});

//Getting all the students
app.get('/students', async (req, res) => {
    const students = await Student.find({});
    res.render('students/index', { students } );
});



//Adding a student
app.get('/students/new', async (req,res) => {
    res.render('students/new');
})

app.post('/students', async (req, res) => {
    const student = new Student(req.body.student);
    await student.save();
    res.redirect(`students/${student._id}`); // Redirect to the newly created student's page
    //res.redirect('/students'); // Redirect to the list of students
});


//Editting a student
app.get('/students/:id/edit', async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('students/edit', { student });
});

app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, { ...req.body.student });
    res.redirect(`/students/${student._id}`)
})


//Deleting a student
app.delete('/students/:id', async (req, res) => {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.redirect('/students')
})


 //Getting one student
 app.get('/students/:id', async (req,res) => {
    const student = await Student.findById(req.params.id)
    res.render('students/show', { student });
})
 




// Route to get a single student by ID
/* app.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        res.render('students/show', { student });
    } catch (err) {
        console.error(err);
        res.status(404).send('Student not found');
    }
}); */


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});