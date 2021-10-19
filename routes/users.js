// We will use express, so we bring that in with require
const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const passport = require('passport')

const router = express.Router()

// User model
const user = require('../models/User')

// Login Page
router.get('/login',(req,res,next)=>{ res.render('login') })

// Register Page
router.get('/register',(req,res,next)=>{ res.render('register') })

// Register Handle
router.post('/register',(req, res) =>{
    // Pulling some variables from req.body
    const { name, email, password, password2 } = req.body
    // For validation let us first create an array
    let errors = []

    // Check required fields
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please fill in all fields' })
    }

    // Check passwords match
    if(password != password2){
        errors.push({ msg: 'Password do not match' })
    }

    // Check password length
    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters' })
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    // User exists
                    errors.push({ msg: 'Email is already regsitered' })
                    res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                    })

                } else{
                    // User is not system hence, create a new user
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err
                            // Set password to hashed password
                            newUser.password = hash
                            // Save user in db
                            newUser.save()
                            // Gives us a promise
                                // if it worked, then() will give us the user
                                .then(user => {
                                    // We want to redirect to login
                                    // But before we want to display the messages using flash
                                    req.flash('success_msg', 'You are now registered and can login')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        })
                    )
                    console.log(newUser)
                    //res.send('new user')
                }
            })
        // res.send('pass')
    }
    //console.log(req.body)
})

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})

// This module.exports will allow us to use router.get() somewhere else(in other .js file)
module.exports = router;