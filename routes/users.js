const express = require('express');
const router = express.Router();
const catchAsync = require('../middlewares/catchAsync');
const passport = require('passport');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');


//Rendering the register page
router.get('/register', (req, res) => {
    res.render('users/register')
});


//Registering the user
router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    // ...other validations...
], catchAsync(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return validation errors
        return res.status(404).json({
            message: 'Validation failed'
        });
    }
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome')
            res.redirect('/calendar')
        })

    } catch (e) {
        if (e.code === 11000) {
            req.flash('error', 'Email already in use.');
        } else {
            req.flash('error', e.message);
        }
        return res.redirect('register');
    }

}))


//Rendering the login page
router.get('/login', (req, res) => {
    res.render('users/login')
});

//Logging in the user
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) => { 
    console.log(req.body);
    req.flash('success', 'welcome back!')
    res.redirect('/calendar')
})


//Logging out the user
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { 
            req.flash('error', 'Logout failed!');
            return res.redirect('/students');
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/'); // Redirect to home page
    });
})

module.exports = router;