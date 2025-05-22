const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const User = require('../models/user');

//Rendering the register page
router.get('/register', (req, res) => {
    res.render('users/register')
});


//Registering the user
router.post('/register', catchAsync(async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to yelp camp')
            res.redirect('/students')
        })

    } catch (e) {
        console.log(e.message);
        req.flash('error', e.message);
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
    res.redirect('/students')
})


//Logging out the user
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { 
            req.flash('error', 'Logout failed!');
            return res.redirect('/students');
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/students');
    });
})

module.exports = router;