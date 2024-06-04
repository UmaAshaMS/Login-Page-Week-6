const express = require('express');
const user = express.Router()
const dotenv = require('dotenv').config()
const path = require('path');
const bodyparser = require("body-parser");
const { v4: uuid4 } = require("uuid");
const session = require('express-session');
const { mongoose, User } = require("../config");
const { Console } = require('console');
const bcrypt = require('bcrypt');

const saltRounds = 10;

user.get('/login', (req, res) => {
    res.render('user/login', { message: '', title: "Login Page" })
})

user.get('/signUp', (req, res) => {
    res.render('user/signUp', { message: '', title: "Sign-Up" })
})

user.get('/', (req, res) => {
    res.send("/user home (root path of userRouter)")
})

user.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/user/login'); // Redirect to login page after logout
    });
});


user.post('/signUp', async (req, res) => {
    const userData = {
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.body.email,
        password: req.body.password
    };

    try {

        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return res.render('signUp', { title: "Sign-Up Page", message: 'User already exists' });
        }
        else {
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds)
            userData.password = hashedPassword;


            // if new user
            const newUser = new User(userData);
            await newUser.save();
            //  create session for the new user
            req.session.userId = newUser._id;
            req.session.email = newUser.email;

            res.render('../views/user/home', { title: "Home Page", message: 'Welcome' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving user data');
    }
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

user.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //email validation
    if (!emailRegex.test(email)) {
        return res.render('../views/user/login', { message: 'Invalid email format', title: 'Login System' });
    }

    try {
        // Find user in the database
        const user = await User.findOne({ email: email });
        //console.log(user)

        // If user doesn't exist or password is incorrect, return error
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('../views/user/login', { message: 'Invalid email or password', title: 'Login System' });
        }
        
        
        req.session.userId = user._id;
        req.session.email = user.email;

        // If user exists and password is correct, redirect to home page
        res.redirect('/user/home');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

user.get('/home', async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.render('../views/user/login', { message: 'No session found', title: 'Login System' });
    }
    res.render('../views/user/home', { message: '', title: 'Home Page' });
});

function getSaltFromUsername(username) {
    return bcrypt.genSalt(saltRounds, function (err, salt) {
        return username;
    })
}


module.exports = user