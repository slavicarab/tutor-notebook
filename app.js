//importing the required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const morgan = require('morgan');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user');
const session = require('express-session');
const flash = require('connect-flash');
const { isLoggedIn } = require('./middlewares/middleware');




const studentRoutes = require('./routes/students');
const userRoutes = require('./routes/users');
const calendarRoutes = require('./routes/calendar');
const billRoutes = require('./routes/bills');
const newppointRoutes = require('./routes/newppoint');
const searchRoutes = require('./routes/api');



//Creating the express app
const app = express();


//Connecting to the database
mongoose.connect('mongodb://127.0.0.1:27017/tutor-notebook', {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useCreateIndex: true,
    //useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
    

//Setting up the view engine
app.engine('ejs', ejsMate); // Use ejs-mate for layout support
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//Caling the modules
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory
app.use('/bills', express.static(path.join(__dirname, 'bills')));



//Session configuration
const sessionConfig = {
    secret: 'yourSecretKey', 
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    }
   
}
app.use(session(sessionConfig));
app.use(flash());


//Passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware to set flash messages and current user
app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


//Routes

app.use('/students', isLoggedIn, studentRoutes);
app.use('/calendar', isLoggedIn, calendarRoutes);
app.use('/bills', isLoggedIn, billRoutes); 
app.use('/api', isLoggedIn, searchRoutes);
app.use('/newppoint', newppointRoutes);
app.use('/', userRoutes);




//Get to the home page
app.get('/', (req, res) => {
    res.render('home')});

// Get to the dashboard page
// app.get('/dashboard', (req, res) => {
//   res.render('dashboard'); // or similar
// });


// Middleware to handle 404 errors
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})


// Middleware to handle 404 errors
app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err });
   
});     

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
