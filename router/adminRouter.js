const express = require('express')
const admin = express.Router()
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
    res.render('../views/admin/console', {title:'Dashboard'})
})
admin.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === adminCredential.username && password === adminCredential.password) {
        res.render('../views/admin/console', {
            title: 'Admin Management Console',
            message: ''
        })
        // res.send('Welcome to the admin page!');
    } else {
        res.send('Invalid credentials');
    }
});


// Route for Admin Page
admin.get('/console', async (req, res) => {
    try {
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