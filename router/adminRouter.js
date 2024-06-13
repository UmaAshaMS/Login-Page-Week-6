"use strict";
/*jslint es6 */
const express = require('express');
const admin = express.Router();
const { mongoose, User } = require("../config");
//const User = require('./user'); // Path to your User model file



const adminCredential = {
    username: 'admin@admin.com',
    password: 'password'
};

admin.get('/login', (req, res) => {
    res.render('../views/admin/login',{title:'Admin Page'});
});

admin.get('/console', (req,res) => {
    res.render('../views/admin/console', {title:'Dashboard', users: [
        {
            firstName: "Nannu",
            lastName: "Vaava",
            email: "nannu_vaava@nandanam.com"
        },
        {
            firstName: "Kutti",
            lastName: "Vaava",
            email: "kutti_vaava@nandanam.com"
        }
    ]});
})
admin.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === adminCredential.username && password === adminCredential.password) {
        res.redirect('/admin/console');
        // res.send('Welcome to the admin page!');
    } else {
        res.send('Invalid credentials');
    }
});


// Route for Admin Page
admin.get('/console', async (req, res) => {
    try {
        // check for an active admin session
        // if session is not of admin user or no session, return 403 or 401 response accordingly
        // an unauthorized page would be nice.

        // Fetch user data from MongoDB
        const users = await User.find({});


        // Render admin page template and pass user data
        res.render('console', { title: 'Admin Page', users: users });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Error fetching user data');
    }
});








module.exports = admin